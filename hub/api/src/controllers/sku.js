const express = require('express');
const { getUserByToken } = require('./../../../lib/data/user');
const _ = require('lodash');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { upsertSku } = require('../../../lib/data/sku');
const { upsertQueue } = require('../../../lib/data/queue');

router.get('/', async (req, res) => {
  try {
    let retorno = {};
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let { skus, offset, limit } = req.query;
    let { sellerIds } = req.query;

    let filtro = { sellerId: { $in: user.sellerIds } };

    if (skus) filtro.sku = { $in: skus.split(',') };
    let sllerReqFilter = {}
    if (sellerIds) sllerReqFilter = { 'sellerId': { $in: sellerIds.split(',').map(m => { return new ObjectId(m) }) } };

    offset = parseInt(offset ? offset : 0);
    limit = parseInt(limit ? limit : 500);

    let sku = db.collection('sku');
    let skuList = await sku.find({ ...filtro, ...sllerReqFilter })
      .limit(limit)
      .skip(offset)
      .toArray();

    retorno = {
      total: await sku.count({ ...filtro, ...sllerReqFilter }),
      offset,
      limit,
      items: skuList
    };

    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
})

router.put('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let ret = await upsertSku(db, req.body.map(m => {
      return {
        ...m,
        sellerId: new ObjectId(req.headers.sellerid)
      }
    }), user);

    res.status(200).json(ret);
  } catch (err) {
    res.status(!err.auth ? 400 : 401).json(err);
  }

});

router.put('/stockAndPrice', async (req, res) => {
  try {
    let db = req.mongoConnection;

    if (!Array.isArray(req.body)) throw 'O corpo da requisição não é um array de sku válido';
    if (req.body.length > 500) throw 'O corpo da requisição não pode conter mais do que 500 skus';

    let user = await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku');
    let sellerId = new ObjectId(req.headers.sellerid);
    let retorno = [];

    let skuXPublishCollection = db.collection('skuXPublish');
    let skuXPublishList = await skuXPublishCollection.find({ sellerId, sku: { $in: req.body.map(m => { return m.sku }) } }).toArray();

    let skusBody = req.body.map(m => m.sku);
    let skusMongo = await skuCollection.find({ sku: { $in: skusBody } }).toArray();
    let skuFilter

    let kitSKu = [];

    skusMongo.map(m => {
      if (m.kit) {
        kitSKu.push(m.sku);
      }
    });

    for (let skuBody of req.body) {
      try {

        if (!skuBody.sku == kitSKu.filter(f => f == skuBody.sku)) {

          let publishies = skuXPublishList.filter(f => f.sku == skuBody.sku);

          if (!skuBody.sku) throw `sku is required!`;

          if (skuBody.stock >= 0 && !skuBody.price)
            throw `On update sku > STOCK you need to pass sku > PRICE. This is mandatory to avoid selling with wrong price when activating ads!`;

          //sku
          if (skuBody.price || skuBody.stock) {
            if (skusMongo.length > 0) {
              skuFilter = skusMongo.filter(item => item.sku === skuBody.sku)
              if (skuFilter[0].price !== skuBody.price) skuBody.priceOld = skuFilter[0].price
              if (skuFilter[0].stock !== skuBody.stock) skuBody.stockOld = skuFilter[0].stock
            }
          }

          await skuCollection.updateOne(
            { 'sku': skuBody.sku, sellerId },
            { $set: { ...skuBody, sellerId, updatedAt: new Date() } },
            { upsert: true });

          if (publishies) {
            let content = skuBody;

            let platforms = _.groupBy(publishies, 'platformId');
            for (let platform in platforms) {
              let item = platforms[platform][0];

              await upsertQueue(
                db, 'SKU', 'MKP', sellerId, item.platformId, null, user._id,
                { 'content.sku': content.sku }, { content }
              );
            }
          }
        }

        retorno.push({ sku: skuBody.sku, type: 'success' });
      } catch (error) {
        retorno.push({ sku: skuBody.sku, type: 'error', error: JSON.stringify(error) });
      }
    }

    res.status(200).json(retorno);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err.message ? err.message : err);
  }
});



module.exports = app => app.use('/v1/sku', router);
