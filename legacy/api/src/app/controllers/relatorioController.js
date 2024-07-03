const express = require('express');
const authentication = require('../middlewares/authMiddleware');
const { getDayOrderAmount, getDayBillingAmount, getCumulativeMonthBilling, getCutOfMonth, getPostedOrders, getSaleSlip } = require('../data/relatorios');
const getCliente = require('./../helper/cliente');

const router = express.Router();
// Protege endpoint com BEARER
// router.use(authentication);

router.get('/order/salesslip/:order', async (req, res) => {
  try {
   
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let amountDayBillingAmount = await getSaleSlip(connectionString, tokenAccount, req.params );

    res.status(200).json(amountDayBillingAmount);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/dayOrderAmount/:tokenaccount/:authorization', async (req, res) => {
  try {


    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);


    res.status(200).json(await getDayOrderAmount(connectionString, tokenAccount));

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/dayBillingAmount/:tokenaccount/:authorization', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);
    res.status(200).json(await getDayBillingAmount(connectionString, tokenAccount, req.query));

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/cumulativeMonthBilling/:tokenaccount/:authorization', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let amountDayBillingAmount = await getCumulativeMonthBilling(connectionString, tokenAccount);


    res.status(200).json(amountDayBillingAmount);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/cutOfMonth/:tokenaccount/:authorization', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let amountDayBillingAmount = await getCutOfMonth(connectionString, tokenAccount);

    res.status(200).json(amountDayBillingAmount);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/postedOrders/:tokenaccount/:authorization', async (req, res) => {
  try {

    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let amountDayBillingAmount = await getPostedOrders(connectionString, tokenAccount);

    res.status(200).json(amountDayBillingAmount);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});



module.exports = app => app.use('/dashboard', router);