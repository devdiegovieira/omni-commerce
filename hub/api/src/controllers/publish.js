const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { getUserByToken, checkSellerByUserToken } = require('../../../lib/data/user');
const { syncPublishies, postPublishCompatibilities } = require('../../../lib/data/publish');

router.post('/', async (req, res) => {
  try {
    db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db, true);

    // let id = new ObjectId(req.body._id);
    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishiIds`

    let configColl = db.collection('config');
    let config = await configColl.findOne({});

    await syncPublishies(
      db,
      config,
      null,
      new ObjectId(req.headers.sellerid),
      req.body,
      true,
      user.sellerIds
    );

    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.get('/', async (req, res) => {
  try {

    let retorno = {};
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let publishColl = db.collection('publish');

    let {
      sellerid,
      offset,
      limit,
      marketPlaceId
    }
      = req.query;
    if (marketPlaceId) filtro['marketPlaceId'] = new ObjectId(marketPlaceId);
    let filtro = {};

    sellerid = new ObjectId(sellerid);
    await checkSellerByUserToken(user, sellerid);
    filtro.sellerId = sellerid;

    offset = parseInt(offset ? offset : 0);
    limit = parseInt(limit ? limit : 500);

    let publishList = await publishColl.find(filtro)
      .limit(limit)
      .skip(offset)
      .toArray();

    let total = await publishColl.countDocuments(filtro);

    retorno = {
      total,
      offset,
      limit: limit > total ? total : limit,
      items: publishList
    };


    res.status(200).json(retorno);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

module.exports = app => app.use('/v1/publish', router);
