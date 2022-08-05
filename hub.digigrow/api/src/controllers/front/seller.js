const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const { isValidCnpj } = require('./../../../../lib/util/form');
const { getUserByToken, checkSellerByUserToken, updateSellerPic, updateSellerPicCNPJ } = require('./../../../../lib/data/user');
const { getErrorMessage } = require('./../../../../lib/util/error');
const { sendMail } = require('../../../../lib/util/mail');
const { encode } = require('../../../../lib/util/base64');
const { escapeSpecialChar } = require('../../../../lib/util/javaScript');
const { uploadFileS3, deleteFileS3 } = require('../../../../lib/util/storage');

router.post('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let sellerColl = db.collection('seller');

    let {
      name,
      code,
      document,
      syncStock,
      conclusiondate,
      cpf,
      userName,
      accountType,
      account,
      agency,
      bank,
      comp,
      rg,
      number,
      address,
      neighborhood,
      city,
      state,
      phone,
      cep,
      ie,
      taxRegime
    } = req.body;

    if (!name) throw `Nome necessário!`;
    if (!code) throw `body > code is needed!`;
    if (!document) throw `Preencher documento!`;
    if (!cpf) throw `Preencher cpf!`;
    if (!userName) throw `Preencher nome de usuário!`;
    // if (!accountType) throw `Preencher tipo de conta!`;
    // if (!account) throw `Preenncher Conta`;
    if (!rg) throw `Preencher RG do usuário!`;
    if (!number) throw `Preencher número do endereço!`;
    if (!address) throw `Preencher Endereço!`;
    if (!neighborhood) throw `Preencher bairro !`;
    if (!city) throw `Preencher cidade!`;
    if (!state) throw `Preencher estado!`;
    if (!phone) throw `Preencher telefone!`;
    if (!cep) throw `Preencher cep!`;
    if (!ie) throw `Preencher Inscrição Estadual!`;
    if (!taxRegime) throw `Preencher Regime Tributário!`;
    if (!syncStock) syncStock = false

    if (!isValidCnpj(document.toString())) throw 'cnpj invalido!'

    let contractDefault = await db.collection('contract').findOne({ default: true });

    if (await sellerColl.findOne({ document }))
      throw ` Empresa  ${document
      } já possui cadastro no hub, caso você seja o administrador desta empresa por favor entre em contato com o suporte para resolver o problema.`;

    let logFields = {
      createdAt: new Date(),
      createdUser: user.document
    };

    let { insertedId } = await sellerColl.insertOne({
      name,
      userName,
      rg,
      status: 'pending',
      accountType,
      account,
      agency,
      bank,
      cpf,
      comp,
      number,
      address,
      neighborhood,
      city,
      ie,
      taxRegime,
      state,
      phone,
      cep,
      code,
      document,
      syncStock,
      contractId: contractDefault._id,
      transactionSequence: 0,
      ...logFields,
      conclusiondate: Number(conclusiondate)
    });

    if (insertedId) {
      let userXSellerColl = db.collection('userXSeller');

      let teste = await userXSellerColl.insertOne({
        userId: user._id,
        sellerId: insertedId,
        admin: true,
        userMail: user.mail,
        ...logFields
      });
    }

    res.status(200).json(insertedId);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});
router.put('/confirmseller', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    let user = getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let sellerId = new ObjectId(req.body.sellerId)

    await sellerColl.updateOne({ _id: sellerId }, { $set: { status: 'concluded' } });

    return res.status(200).json({});

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/:sellerid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let sellerCol = db.collection('seller');
    let { sellerid } = req.params;
    let {
      name,
      code,
      document,
      syncStock,
      conclusiondate,
      cpf,
      userName,
      accountType,
      account,
      agency,
      comp,
      bank,
      rg,
      number,
      address,
      neighborhood,
      city,
      state,
      phone,
      cep,
      ie,
      taxRegime
    } = req.body;
    if (!name) throw `Nome necessário!`;
    if (!code) throw `body > code is needed!`;
    if (!document) throw `Preencher documento!`;
    if (!cpf) throw `Preencher cpf!`;
    if (!userName) throw `Preencher nome de usuário!`;
    // if (!accountType) throw `Preencher tipo de conta!`;
    // if (!account) throw `Preenncher Conta`;
    if (!rg) throw `Preencher RG do usuário!`;
    if (!number) throw `Preencher número do endereço!`;
    if (!address) throw `Preencher Endereço!`;
    if (!neighborhood) throw `Preencher bairro !`;
    if (!city) throw `Preencher cidade!`;
    if (!state) throw `Preencher estado!`;
    if (!phone) throw `Preencher telefone!`;
    if (!cep) throw `Preencher cep!`;
    if (!ie) throw `Preencher Inscrição Estadual!`;
    if (!taxRegime) throw `Preencher Regime Tributário!`;

    if (!isValidCnpj(document.toString())) throw 'cnpj invalido !';

    let sellerColl = db.collection('seller');

    if (await sellerColl.findOne({ document, _id: { $ne: ObjectId(sellerid) } }))
      throw ` Empresa  ${document} já possui cadastro no hub, caso você seja o administrador desta empresa por favor entre em contato com o suporte para resolver o problema.`;

    let { matchedCount } = await sellerCol.updateOne(
      {
        _id: new ObjectId(sellerid)
      },
      {
        $set: {
          name,
          code,
          userName,
          cpf,
          ie,
          comp,
          taxRegime,
          accountType,
          account,
          agency,
          bank,
          rg,
          number,
          address,
          neighborhood,
          city,
          state,
          phone,
          cep,
          document,
          syncStock,
          updatedAt: new Date(),
          updatedUser: user.document,
          conclusiondate: Number(conclusiondate)
        }
      }
    );


    if (req.body.imageDeleted && req.body.imageDeleted.length > 0) {
      for (image of req.body.imageDeleted) {
        await deleteFileS3(image);
      }
    }
    if (req.body.imageDeletedCs && req.body.imageDeletedCs.length > 0) {
      for (image of req.body.imageDeletedCs) {
        await deleteFileS3(image);
      }
    }

    if (req.body.imageDeleted) await sellerCol.updateOne({ _id: new ObjectId(sellerid) }, { $set: { images: req.body.images } })
    if (req.body.imageDeletedCs) await sellerCol.updateOne({ _id: new ObjectId(sellerid) }, { $set: { imagesCs: req.body.imagesCs } })
    if (matchedCount == 0) throw `Seller by id ${sellerid} not found`;

    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/:sellerid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    if (!req.params.sellerid) throw 'sellerId needed!'

    let validateSKu = await db.collection('sku').findOne({ sellerId: new ObjectId(req.params.sellerid) });

    if (validateSKu) throw 'Não é possível realizar a exclusão da empresa, existe cadastro atrelado a empresa !'

    let sellerIds = req.params.sellerid.split(',').map(m => { return new ObjectId(m) });

    let user = await getUserByToken(req.headers, db);

    sellerIds.forEach(f => checkSellerByUserToken(user, f));

    let sellerCol = db.collection('seller');

    await sellerCol.updateMany(
      {
        _id: { $in: sellerIds }
      },
      {
        $set: {
          deletedAt: new Date()
        }
      }
    );

    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let userXSellerColl = db.collection('userXSeller');
    let userColl = db.collection('user');

    let filter = {};

    if (req.query?.document) filter['document'] = new RegExp(".*" + escapeSpecialChar(req.query?.document) + ".*", "i");
    else {
      filter['_id'] = { $in: user.sellerIds };
    };

    if (req.query?.code) filter['code'] = new RegExp(".*" + escapeSpecialChar(req.query?.code) + ".*", "i")
    if (req.query.status) filter['status'] = req.query.status

    let sellerList = await sellerColl.find(filter).sort(
      { name: 1 }
    ).toArray();

    let userXSellers =
      await userXSellerColl.find(
        {
          sellerId: {
            $in: sellerList.map(m => {
              return m._id
            })
          }
        }
      ).toArray();

    let users =
      await userColl.find(
        {
          _id: {
            $in: userXSellers.map(m => {
              return m.userId
            })
          }
        }
      ).toArray();


    res.status(200).json(
      sellerList.map(seller => {
        let userXSeller = userXSellers.filter(f =>
          f.sellerId.equals(seller._id)
        );

        return {
          ...seller,
          users: userXSeller.map(m => {
            let user = users.find(f => f._id.equals(m.userId));
            return user ? { userName: user.name, userImage: user.picture } : null;
          })
        }
      }
      ));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:sellerId/user', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let userXSellerColl = db.collection('userXSeller');
    let userColl = db.collection('user');

    let { sellerId } = req.params;
    if (sellerId != 'new') {
      checkSellerByUserToken(user, new ObjectId(sellerId));


      let userXSeller =
        await userXSellerColl.find(
          {
            sellerId: new ObjectId(sellerId)
          }
        ).toArray();

      let users =
        await userColl.find(
          {
            _id: {
              $in: userXSeller.map(m => { return m.userId })
            }
          }
        ).toArray();

      res.status(200).json(userXSeller.map(m => {
        let user = users.find(f => f._id.equals(m.userId))
        return {
          ...m,
          userMail: user ? user.mail : m.userMail,
          userName: user ? user.name : '',
          userImage: user ? user.picture : '',
          pending: user ? false : true
        }
      }));
    }
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/:sellerId/users/:userXSellerId', async (req, res) => {
  try {
    if (!req.params.sellerId) throw 'sellerId needed!'
    if (!req.params.userXSellerId) throw 'userId needed!'

    let userXSellerIds = req.params.userXSellerId.split(',').map(m => { return new ObjectId(m) });

    let db = req.mongoConnection;


    let userXSellerCol = db.collection('userXSeller');
    let ret = await userXSellerCol.find({ _id: { $in: userXSellerIds } }).toArray();
    let user = await getUserByToken(req.headers, db, true, true, new ObjectId(req.params.sellerId));

    let userExists = ret.filter(f => f.userId != null)
    if (userExists) {
      let isUser = userExists.map(m => m.userId.equals(user._id))
      if (isUser.find(m => m === true)) throw 'Usuário não pode alterar próprio status'

      let check = await userXSellerCol.find({ sellerId: new ObjectId(req.params.sellerId) }).toArray();

      if ((check.length <= 1) || (check.length == userXSellerIds.length)) throw 'A empresa deve ter ao menos 1 usuário'


      await userXSellerCol.deleteMany(
        {
          _id: { $in: userExists.map(m => m._id) }
        }
      );
    }


    let pendingUser = ret.filter(f => f.userId == null)
    if (pendingUser) {
      await userXSellerCol.deleteMany(
        {
          _id: { $in: pendingUser.map(m => m._id) }
        }
      )
    }


    res.status(200).send();

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/conclusion', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let sellerId = user.sellerIds[0]
    let conclusiondate = await sellerColl.find({ sellerId }, { projection: { conclusiondate: 1 } }).toArray();

    res.status(200).send(conclusiondate);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/pic/:sellerId', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let images = [];
    let arrayFinal = [];

    req.params

    if (req.files) {

      req.files.image = req.files.image ? req.files.image : []

      if (Array.isArray(req.files.image))
        images.push(...req.files.image);
      else
        images.push(req.files.image);



      for (let image of images) {
        let retAws = await uploadFileS3(image.data, `${req.params.sellerId}-${new Date()}-${image.name}`);
        arrayFinal.push(retAws)

      }
    }

    await sellerColl.updateOne({ _id: new ObjectId(req.params.sellerId) }, { $push: { images: { $each: arrayFinal } } })




    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/picCs/:sellerId', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let images = [];
    let arrayFinal = [];

    req.params

    if (req.files) {

      req.files.image = req.files.image ? req.files.image : []

      if (Array.isArray(req.files.image))
        images.push(...req.files.image);
      else
        images.push(req.files.image);



      for (let image of images) {
        let retAws = await uploadFileS3(image.data, `${req.params.sellerId}-${new Date()}-${image.name}`);
        arrayFinal.push(retAws)

      }
    }

    await sellerColl.updateOne({ _id: new ObjectId(req.params.sellerId) }, { $push: { imagesCs: { $each: arrayFinal } } })




    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/user', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let configColl = db.collection('config');
    let config = await configColl.findOne({})
    let userColl = db.collection('user');
    let userXSellerCol = db.collection('userXSeller');
    let { sellerIds, userMail } = req.body;

    if (!sellerIds || !Array.isArray(sellerIds) || sellerIds.length == 0)
      throw 'sellerId needs to be a valid array of string';

    if (!userMail) throw 'userId needed!';

    let doubleCheckUser = await userXSellerCol.find({ sellerId: { $in: sellerIds.map(m => new ObjectId(m)) }, userMail }).toArray();
    if (doubleCheckUser.length > 0) throw 'Usuário já adicionado à empresa'


    let user = await getUserByToken(req.headers, db);

    sellerIds.forEach(f => checkSellerByUserToken(user, new ObjectId(f)));

    let newUser = await userColl.findOne({ mail: userMail });


    for (let sellerId of sellerIds) {
      sellerId = new ObjectId(sellerId);
      await userXSellerCol.updateOne(
        {
          sellerId,
          userMail
        },
        {
          $setOnInsert: { createdAt: new Date(), createdUser: user.document },
          $set: {
            userId: newUser ? newUser._id : undefined,
            sellerId,
            userMail
          }
        },
        {
          upsert: true
        }
      );
    }


    if (!newUser) {
      await sendMail(userMail,
        'Convite DigiGrowHub!',
        `Você acaba de receber um convite de ${user.name} para fazer acessar o Digirow Hub, para completar o cadastro acesse o link: https://app.digigrow.com.br/register/${encode(userMail)}`,
        config,
      )
    }



    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:sellerId', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let { sellerId } = req.params;
    let user = await getUserByToken(req.headers, db);
    let sellerColl = db.collection('seller');
    let contractColl = db.collection('contract');

    if (sellerId != 'new') {

      checkSellerByUserToken(user, new ObjectId(sellerId));


      let seller = await sellerColl.find(
        {
          _id: new ObjectId(sellerId),
          deletedAt: {
            $exists: false
          }
        }
      ).toArray();


      let sellerIdContract = await contractColl.find({ _id: { $in: seller.map(m => m.contractId) } }).toArray();


      let ret = seller.map(m => {
        return {
          ...m,
          contractName: sellerIdContract.find(f => f._id.equals(m.contractId)).name,
          saleFee: sellerIdContract.find(f => f._id.equals(m.contractId)).saleFee.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 2 }),
          freightClientFee: sellerIdContract.find(f => f._id.equals(m.contractId)).freightClientFee,
          freightSellerFee: sellerIdContract.find(f => f._id.equals(m.contractId)).freightSellerFee
        }
      })

      res.status(200).json(...ret);
    }
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

module.exports = app => app.use('/v1/front/seller', router);
