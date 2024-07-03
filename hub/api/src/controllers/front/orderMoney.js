const express = require('express');
const { ObjectId, Collection } = require('mongodb');
const { getOrderMoneySummary, getOrderMoneyConcludedMonths, getOrderMoneyReport, getOrderMoneyList } = require('../../../../lib/data/orderMoney');
const router = express.Router();
const { getUserByToken } = require('../../../../lib/data/user');
const { getErrorMessage } = require('../../../../lib/util/error');
const { escapeSpecialChar } = require('../../../../lib/util/javaScript');


router.get('/', async (req, res,) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let data = await getOrderMoneyList(db, req.query, user);


    //getOrderList
    res.status(200).json(data);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});


router.get('/report', async (req, res) => {
  try {

    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db, true);

    let { day, year, month, paymentStatus } = req.query;

    //lista total
    let report = await getOrderMoneyReport(db, req.headers, day, year, month, paymentStatus);
    if (!report) throw 'Não há informações para relatório de fechamento'
    //getOrderList
    res.status(200).json(report);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});


router.get('/concludMonts', async (req, res) => {

  try {

    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);
    let concludedMonths = await getOrderMoneyConcludedMonths(db, user);

    res.status(200).json(concludedMonths);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

});

router.put('/concluded', async (req, res) => {

  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let sellerId = req.body.sellerId ? [new ObjectId(req.body.sellerId)] : user.sellerIds
    let moneyOrderColl = db.collection('moneyOrder');
    let findStatus = await moneyOrderColl.find({ paymentStatus: 'received' }).toArray();
    let _id = findStatus.map(m => m._id);
    let changeStatus = await moneyOrderColl.updateMany({ _id: { $in: _id }, sellerId: { $in: sellerId } }, { $set: { paymentStatus: 'concluded', dateClosed: new Date() } }, { upsert: true });

    res.status(200).json(changeStatus);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

});

router.get('/summary', async (req, res) => {

  try {

    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);

    let { day, year, month, paymentStatus, sellerId } = req.query;

    let lombriga = await getOrderMoneySummary(db, user, day, year, month, paymentStatus, sellerId);

    res.status(200).json(lombriga);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

});



module.exports = app => app.use('/v1/front/ordermoney', router)
