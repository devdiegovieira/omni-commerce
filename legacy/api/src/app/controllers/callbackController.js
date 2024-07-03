const express = require('express');

const router = express.Router();

router.post('/orderAny/:gumgaToken', async (req, res, next) => {
  try {
    db = req.mongoConnection;
    let orderAny = db.collection('orderAny');

    let gumgaToken = req.params.gumgaToken;
    req.body.gumgaToken = gumgaToken;
    req.body.date = new Date();

    await orderAny.updateOne({'content.id' : req.body.content.id}, {$set: req.body}, {upsert: true});
    
    res.status(200).json();
  } catch (err) {
    let errLog = err.message ? err.message : err;
    JSON.stringify(err)
    
    let apiCallbackError = db.collection('apiCallbackError');
    await apiCallbackError.insertOne(errLog);

    res.status(400).json();
  }
});

module.exports = app => app.use('/callback', router);
