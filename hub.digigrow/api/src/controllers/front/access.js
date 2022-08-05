const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

const { getUserByToken } = require('./../../../../lib/data/user');
const { getErrorMessage } = require('./../../../../lib/util/error');

router.put('/admin', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let userIt = await getUserByToken(req.headers, db, true, true);

    let userXSellerCol = db.collection('userXSeller');
    let { admin, sellerid } = req.headers;

    if (!Array.isArray(req.body)) throw 'O corpo da requisição não é um array de sku válido';



    for (let user of req.body) {

      if (userIt._id.equals(new ObjectId(user))) throw 'Usuário não pode alterar próprio status '


      await userXSellerCol.updateOne(
        {
          sellerId: new ObjectId(sellerid), userId: new ObjectId(user)
        },
        {
          $set: {
            admin: admin == "true"
          }
        }
      );
    }


    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/menulist', async (req, res) => {
  try {
    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);
    let menuBody = req.body;

    let appMenuXUserColl = db.collection('appMenuXUser');

    for (let user of req.headers.userids.split(',')) {
      await appMenuXUserColl.updateOne(
        {
          userId: new ObjectId(user)
        },
        {
          $set: {
            userId: new ObjectId(user),
            appMenu: menuBody
          }
        },
        {
          upsert: true
        }
      );
    }

    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

router.get('/listmenuuser', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let appMenuXUserColl = db.collection('appMenuXUser');
    let appMenuXUser = await appMenuXUserColl.findOne({ userId: { $in: req.headers.userids.split(',').map(m => new ObjectId(m)) } });

    let appMenuColl = db.collection('appMenu');
    let appMenu = await appMenuColl.find({}).toArray();


    let keyUser = appMenuXUser.appMenu.map(m => {
      return {
        key: m,
        name: appMenu.find(f => f.key == m).name
      }
    });

    res.status(200).send(keyUser);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

})

router.get('/listmenu', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let appMenuColl = db.collection('appMenu');
    let appMenu = await appMenuColl.find({}).toArray();

    res.status(200).send(appMenu.map(m => {
      return {
        key: m.key,
        name: m.name
      }
    }));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }

})

module.exports = app => app.use('/v1/front/access', router);