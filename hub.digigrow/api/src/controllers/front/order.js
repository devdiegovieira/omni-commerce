const express = require('express');
const router = express.Router();
const { getUserByToken } = require('./../../../../lib/data/user');
const { getOrderReport, getOrderSummary, getOrderList, getOrderDetail, getOrderLabelSaved, sendOrderInvoice, putOrderStatus, putOrderNote, getOrderExpeditionList, getOrderPickingList, getMensagemOrder, mediateOrder, mediateMessageOrder, orderPic } = require('./../../../../lib/data/order');
const { getErrorMessage } = require('./../../../../lib/util/error');
const { uploadFileS3 } = require('../../../../lib/util/storage');
const { getLinkStorage } = require('../../../../lib/http/mercadoLivre');
const { closePlp } = require('../../../../lib/data/freight');

router.post('/file', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let order = db.collection('order');
    let body = req.files

    let arrayFinal = [];
    for (let file of body.image) {
      let path = await uploadFileS3(file.data, file.name);
      arrayFinal.push(path);
    }
    res.status(200).json(
      await sendOrderInvoice(
        db,
        user,
        req.headers.orderid,
        infNfe.$.Id.replace('NFe', ''),
        infNfe.ide.nnf,
        infNfe.ide.serie,
        infNfe.ide.dhemi,
        req.rawBody
      ));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/list', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await getOrderList(db, user, req.query));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/medlist', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let filteredMediations = await getOrderList(db, user, {
      ...req.query, mediation: {
        $exists: true
      }
    })


    res.status(200).json(filteredMediations);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/mediate', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let inputMediate = await mediateOrder(db, req.query, user);

    res.status(200).json(inputMediate);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.put('/mediate', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let images = [];
    let arrayFinal = [];

    if (req.files) {
      req.files.image = req.files.image ? req.files.image : []

      if (Array.isArray(req.files.image))
        images.push(...req.files.image);
      else
        images.push(req.files.image);


      for (let image of images) {
        let retAws = await uploadFileS3(image.data, `${req.query.externalId}.${new Date()}.${image.name}`);
        arrayFinal.push(retAws)

      }
    } else { }


    let inputMediate = await mediateMessageOrder(db, req.query, user, arrayFinal);

    res.status(200).json(inputMediate);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/list/expedition', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let data = req.query;
    let {
      offset,
      limit,
      status,
    } = data;


    res.status(200).json(await getOrderExpeditionList(db, user, offset, limit, status, data));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/count', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let {
      localDateStart,
      localDateEnd
    } = req.query;

    let retorno = await getOrderSummary(db, user, localDateStart, localDateEnd)

    res.status(200).json(retorno);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/status', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);


    if (!req.body) throw `Body is needed!`;
    if (!Array.isArray(req.body)) throw `Body isn't valid array`;

    let retorno = [];
    for (statusInfo of req.body) {
      try {
        await putOrderStatus(
          db,
          user,
          statusInfo
        );

        retorno.push({ success: true, statusInfo });
      } catch (err) {
        let error = err.message ? err.message : err.response ? err.response.data : JSON.stringify(err);
        retorno.push({ success: false, statusInfo, error });
      }
    }

    res.status(200).json(retorno);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/note/:orderId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    if (!req.body.note) req.body.note = null

    await putOrderNote(
      db,
      user,
      req.body.note,
      req.params.orderId
    );


    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/report', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let filePath = await getOrderReport(db, user, req.query);

    res.status(200).json(filePath);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/invoice', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);


    if (!req.headers.orderid) throw `Header > orderId is required!`;
    if (!req.body.nfeproc.nfe.infnfe) throw `Invalid NFe XML on body.`

    let infNfe = req.body.nfeproc.nfe.infnfe;

    res.status(200).json(
      teste = await sendOrderInvoice(
        db,
        user,
        req.headers.orderid,
        infNfe.$.Id.replace('NFe', ''),
        infNfe.ide.nnf,
        infNfe.ide.serie,
        infNfe.ide.dhemi,
        req.rawBody
      )
    );

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err.message ? err.message : err.response ? err.response.data : JSON.stringify(err));
  }
});

router.post('/pickiglist', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let orders = req.body;
    let printed = req.query;
    let ret = await getOrderPickingList(db, user, orders, printed);

    res.status(200).json(ret);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/label/:orderId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let ret = await getOrderLabelSaved(db, user, req.params.orderId)

    res.status(200).json(ret.label);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:orderId', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let teste = await getOrderDetail(db, user, req.params.orderId);
    teste.iOwnMySelf = user.document
    res.status(200).json(teste);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/mensagem/:orderId', async (req, res) => {

  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await getMensagemOrder(db, req.params.orderId, user));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

});

router.get('/getlink', async (req, res) => {

  try {

    let ret = await getLinkStorage(req.params)

    res.status(200).json(ret);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.put('/messagepic/:orderId', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    user = await getUserByToken(req.headers, db);
    let userPic = await orderPic(
      db,
      req.params.orderId,
      req.files.image.data,
      req.files.image.mimetype,
      user
    )
    return res.status(200).json({
      userPic
    });

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/note/:orderId', async (req, res) => {

  try {

    let db = req.mongoConnection;

    let orderColl = db.collection('order');
    let { message, date } = req.body;

    let externalId = req.params.orderId;
    // let order = await orderColl.updateOne({'externalId': Number( externalId )}, { '$pop': {"note":index.index}});

    let order = await orderColl.updateOne({ 'externalId': Number(externalId) }, { '$pull': { "note": { "message": message, "date": new Date(date) } } });

    res.status(200).json(order);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/documentshipping', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let body = req.body;

    let result = await closePlp(db, body);
    res.status(200).json(result);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err.message));

  }

});


module.exports = app => app.use('/v1/front/order', router); 