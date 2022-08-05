const express = require('express');
const router = express.Router();
const { toFixed } = require('./../../../lib/util/javaScript')
const { ObjectId } = require('mongodb');
const { lte } = require('lodash');
const { calcFreight } = require('../../../lib/data/freight');


router.get('/', async (req, res) => {
  try {

    if (!req.body.seller_id)
      throw 'seller_id require';

    if (req.body.destination.value.length > 8)
      throw { message: 'CEP de destino inválido', error_code: 2 };

    let db = req.mongoConnection;

    let ret = await calcFreight(db, req.body, true);

    res.set('Cache-Control', 'no-store');
    res.status(200).json(ret);

  } catch (err) {
    let { message, error_code, http } = err
    res.status(http ? http : 500).json({
      message: message ? message : typeof err == 'string' ? err : 'Erro interno',
      error_code: error_code ? error_code : 1
    });
  }
});

router.get('/tabelimportfreight', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let freightColl = db.collection('freight');
    let list = req.body;

    if (list.length > 250) throw 'Limit body array 500!'

    let consoleLog = [];

    for (let freight of list) {
      try {
        let { name,
          sellerId,
          zipStart,
          zipEnd,
          weight,
          service,
          price,
          estimated } = freight;

        if (!name) throw 'Name required !'
        if (!sellerId) throw 'sellerId required !'
        if (!zipStart) throw 'zipStart required !'
        if (!zipEnd) throw 'zipEnd required !'
        if (!weight) throw 'weight required !'
        if (!service) throw 'service required !'
        if (!Number.isInteger(price)) throw 'price required !'
        if (!estimated) throw 'estimated required !'

        let data = {
          service: freight.service,
          estimated: freight.estimated,
          zipStart: parseInt(freight.zipStart),
          zipEnd: parseInt(freight.zipEnd),
          values: [{ price: freight.price, weight: freight.weight }]
        }


        await freightColl.updateOne({ name: freight.name, sellerId: new ObjectId(freight.sellerId), service: freight.service, estimated: freight.estimated }, { $set: { service: data.service, estimated: data.estimated, zipStart: data.zipStart, zipEnd: data.zipEnd }, $push: { values: { $each: data.values } } }, { upsert: true })


      } catch (error) {
        consoleLog.push({ sucesso: false, erro: error, ...freight });
      }
    }
    res.status(200).json(consoleLog);

  } catch (error) {
    res.status(200).json(error)
  }
})


module.exports = app => app.use('/v1/freight', router);



