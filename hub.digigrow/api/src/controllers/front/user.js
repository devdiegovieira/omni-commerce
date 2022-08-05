
const express = require('express');
const { register, generateConfirmationToken, resetPassword, login, getUserByToken, updateUserPic, resetMail, changePassword, changeSuperUser, setAccess } = require('../../../../lib/data/user');
const { getErrorMessage } = require('../../../../lib/util/error');
const { ObjectId } = require('mongodb');
const { decode } = require('../../../../lib/util/base64');
const { escapeSpecialChar } = require('../../../../lib/util/javaScript');
const router = express.Router();


router.post('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let teste = await register(db, req.body)
    res.status(200).json(teste);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/su/password', async (req, res) => {
  try {
    let db = req.mongoConnection;
    res.status(200).json(await resetPassword(db, req.body));
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

router.post('/auth', async (req, res) => {
  try {
    let db = req.mongoConnection;

    let { mail, password, googleToken } = req.body;


    res.status(200).json(await login(db, mail, password, googleToken));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/superuser', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    res.status(200).json(user ? user.su : false);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/confirmMail', async (req, res) => {
  try {

    let db = req.mongoConnection;

    let body = req.body;
    let userColl = db.collection('user');
    let mail = await userColl.findOne({ mail: body.mail })
    if (!body.new && !mail) throw 'E-mail não cadastrado!'

    if (body.new && mail && mail.active) throw 'O e-mail informado já possui cadastro!'

    await generateConfirmationToken(db, body);
    res.status(200).json();
  } catch (err) {
    res.status(400).json(await getErrorMessage(err));
  }
});



router.post('/resetMail', async (req, res) => {
  try {
    let db = req.mongoConnection;

    let body = req.body;

    let userColl = db.collection('user');
    let mail = await userColl.findOne({ mail: body.mail });

    if (!mail) throw 'Email não cadastrado!'

    await generateConfirmationToken(db, req.body);
    res.status(200).json();
  } catch (err) {
    res.status(400).json(await getErrorMessage(err));
  }
});

router.post('/resetPassword', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let userColl = db.collection('user');
    let mail = await userColl.findOne({ mail: req.body.mail });
    if (mail.active == false) throw 'O e-mail informado não possui cadastro!'

    res.status(200).json(await resetPassword(db, req.body));
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});


router.get('/usersPage', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let userColl = db.collection('user');
    let userXSellerColl = db.collection('userXSeller');
    let sellerColl = db.collection('seller');
    let userX = await getUserByToken(req.headers, db);

    await getUserByToken(req.headers, db);

    let { name, document, mail, sellerId, su, limit, offset } = req.query;

    offset = parseInt(offset ? offset : 0);
    limit = parseInt(limit ? limit : 500);

    let filterUser = {};

    if (name) filterUser['name'] = new RegExp(".*" + escapeSpecialChar(name) + ".*", "i");
    if (document) filterUser['document'] = document;
    if (mail) filterUser['mail'] = mail;
    if (su) filterUser['su'] = su == 'false' ? false : true;
    filterUser['deletedAt'] = { $exists: false };
    filterUser['createdAt'] = {$exists: true}


    let user = await userColl.find(filterUser).limit(limit)
      .skip(offset)
      .toArray();

    let userXSellers = await userXSellerColl.find({ userId: { $in: user.map(m => m._id) } }).toArray();

    let sellers = await sellerColl.find({ _id: { $in: userXSellers.map(m => m.sellerId) } }).toArray();

    let ret = user.map(m => {
      let userXSellersByUser = userXSellers.filter(f => f.userId.equals(m._id));
      let sellersByUser = sellers.filter(f => userXSellersByUser.find(ff => f._id.equals(ff.sellerId)));
      return {
        ...m,
        sellerNames: sellersByUser.map(m => m.code).join(', '),
        sellerIds: sellersByUser.map(m => m._id)
      }
    })

    if (sellerId) ret = ret.filter(f => f.sellerIds.find(ff => sellerId.find(m => ObjectId(m).equals(ff))));

    let retFiltered = ret.filter(f => f.document != userX.document);

    let total = await userColl.count({});


    res.status(200).json({ retFiltered, total });
  } catch (err) {
    res.status(400).json(getErrorMessage(err));

  }


})

router.get('/loggeduser', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
})

router.get('/userlist', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let userXSellerColl = db.collection('userXSeller');
    let userColl = db.collection('user');

    let userXSeller = await userXSellerColl.find({ userId: new ObjectId(user._id), admin: true }).toArray();

    userXSeller = await userXSellerColl.find({ sellerId: { $in: userXSeller.map(m => m.sellerId) } }).toArray();

    let users = await userColl.find({ _id: { $in: userXSeller.map(m => m.userId) }, active: true }).toArray();

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

router.post('/changePassword/:userId', async (req, res) => {
  try {
    let db = req.mongoConnection;

    res.status(200).json(await changePassword(db, req.body, req.params.userId));
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

router.get('/:user', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    // let {user} = req.params._id;
    let userCollection = db.collection('user');
    let users = await userCollection.findOne({ _id: new ObjectId(user._id) });



    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

router.post('/resetMail/:userId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    res.status(200).json(await resetMail(db, req.body));
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});


router.put('/:userId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let userCollection = db.collection('user');
    let users = await userCollection.updateOne({ _id: new ObjectId(req.params.userId) }, { $set: { ...req.body } });

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});

router.put('/userpic/:userId', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    getUserByToken(req.headers, db);
    let userPic = await updateUserPic(
      db,
      req.params.userId,
      req.files.image.data,
      req.files.image.mimetype
    )
    return res.status(200).json({
      userPic
    });

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});


router.post('/blockAccess', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let { userIds, active } = req.body;

    await setAccess(db, userIds, active, user);

    res.status(200).json();
  } catch (err) {
    res.status(400).json(getErrorMessage(err));
  }
});


router.post('/removeOrActiveSuperUser', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let { _id, su } = req.body;
    await changeSuperUser(db, _id, su, user)
    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
})



module.exports = app => app.use('/v1/front/user', router);
