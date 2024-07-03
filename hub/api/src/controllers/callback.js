const express = require('express');
const { upsertQueue } = require('../../../lib/data/queue');
const { getErrorMessage } = require('../../../lib/util/error');
const router = express.Router();
const { toFixed } = require('./../../../lib/util/javaScript')


router.post('/', async (req, res) => {
  try {
    if (req.body.topic === 'ordersv2') {

      let db = req.mongoConnection;
      let marketPlace = await db.collection('marketPlace').findOne({ "auth.sellerId": req.body.user_id });
      let id = Number(req.body.resource.split("/")[2]);

      await upsertQueue(
        db, 'ORDER', 'MKP', marketPlace.sellerId, marketPlace.platformId, marketPlace._id,
        'CALLBACKMELI', { 'content.orderId': id }, { 'content.orderId': id }
      );
    }

    if (req.body.topic === 'messages') {

      let db = req.mongoConnection;
      let marketPlace = await db.collection('marketPlace').findOne({ "auth.sellerId": req.body.user_id });
      let id = req.body.resource;

      await upsertQueue(
        db, 'MESSAGES', 'MKP', marketPlace.sellerId, marketPlace.platformId, marketPlace._id,
        'CALLBACKMELI', { 'content.messagesId': id }, { 'content.messagesId': id }
      );
    }

    if (req.body.topic === 'questions') {

      let db = req.mongoConnection;
      let marketPlace = await db.collection('marketPlace').findOne({ "auth.sellerId": req.body.user_id });
      let id = Number(req.body.resource.split("/")[2]);

      await upsertQueue(
        db, 'QUESTIONS', 'MKP', marketPlace.sellerId, marketPlace.platformId, marketPlace._id,
        'CALLBACKMELI', { 'content.questionsId': id }, { 'content.questionsId': id }
      );
    }

    if (req.body.topic === 'shipments') {

      let db = req.mongoConnection;
      let marketPlace = await db.collection('marketPlace').findOne({ "auth.sellerId": req.body.user_id });
      let id = Number(req.body.resource.split("/")[2]);

      await upsertQueue(
        db, 'SHIPPING', 'MKP', marketPlace.sellerId, marketPlace.platformId, marketPlace._id,
        'CALLBACKMELI', { 'content.shippingId': id }, { 'content.shippingId': id }
      );
    }


    res.status(200).send('ok');
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

module.exports = app => app.use('/v1/callback', router);
