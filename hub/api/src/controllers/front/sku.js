const express = require('express');
const { getUserByToken } = require('../../../../lib/data/user');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getErrorMessage } = require('./../../../../lib/util/error');
const { uploadFileS3 } = require('../../../../lib/util/storage');
const { getSkuList, filterSkuList, productReport, upsertProducts, uploadCards, uploadErrorList } = require('../../../../lib/data/sku');
const { upsertQueue } = require('../../../../lib/data/queue');
const { getCategoryByTitle } = require('../../../../lib/http/mercadoLivre');


router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let skuList = await getSkuList(db, req.query, user)

    res.status(200).json(skuList);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.get('/productReport', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let ret = await productReport(db, user, req);

    res.status(200).json(ret);
  }
  catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.put('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let retorno = await upsertProducts(db, [req.body], user);
    if (retorno.find(f => f.type == 'error')) throw retorno.filter(f => f.type == 'error').map(m => m.error).join(' | ');

    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.put('/status', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let skuCollection = db.collection('sku')
    let user = await getUserByToken(req.headers, db);

    delete req.body.gridFilter.limit
    delete req.body.gridFilter.offset
    delete req.body.gridFilter.skip
    let prodFilter = await filterSkuList(db, req.body, user)


    let id = Array.isArray(req.body._id) ? req.body._id.map(m => new ObjectId(m)) : [req.body._id]
    let isActive = req.body.isActive


    let filter = req.body.multiple == true ? prodFilter : { _id: { $in: id } }

    let retorno = skuCollection.updateMany(filter, { $set: { isActive } })

    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.post('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    // req.body.sellerId = new ObjectId(req.body.sellerId);

    req.body.isNew = true;
    let retorno = await upsertProducts(db, [req.body], user, true);
    if (retorno.find(f => f.type == 'error')) throw retorno.map(m => m.error).join('\n');

    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.post('/productMany', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let retorno = await upsertQueue(db, 'UPLOAD', 'HUB', user.sellerIds[0], null, null, user.document, { uid: (new Date().getTime() + Math.random(5)) * 10000 }, { content: req.body });
    res.status(200).json(retorno);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.post('/image', async (req, res) => {
  try {
    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);
    let skuCollection = db.collection('sku');
    let images = [];

    req.files.image = req.files.image ? req.files.image : []

    if (Array.isArray(req.files.image))
      images.push(...req.files.image);
    else
      images.push(req.files.image);

    let arrayFinal = [];

    let idx = (await skuCollection.findOne({ sku: req.headers.sku, sellerId: new ObjectId(req.headers.sellerid) })).image;
    idx = Array.isArray(idx) ? idx.length : 0;

    for (let image of images) {
      idx++;
      let retAws = await uploadFileS3(image.data, `${req.headers.sku}-${idx}.${image.name.split('.')[image.name.split('.').length - 1]}`);
      arrayFinal.push(retAws)

    }

    let update = await skuCollection.updateOne({ sku: req.headers.sku, sellerId: new ObjectId(req.headers.sellerid) }, { $push: { image: { $each: arrayFinal } } })

    return res.status(200).json(update)

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.get('/image', async (req, res) => {
  try {
    let db = req.mongoConnection;
    getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku')

    let retorno = await skuCollection.findOne({ _id: new ObjectId(req.headers.skuid) }, { projection: { image: 1 } })

    return res.status(200).json(retorno)

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.put('/imageRemove', async (req, res) => {
  try {
    let db = req.mongoConnection;

    await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku')

    let retorno = await skuCollection.updateOne({ _id: new ObjectId(req.headers.skuid) }, { $pull: { image: req.body.image } })

    res.status(200).json(retorno);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.put('/newSku', async (req, res) => {
  try {
    let db = req.mongoConnection;

    await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku')

    let { id, sku } = req.body

    let find = await skuCollection.findOne({ _id: new ObjectId(id) })

    let findSku = await skuCollection.findOne({ sku: sku })

    if (!findSku) throw 'Código do sku não existe'

    let retorno = await skuCollection.updateOne({ sku: sku }, { $set: { productId: find.sku } })

    // let retorno = await skuCollection.updateOne({ _id: new ObjectId(req.body) }, { $set: { image: req.body.image } })

    res.status(200).json(retorno);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.get('/uploadCards', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await uploadCards(db, user));
  } catch (err) {
    res.status(400).json(err);
  }
})

router.get('/uploadErrorList', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await uploadErrorList(db, user, Number(req.query.offset), Number(req.query.limit)));
  } catch (err) {
    res.status(400).json(err);
  }
})

router.get('/getDefaultData', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await uploadErrorList(db, user, Number(req.query.offset), Number(req.query.limit)));
  } catch (err) {
    res.status(400).json(err);
  }
})
router.get('/categoryByTitle', async (req, res) => {
  try {
    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);

    res.status(200).json(await getCategoryByTitle(await db.collection('config').findOne({}), req.query.title));
  } catch (err) {
    res.status(400).json(err);
  }
})

router.get('/:skuId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let skuCollection = db.collection('sku');

    let {
      skuId
    } = req.params;

    let sku = await skuCollection.findOne({ _id: new ObjectId(skuId) })

    sku.variations = await skuCollection.find({ productId: sku.sku, sellerId: sku.sellerId }).toArray();

    if (sku.variations.length > 0) {
      sku.stock = sku.variations.reduce((n, { stock }) => n + parseInt(stock), 0);
      sku.price = Math.max(...sku.variations.map(m => m.price));
    }

    res.status(200).json(sku);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})



//getCategoryByTitle(config, sku.title)
module.exports = app => app.use('/v1/front/sku', router);
