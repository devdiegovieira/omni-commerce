const express = require('express');
const authentication = require('../middlewares/authMiddleware');
const { getSku, getSkuStatus} = require('../data/sku');    
const getCliente = require('./../helper/cliente');

const router = express.Router();
// Protege endpoint com BEARER
router.use(authentication);

router.get('/status', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);
    
    let {offset, limit, all} = req.query;
    offset = offset ? Number.parseInt(offset) : 0;
    limit = limit ? Number.parseInt(limit) : 100;

    let status = await getSkuStatus(connectionString, tokenAccount, all, null, offset, limit);

    res.status(200).json({
      total: status.total,
      offset,
      limit,
      items: status.list
    });

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/:sku/status', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);
    
    let {all} = req.query;
    let status = await getSkuStatus(connectionString, tokenAccount, all, req.params.sku);

    res.status(200).json(status.list[0]);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);
    
    let {offset, limit, all} = req.query;
    offset = offset ? Number.parseInt(offset) : 0;
    limit = limit ? Number.parseInt(limit) : 100;

    let status = await getSku(connectionString, tokenAccount, all, null, offset, limit);

    res.status(200).json({
      total: status.total,
      offset,
      limit,
      items: status.list
    });
  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }   
});

router.get('/:sku', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);

    let {all} = req.query;
    let status = await getSku(connectionString, tokenAccount, all, req.params.sku);

    res.status(200).json(status.list[0]);
  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/product', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);
    
    let {offset, limit, all} = req.query;
    offset = offset ? Number.parseInt(offset) : 0;
    limit = limit ? Number.parseInt(limit) : 100;

    let status = await getSkuStatus(connectionString, tokenAccount, all, null, offset, limit);

    res.status(200).json({
      total: status.total,
      offset,
      limit,
      items: status.list
    });

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});

router.get('/:product/product', async (req, res) => {
  try {
    let {tokenAccount, connectionString} = await getCliente(req, req.mongoConnection);
    
    let {all} = req.query;
    let status = await getSkuStatus(connectionString, tokenAccount, all, req.params.sku);

    res.status(200).json(status.list[0]);

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  }
});


module.exports = app => app.use('/sku', router);