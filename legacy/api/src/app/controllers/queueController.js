const express = require('express');
const authentication = require('../middlewares/authMiddleware');
const { deleteQueue, getQueuePrice, getQueueStock, getQueueStatus, postSync} = require('../data/queue');    
const getCliente = require('../helper/cliente');

const router = express.Router();
// Protege endpoint com BEARER
router.use(authentication);

router.delete('/', async (req, res) => {
  try {
    if (!req.body.length) throw 'A requisição não é um array de ids válido';

    let { connectionString } = await getCliente(req, req.mongoConnection);
    await deleteQueue(connectionString, req.body);

    res.status(200).json({});

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/price', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);
    
    let price = await getQueuePrice(connectionString, tokenAccount);
    res.status(200).json(price);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/stock', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);
    
    let stock = await getQueueStock(connectionString, tokenAccount);
    res.status(200).json(stock);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/status', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);
    
    let status = await getQueueStatus(connectionString, tokenAccount);
    res.status(200).json(status);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.post('/sync', async (req, res) => {
  try {
    let { tokenAccount, connectionString } = await getCliente(req, req.mongoConnection);
    
    let sku = req.body;
    
    let stock = await postSync(connectionString, tokenAccount, sku);
    res.status(200).json(stock);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

module.exports = app => app.use('/queue', router);