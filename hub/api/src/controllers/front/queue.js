const express = require('express');
const { ObjectId } = require('mongodb');
const { getErrorMessage } = require('../../../../lib/util/error');
const { upsertQueue } = require('./../../../../lib/data/queue');
const { getUserByToken } = require('./../../../../lib/data/user');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let { queuetype } = req.headers;
    let queueColl = db.collection(queuetype);

    let { updatedAt } = req.query;

    let filter = { sellerId: { $in: user.sellerIds } };

    if (queuetype == 'queueSuccess')
      filter.updatedAt = { $gte: updatedAt ? new Date(updatedAt) : new Date(new Date().setDate(new Date().getDate() - 1)) };

    let queue = await queueColl.find(filter).toArray();

    let sellerColl = db.collection('seller');
    let sellers = await sellerColl.find({ _id: { $in: queue.map(m => { return m.sellerId }) } }).toArray();

    let marketPlaceColl = db.collection('marketPlace');
    let marketPlace = await marketPlaceColl.find({ _id: { $in: queue.map(m => { return m.marketPlaceId }) } }).toArray();

    let platformColl = db.collection('platform');
    let platform = await platformColl.find({ _id: { $in: queue.map(m => { return m.platformId }) } }).toArray();


    res.status(200).json(
      queue.map(m => {
        return {
          queueId: m._id,
          platformId: m.platformId,
          platformName: platform.find(f => f._id.equals(m.platformId)) ? platform.find(f => f._id.equals(m.platformId)).name : '',
          marketpaceId: m.marketPlaceId,
          marketpaceName: marketPlace.find(f => f._id.equals(m.marketPlaceId)) ? marketPlace.find(f => f._id.equals(m.marketPlaceId)).name : '',
          sellerId: m.sellerId,
          sellerName: sellers.find(f => f._id.equals(m.sellerId)) ? sellers.find(f => f._id.equals(m.sellerId)).name : '',
          operation: m.operation,
          type: m.type ? m.type : null,
          user: m.userId,
          updatedAt: m.updatedAt,
          external: m.content && m.content.sku ? m.content.sku : m.content && m.content.externalId ? m.content.externalId : '',
          price: m.content ? m.content.price : null,
          stock: m.content ? m.content.stock : null,
          skuOperation: m.content ? m.content.skuOperationo : null,
          errorMsg: Array.isArray(m.errorMsg) ? m.errorMsg.map(err => err.errorMsg).join(' , ') : m.errorMsg
        }
      })
    );

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/status', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let queueColl = db.collection('queue');
    let queueSuccesColl = db.collection('queueSuccess');
    let queueErrorColl = db.collection('queueError');

    let filter = { sellerId: { $in: user.sellerIds } };

    let queueCount = await queueColl.count(filter);
    let queueByOps = await queueColl.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    let queueSuccessCount = await queueSuccesColl.count(({
      ...filter,
      updatedAt: {
        $lt: new Date(),
        $gte: new Date(new Date().setDate(new Date().getDate() - 1))
      }
    }));

    let queueByOpsSuccess = await queueSuccesColl.aggregate([
      {
        $match: {
          ...filter,
          updatedAt: {
            $lt: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))

          }
        }
      },
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 }
        }
      }
    ]).toArray();


    let queueErrorCount = await queueErrorColl.count(filter);
    let queueByOpsError = await queueErrorColl.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$operation",
          count: { $sum: 1 }
        }
      }
    ]).toArray();


    res.status(200).json({
      waiting: {
        count: queueCount,
        byOps: queueByOps
      },
      success: {
        count: queueSuccessCount,
        byOps: queueByOpsSuccess
      },
      error: {
        count: queueErrorCount,
        byOps: queueByOpsError
      },
    });

  }
  catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/deleteQueueError', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db)
    let queueError = await db.collection('queueError').deleteMany({ sellerId: { $in: user.sellerIds } });

    res.status(200).json(queueError)

  } catch (erro) {

    res.status(400).json(erro)
  }

})

router.get('/:queueId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let { queueId } = req.params;
    let { queuetype } = req.headers;
    let queueColl = db.collection(queuetype);

    res.status(200).json(await queueColl.findOne({ sellerId: { $in: user.sellerIds }, _id: new ObjectId(queueId) }));

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db, true);

    let { sellerid } = req.headers;

    let skuXPublishColl = db.collection('skuXPublish');
    let skuColl = db.collection('sku');
    let skuXPublish = await skuXPublishColl.find({
      publishId: { $in: req.body },
      sellerId: { $in: user.sellerIds }
    }).toArray();

    let skus = await skuColl.find({
      sku: { $in: skuXPublish.map(array => array.sku) },
      sellerId: { $in: user.sellerIds }
    }).toArray();

    for (let sku of skus) {
      let content = {
        sku: sku.sku,
        stock: sku.stock
      }

      if (sku.price) content.price = sku.price;

      let skuPublishies = skuXPublish.filter(f => f.sku == sku.sku);

      for (let publish of skuPublishies) {
        await upsertQueue(
          db, 'SKU', 'MKP', sellerid, publish.platformId, null, user._id,
          { 'content.sku': content.sku }, { content }
        );
      }
    }

    res.status(200).json();

  }
  catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

});

module.exports = app => app.use('/v1/front/queue', router)
