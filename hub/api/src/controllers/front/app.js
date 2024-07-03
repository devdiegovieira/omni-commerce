const express = require('express');
const { ObjectId } = require('mongodb');

const router = express.Router();

const { getUserByToken } = require('../../../../lib/data/user');
const { getErrorMessage } = require('../../../../lib/util/error');


router.post('/menuxuser/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    await getUserByToken(req.headers, db);

    let { userId, sellerId, appMenu } = req.body;

    let userColl = db.collection('user');
    let user = await userColl.findOne({ _id: new ObjectId(userId) });
    if (!user) throw `User by id '${userId}' not found!`;

    let appMenuXUserColl = db.collection('appMenuXUser');

    await appMenuXUserColl.updateOne(
      { userId: new ObjectId(userId), sellerId: new ObjectId(sellerId) },
      {
        $set: {
          userId: new ObjectId(userId),
          sellerId: new ObjectId(sellerId),
          appMenu
        }
      },
      { upsert: true }
    );

    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});


router.get('/menu', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let userXSellerColl = db.collection('userXSeller');
    let appMenuXUserColl = db.collection('appMenuXUser');
    let appMenuColl = db.collection('appMenu');

    let userAdmin = await userXSellerColl.findOne({ userId: user._id, admin: true });

    let appMenu;
    if (userAdmin) {
      appMenu = await appMenuColl.find({}).sort({ sequence: 1 }).toArray();
    } else {
      let appMenuXUser = await appMenuXUserColl.findOne({ userId: user._id });
      appMenu = await appMenuColl.find({ key: { $in: appMenuXUser ? appMenuXUser.appMenu : [] } }).sort({ sequence: 1 }).toArray();
    }



    let ret =

      user.sellerIds.length > 0 && appMenu.length > 0 ?
        appMenu.filter(f => user.su || (!user.su && !f.su)).map(m => {if (Array.isArray(m.child)) m.child = m.child.filter(f => user.su || (!user.su && !f.su)); return m}) :
        [
          {
            key: "forms",
            name: "Cadastros",
            icon: "grading",
            child: [
              {
                key: "seller",
                name: "Empresas",
                icon: "add_business",
                isChield: true,
                link: "/seller"
              }
            ],
            sequence: 1
          },
          {
            key: "settings",
            name: "Configurações",
            icon: "settings",
            showIcon: true,
            link: "/settings",
          }
        ];

    ret.push({
      key: "logout",
      name: "Sair",
      icon: "logout",
      showIcon: true,
      link: "/logout",
      sequence: 999999
    });





    res.status(200).send(ret);

  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});



module.exports = app => app.use('/v1/front/app', router);
