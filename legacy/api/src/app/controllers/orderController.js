const express = require('express');
const authentication = require('../middlewares/authMiddleware');
const getCliente = require('./../helper/cliente');
const { getPayment, getPaymentTime, getOrderSeller, getPartner, getOrderStatus, getOrderNumber } = require('../data/order');

const router = express.Router();
// Protege endpoint com BEARER
router.use(authentication);

router.get('/payment', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let array = 3

    let payment = [];

    for (let index = 0; index < array; index++) {

      let ret = await getPayment(connectionString, tokenAccount);

      payment.push(ret);

      if (Array.isArray(payment)) break;

      return payment;

    }

    res.status(200).json(payment[0].map(m => { return m.Descricao }));
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));
  }
});

router.get('/paymentTime', async (req, res) => {
  try {

    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let array = 3

    let paymentTime = [];

    for (let index = 0; index < array; index++) {

      ret = await getPaymentTime(connectionString, tokenAccount);

      paymentTime.push(ret);

      if (Array.isArray(paymentTime)) break;

      return paymentTime;
    }


    res.status(200).json(paymentTime[0].map(m => { return { id: m.QuantidadeParcelas, descricao: m.Descricao } }));
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));
  }
});

router.get('/seller', async (req, res) => {
  try {

    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let array = 3

    let seller = [];

    for (let index = 0; index < array; index++) {

      let ret = await getOrderSeller(connectionString, tokenAccount);

      seller.push(ret);

      if (Array.isArray(seller)) break;

      return seller;
    }


    res.status(200).json(seller[0].map(m => { return m.nome }));
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));
  }
});

router.get('/partner', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let array = 3

    let partner = [];

    for (let index = 0; index < array; index++) {

      ret = await getPartner(connectionString, tokenAccount, req.query);

      partner.push(ret);

      if (Array.isArray(partner)) break;

      return partner;
    }

    res.status(200).json(partner[0])
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));

  }
});

router.get('/status', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);

    let orderStatus = await getOrderStatus(connectionString, tokenAccount, req.query);

    let retorno = {
      pedido: orderStatus[0].pedido,
      status: orderStatus[0].status,
      valorTotalFaturado: orderStatus[0].valorTotalFaturado,
      itens: orderStatus.map(m => {
        return {
          codigo: m.codigo,
          valorUnit: m.valorUnit,
          valorNegociado: m.valorNegociado,
          quantidade: m.quantidade,
          corte: m.corte ? m.corte : 0
        }
      })
    }

    res.status(200).json(retorno)
      ;
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));

  }
});

router.get('/number', async (req, res) => {
  try {

    let { connectionString } = await getCliente(req, req.mongoConnection);

    let orderStatus;
    for (let i = 0; i < 5; i++) {
      orderStatus = await getOrderNumber(connectionString, req.query);
      if (orderStatus) break;
    };
    res.status(200).json(orderStatus[0]);
  } catch (err) {
    res.status(400).json(err.message ? err.message : JSON.stringify(err));

  }
});

module.exports = app => app.use('/order', router);


