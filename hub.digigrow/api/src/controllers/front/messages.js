const express = require('express');
const { getUserByToken } = require('./../../../../lib/data/user');
const { ObjectId } = require('mongodb');
const { meliQuestions, meliQuestionDelete } = require('../../../../lib/data/message');
const { deleteQuestionsMeli } = require('../../../../lib/http/mercadoLivre');
const router = express.Router();

router.get('/list', async (req, res) => {
  try {

    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);
    let messagesColl = db.collection('messages');
    let sellerColl = db.collection('seller');

    let sellerId = req.query.sellerId ? req.query.sellerId.map(m=> new ObjectId(m)) : user.sellerIds

    let meliQuestions = await messagesColl.find({ type: 'QUESTIONS', deleted: { $exists: false }, answser: '', sellerId: { $in: sellerId } }).sort({ createdAt: 1 }).limit(100).toArray();

    let sellers = await sellerColl.find({ _id: { $in: meliQuestions.map(m => m.sellerId) } }).toArray();





    res.status(200).json(meliQuestions.map(m => {
      return {
        ...m,
        sellerName: sellers.find(f => f._id.equals(m.sellerId)).name
      }
    }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/count', async (req, res) => {
  try {

    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);
    let messagesColl = await db.collection('messages');

    let meliQuestions = await messagesColl.find({ type: 'QUESTIONS', answser: '', sellerId: { $in: user.sellerIds } }).toArray();

    res.status(200).json({ questionsCount: meliQuestions.length });

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/checkReadMessages', async (req, res) => {

  try {

    let db = req.mongoConnection;

    let messageColl = db.collection('messages');

    let { externalId } = req.body;

    await messageColl.updateMany({ externalId: externalId }, { "$set": { read: true } });

    res.status(200).json();

  } catch (err) {

    res.status(err && !err.auth ? 400 : 401).json(err);
  }


});

router.post('/responsequestions', async (req, res) => {
  try {

    let { sellerInfos, message } = req.body;
    let db = req.mongoConnection;

    let configColl = db.collection('config');
    let config = await configColl.findOne({});

    await meliQuestions(db, sellerInfos, message, config)

    res.status(200).json();

  } catch (err) {

    res.status(err && !err.auth ? 400 : 401).json(err);
  }

});

router.delete('/deletequestion', async (req, res) => {
  try {

    let { sellerInfos } = req.body;
    let db = req.mongoConnection;

    await meliQuestionDelete(db, sellerInfos)

    res.status(200).json();

  } catch (err) {

    res.status(err && !err.auth ? 400 : 401).json(err);
  }

})

module.exports = app => app.use('/v1/front/messages', router);



