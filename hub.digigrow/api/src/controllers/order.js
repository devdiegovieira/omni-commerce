const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getUserByToken } = require('./../../../lib/data/user');
const { upsertQueue } = require('./../../../lib/data/queue');
const { sendOrderInvoice, getOrderLabel, putOrderStatus, getOrderSummary, getOrderList } = require('./../../../lib/data/order');
const { getErrorMessage } = require('../../../lib/util/error');

router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let { orderids, sellerids } = req.query;
    if (!orderids) throw 'Req param orderIds needed!';


    let filterOrder = {
      // sellerId: { $in: user.sellerIds },
      $or: [
        { externalId: { $in: orderids.split(',').map(m => { return parseFloat(m) }) } },
        { packId: { $in: orderids.split(',').map(m => { return parseFloat(m) }) } }
      ],
      sellerId: { $in: sellerids ? sellerids.split(',').map(m => { return new ObjectId(m) }) : user.sellerIds }
    };

    let orderColl = db.collection('order');
    let orders = await orderColl.find(filterOrder).toArray();

    res.status(200).json(orders);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.put('/status', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);


    if (!req.body) throw `Body is needed!`;
    if (!Array.isArray(req.body)) throw `Body isn't valid array`;

    let body = req.body.filter(f => f.status == 3 || f.status == 4 || f.status == 9)
    console.log(body)

    let retorno = [];
    for (statusInfo of body) {
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

    res.status(200).send(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
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

router.get('/count', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let {
      localDateStart,
      localDateEnd
    } = req.query;

    res.status(200).json(await getOrderSummary(db, user, localDateStart, localDateEnd));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let orderCollection = db.collection('order');

    // let id = new ObjectId(req.body._id);
    if (req.body.marketPlaceId) req.body.marketPlaceId = new ObjectId(req.body.marketPlaceId);
    delete req.body._id;

    let orders =
      await orderCollection.updateOne({ 'externalId': req.body.externalId }, { $set: { ...req.body, sellerId: req.headers.sellerId, userId: user._id, updatedAt: new Date() } }, { upsert: true });

    id = orders.upsertedId._id;

    await upsertQueue(
      db, 'ORDER', 'API', new ObjectId(req.headers.sellerId), null, null,
      user._id, { 'content.orderId': id }, { 'content.orderId': id }
    );

    res.status(200).json({ orderId: id });
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/invoice', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    if (!req.headers.orderid) throw `Header > orderId is required!`;
    if (!req.body.nfeproc.nfe.infnfe) throw `Invalid NFe XML on body.`

    let infNfe = req.body.nfeproc.nfe.infnfe;

    res.status(200).send(
      await sendOrderInvoice(
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

router.get('/label', async (req, res) => {
  try {
    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);
    if (!req.headers.orderid) throw `Header > orderId is required!`;

    let label = await getOrderLabel(db, user, req.headers.orderid)

    res.status(200).send(label);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err.message ? err.message : err.response ? err.response.data : JSON.stringify(err));
  }
});

router.get('/queue', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let { sellerIds } = req.query;
    let sllerReqFilter = {};

    if (sellerIds) sllerReqFilter = {
      sellerId: {
        $in: sellerIds.split(',').map(m => {
          return new ObjectId(m)
        })
      }
    };

    let queueCollection = db.collection('queue');

    let queue = await queueCollection.find({
      ...sllerReqFilter,
      sellerId: { $in: user.sellerIds },
      operation: 'ORDER',
      type: 'API'
    }).toArray();

    res.status(200).json(queue);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/queue', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    if (!Array.isArray(req.body)) throw 'O corpo da requisição não é um array de sku válido';
    if (req.body.length > 500) throw 'O corpo da requisição não pode conter mais do que 500 queues';


    let marketPlaceColl = db.collection('marketPlace');
    let marketPlaces = await marketPlaceColl.find({
      _id: { $in: req.body.map(m => { return new ObjectId(m.marketPlaceId) }) },
      $or: [{ sellerId: { $in: user.sellerIds } }, { sellerId: null }]
    }).toArray();

    let retorno = [];

    let queueColl = db.collection('queue');
    let orderColl = db.collection('order');


    for (queue of req.body) {
      try {
        if (!queue.marketPlaceId) throw `queue > marketPlaceId is empty`;
        if (!queue.sellerId) throw `queue > sellerId is empty`;
        let marketPlace = marketPlaces.find(f => f._id.equals(new ObjectId(queue.marketPlaceId)));
        if (!marketPlace) throw `marketPlace by id no found to this user`;

        // delete filas
        await queueColl.deleteMany({ 'content.externalId': queue.externalId, marketPlaceId: marketPlace._id });

        // deleta pedido
        await orderColl.deleteMany({ externalId: queue.externalId, marketPlaceId: marketPlace._id });

        await upsertQueue(
          db, 'ORDER', 'MKP', new ObjectId(queue.sellerId), marketPlace.platformId,
          marketPlace._id, user.name, { 'content.externalId': queue.externalId }, { 'content.externalId': queue.externalId }
        );

        retorno.push({ queue, success: true });
      } catch (error) {
        retorno.push({ queue, success: false, message: error });
      }
    }

    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.delete('/queue', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    if (!req.body.length) throw 'O body da requisição não é um array válido';

    let queueColl = db.collection('queue');

    await queueColl.deleteMany({
      _id: {
        $in: req.body.map(m => { return new ObjectId(m) })
      },
      sellerId: {
        $in: user.sellerIds
      }
    });

    res.status(200).json(req.body.map(m => { return { queueId: m, deletedAt: new Date() } }));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});


module.exports = app => app.use('/v1/order', router);