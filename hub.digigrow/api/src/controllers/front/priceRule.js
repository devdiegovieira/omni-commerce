const express  = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getAndCheckParamsType } = require('./../../../../lib/util/api');
const { getUserByToken, checkSellerByUserToken } = require('./../../../../lib/data/user');
const { getErrorMessage } = require('../../../../lib/util/error');
const { upsertPriceRule } = require('../../../../lib/data/priceRule');

router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let pricePlaceColl = db.collection('priceRule');
    let priceRule = await pricePlaceColl.find({sellerId: { $in: user.sellerIds } }).toArray();

    let sellerColl = db.collection('seller');
    let sellers = await sellerColl.find({ _id: { $in: priceRule.map(m => { return m.sellerId }) } }).toArray();

    let marketPlaceColl = db.collection('marketPlace');
    let marketPlace = await marketPlaceColl.find({ _id: { $in: priceRule.map(m => { return m.marketPlaceId }) } }).toArray();
    
    let platformColl = db.collection('platform');
    let platform = await platformColl.find({_id: { $in: priceRule.map(m => {return m.platformId}) } }).toArray();

    
    let resultado = priceRule.map(m => {
      let calc = m.calc;
      delete m.calc;
      return {
        ...m,
        value: calc ? calc.value : 0,
        platformName:  platform.find(f => f._id.equals(m.platformId)) ? platform.find(f => f._id.equals(m.platformId)).name : '',
        marketplaceName: marketPlace.find(f => f._id.equals(m.marketPlaceId)) ? marketPlace.find(f => f._id.equals(m.marketPlaceId)).name : '', 
        sellerName: sellers.find(f => f._id.equals(m.sellerId)) ? sellers.find(f => f._id.equals(m.sellerId)).code : '',
        operation: calc ? calc.operation : '+',
      }
    });

  
    res.status(200).json(resultado);

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/options/:platformId', async (req, res) => {//---
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let { platformId } = req.params;

    let priceRuleOptionsColl = db.collection('priceRuleOptions');
    let priceRuleColl = await priceRuleOptionsColl.find({platformId: new ObjectId(platformId)}).sort({sequence:1}).toArray();

  
    res.status(200).json(priceRuleColl);

  } catch (err) {hub
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await upsertPriceRule(db, req.body, user));
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/:priceruleid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);  

    res.status(200).json(await upsertPriceRule(db, req.body, user, req.params.priceruleid));
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/', async (req, res) => {
  try {
    if (!req.query) throw 'priceruleid needed!' 
    let priceruleids = req.query.priceruleid.split(',').map(m => new ObjectId(m));
    
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let priceruleidColl = db.collection('priceRule');
    await priceruleidColl.deleteMany({_id: {$in: priceruleids}, sellerId: {$in: user.sellerIds}});
      
    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:priceruleid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let priceRuleColl = db.collection('priceRule');
    let {priceruleid} = req.params;
    
    let priceRule = await priceRuleColl.findOne({ _id: new ObjectId(priceruleid) })
    checkSellerByUserToken(user, priceRule.sellerId);
  
    res.status(200).json(priceRule);

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

module.exports = app => app.use('/v1/front/pricerule', router);



