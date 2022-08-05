const express = require('express');
const { ObjectId } = require('mongodb');
const { syncPublishies, getPublishList, getPublish, upsertPublish, dropCampaing, sendPublish, skuToPublish, getPublishReport, postPublishCompatibilities } = require('../../../../lib/data/publish');
const { getUserByToken, checkSellerByUserToken } = require('../../../../lib/data/user');
const _ = require('lodash');
const { getErrorMessage } = require('./../../../../lib/util/error');
const axios = require('axios');
const sku = require('./sku');
const { uploadFile, uploadFileS3 } = require('../../../../lib/util/storage');

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await getPublishList(db, user, req.query));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/publishlist', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let skuXPublishColl = db.collection('skuXPublish');

    let { sku } = req.query

    let list = await skuXPublishColl.find({ sku }).toArray();

    let filteredList = list.map(m => m.publishId)
    res.status(200).json(filteredList);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/sync', async (req, res) => {
  try {
    db = req.mongoConnection;

    let bySeller = _.groupBy(req.body, 'sellerId');

    let user = await getUserByToken(req.headers, db, false);
    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishiIds`;

    let configColl = db.collection('config');
    let config = await configColl.findOne({});

    for (let seller in bySeller) {
      let arrayPublish = bySeller[seller].map(m => m.publishId);

      await syncPublishies(
        db,
        config,
        null,
        new ObjectId(seller),
        arrayPublish,
        false,
        user.sellerIds
      );
    }

    res.status(200).send();

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/', async (req, res) => {
  try {
    db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db, false);
    let configColl = db.collection('config');
    let config = await configColl.findOne({});

    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishIds`;

    res.status(200).json(await upsertPublish(db, config, req.body, user.sellerIds, true));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/removed', async (req, res) => {
  try {
    db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db, true);

    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishiIds`

    let publishColl = db.collection('publish');
    let skuXPublishColl = db.collection('skuXPublish');
    let publish = await req.body.map(m => { return m.publishId });

    await skuXPublishColl.deleteMany({
      publishId: {
        $in: publish
      },
      sellerId: {
        $in: user.sellerIds
      }
    });

    await publishColl.updateMany(
      {
        publishId: {
          $in: publish
        },
        sellerId: {
          $in: user.sellerIds
        }
      },
      {
        $set: {
          status: 'unlinked'
        }
      }
    );

    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/dimension', async (req, res) => {
  try {
    db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db, false);
    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishiIds`

    let data = req.body;

    let configColl = db.collection('config');
    let config = await configColl.findOne({});
    let marketPlaceColl = db.collection('marketPlace');

    let marketPlaces = await marketPlaceColl.find({ _id: { $in: orderList.map(m => { return m.marketPlaceId }) } }).toArray();

    for (let publishies of req.body) {

      let { publishId, marketplaceId } = publishies;

      let marketPlace = marketPlaces.find(f => f._id.equals(new ObjectId(marketplaceId)));

      await putItemById(db, config, marketPlace, publishId, data.map(...m => { return { shipping: { dimensions: m.dimension, mode: m.mode, freeShipping: m.freeShipping } } }));

    }
    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/image', async (req, res) => {
  try {
    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);
    let publishCollection = db.collection('publish');
    let skuXPublishCollection = db.collection('skuXPublish');
    let images = [];

    req.files.image = req.files.image ? req.files.image : []

    if (Array.isArray(req.files.image))
      images.push(...req.files.image);
    else
      images.push(req.files.image);

    let arrayFinal = [];

    let idx;

    if (req.headers.sku) {
      idx = (await skuXPublishCollection.findOne({ sku: req.headers.sku, publishId: req.headers.publish })).images;
    } else {
      idx = (await publishCollection.findOne({ publisId: req.headers.publishid })).images
    }

    if (Array.isArray(idx)) idx = idx.length;

    for (let image of images) {
      idx++;

      let fileName =
        req.headers.sku ?
          `${req.headers.publishid}_${req.headers.sku}_${idx}_${new Date()}` :
          `${req.headers.publishid}_${idx}-${new Date()}`;

      let path = await uploadFileS3(image.data, fileName)

      arrayFinal.push(path)

    }

    if (!req.headers.sku) {
      await publishCollection.updateOne({ sku: req.headers.sku }, { $push: { images: { $each: arrayFinal } } })
    }
    else {
      await skuXPublishCollection.updateOne({ sku: req.headers.sku, publishId: req.headers.publish }, { $push: { images: { $each: arrayFinal } } })
    }

    return res.status(200).json()

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.post('/sendPublish', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let body = req.body;
    let user = await getUserByToken(req.headers, db);

    let sendReturn = await sendPublish(db, user, body);

    if (sendReturn.find(f => f.type == 'error'))
      throw sendReturn.map(m => m.error).join(', ');

    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/skutopublish', async (req, res) => {
  try {

    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await skuToPublish(db, req.body, user));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/report', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let filePath = await getPublishReport(db, user, req.query);

    res.status(200).json(filePath);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:publishId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await getPublish(db, user, req.params));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/:publishId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).json(await upsertPublish(db, req.body, user, req.params.publishId));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/campaing/:publishId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    res.status(200).json(await dropCampaing(req.body, user, db));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/delSku/:publishId', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let skuXPublishColl = db.collection('skuXPublish');

    let { publishId, skuToDelete } = req.body

    let lombriga = await skuXPublishColl.count({ sellerId: { $in: user.sellerIds }, publishId })

    if ((lombriga-1) < 1) throw 'O anúncio deve ter ao menos uma variação'

    await skuXPublishColl.deleteOne({
      publishId,
      sku: skuToDelete
    });

    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

}
);

router.delete('/delImage/:sku', async (req, res) => {
  try {
    let { publishId, images } = req.body;
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let skuXPublishColl = await db.collection('skuXPublish');
    let skuXPublishies = await skuXPublishColl.find({ publishId: publishId }, { projection: { images: 1 } }).toArray();

    let ret = [];

    skuXPublishies.map(m => m.images.map(mm => {
      if (!mm == images) {

        ret.push(mm)
      }
    }
    )
    )

    res.status(200).json(ret);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

}
);

router.get('/list/:listPublish', async (req, res) => {
  let db = req.mongoConnection;
  let skuXPublishColl = db.collection('skuXPublish');

  res.json(await skuXPublishColl.find({ sku: req.params.listPublish }).toArray())
});

router.put('/status/:status', async (req, res) => {
  try {
    db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    if (!Array.isArray(req.body)) throw `Body isn't valid array of publishiIds`
    let { status } = req.params;

    let data = {};
    if (status == 'paused') data['status'] = status;
    if (status == 'active') data['status'] = status;
    if (status == 'unlinked') data['status'] = status;

    if (data.status == 'unlinked') {

      let publishColl = db.collection('publish');
      let skuXPublishColl = db.collection('skuXPublish');
      let publish = await req.body.map(m => { return m.publishId });

      await skuXPublishColl.deleteMany({
        publishId: {
          $in: publish
        },
        sellerId: {
          $in: user.sellerIds
        }
      });

      await publishColl.updateMany(
        {
          publishId: {
            $in: publish
          },
          sellerId: {
            $in: user.sellerIds
          }
        },
        {
          $set: {
            status: 'unlinked'
          }
        }
      );
    }
    else {
      let configColl = db.collection('config');
      let config = await configColl.findOne({});
      let marketplaceColl = db.collection('marketPlace');
      let publishColl = db.collection('publish');

      let pubs = await publishColl.find({
        publishId: {
          $in: req.body.map(m => {
            return m.publishId
          })
        }
      }).toArray();

      let marketplaces = await marketplaceColl.find({
        _id: {
          $in: req.body.map(m => {
            return new ObjectId(m.marketPlaceId)
          })
        }
      }).toArray();

      for (let publishies of req.body) {

        let arrayPublish = [];
        arrayPublish.push(publishies.publishId)

        let { marketPlaceId, publishId } = publishies;

        let marketPlace = marketplaces.find(f => f._id.equals(new ObjectId(marketPlaceId)));
        let publish = pubs.find(f => f.publishId == publishId)

        if (publish) {
          checkSellerByUserToken(user, publish.sellerId);

          await putItemById(db, config, marketPlace, publishId, data);
        }

        await syncPublishies(
          db,
          config,
          null,
          new ObjectId(publish.sellerId),
          arrayPublish,
          true,
          user.sellerIds
        );

      }

    }

    res.status(200).json();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.post('/compatibilities', async (req, res) => {
  try {
    db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    res.status(200).send((await postPublishCompatibilities(db, user, [req.body]))[0]);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

module.exports = app => app.use('/v1/front/publish', router);
