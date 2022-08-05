const express = require('express');
const { ObjectId } = require('mongodb');
const { getUserByToken, checkSellerByUserToken } = require('./../../../../lib/data/user');
const { getErrorMessage } = require('./../../../../lib/util/error');
const { toFixed } = require('../../../../lib/util/javaScript');
const { salesSlip } = require('./../../../../lib/data/salesSlip')

const router = express.Router();

router.get('/dailyOrders', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let orderColl = db.collection('order');
    let { startDate, endDate, sellerId } = req.query;
    let filter = {};

    let dtStart = new Date(startDate);
    let dtEnd = new Date(endDate);

    if (!startDate || !endDate) throw 'startDate and endDate needed!';

    filter['dateClosed'] = {
      $gte: dtStart,
      $lte: dtEnd
    };

    if (sellerId) {
      checkSellerByUserToken(user, new ObjectId(sellerId));
      filter['sellerId'] = filter.push(new ObjectId(sellerId));
    } else {
      filter['sellerId'] = { $in: user.sellerIds };
    }

    let order = await orderColl.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: {
            year: {
              $year: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
            month: {
              $month: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
            day: {
              $dayOfMonth: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
          },
          quantityOrders: {
            $sum: 1
          },
          dailySale: {
            $sum: "$gross"
          }
        }
      }
    ]).toArray();

    dtStart.setMonth(dtStart.getMonth() - 1);

    dtEnd.setMonth(dtEnd.getMonth() - 1);
    lastDay = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), 0);
    dtEnd.setDate(lastDay.getDate());
    dtEnd.setMonth(lastDay.getMonth());

    filter['dateClosed'] = {
      $gte: dtStart,
      $lte: dtEnd
    };

    let orderLast = await orderColl.aggregate([
      {
        $match: filter
      },
      {
        $group: {
          _id: {
            year: {
              $year: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
            month: {
              $month: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
            day: {
              $dayOfMonth: {
                "date": "$dateClosed",
                "timezone": "America/Sao_Paulo"
              }
            },
          },
          quantityOrders: {
            $sum: 1
          },
          dailySale: {
            $sum: "$gross"
          }
        }
      }
    ]).toArray();

    let ret = [];

    for (let index = 1; index <= 31; index++) {
      let selOrder = order.find(f => f._id.day == index);
      let selOrderLast = orderLast.find(f => f._id.day == index);

      ret.push({
        day: index,
        qtyLast: selOrderLast ? selOrderLast.quantityOrders : 0,
        moneyLast: selOrderLast ? selOrderLast.dailySale : 0,
        qty: selOrder ? selOrder.quantityOrders : 0,
        money: selOrder ? selOrder.dailySale : 0
      })
    }

    ret.map((m, i, arr) => {
      if (arr[i - 1]) {
        m.money = toFixed(m.money + arr[i - 1].money, 2);
        m.moneyLast = toFixed(m.moneyLast + arr[i - 1].moneyLast, 2);

        m.qty = m.qty + arr[i - 1].qty;
        m.qtyLast = m.qtyLast + arr[i - 1].qtyLast;
      }

    })


    res.status(200).json(ret);
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/sellerOrders', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let orderColl = db.collection('order');
    let sellerColl = db.collection('seller');
    let sellers = await sellerColl.find().toArray();
    let { startDate, endDate, sellerId } = req.query;

    let filter = [];

    if (sellerId) {
      checkSellerByUserToken(user, new ObjectId(sellerId));
      filter['sellerId'] = filter.push(new ObjectId(sellerId));
    } else {
      filter['user.sellerIds'] = filter = user.sellerIds;
    };
    let order = await orderColl.aggregate([
      {
        $match: {
          dateClosed: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          sellerId: { $in: filter }
        }
      },
      {
        $group: {
          _id: {
            sellerId: "$sellerId",
          },
          quantityOrders: {
            $sum: 1
          },
          dailySale: {
            $sum: "$gross"
          }
        }
      }
    ]).toArray();

    let ret = await order.map(m => {
      return {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        sellerId: ObjectId(m._id.sellerId),
        qty: m.quantityOrders,
        grossTotal: toFixed(m.dailySale, 2)
      }
    });

    res.status(200).json(
      ret.map(m => {
        let seller = sellers.find(f => f._id.equals(m.sellerId));

        return {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          sellerId: seller ? seller.code : '',
          sellerPic: seller ? seller.picture : '',
          qty: m.qty,
          grossTotal: toFixed(m.grossTotal, 2)
        }
      }).sort(function (x, y) {
        if (x.qty < y.qty) { return 1; }
        if (x.qty > y.qty) { return -1; }
        return 0;
      })
    );
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/invento/salesslip/:orderid', async (req, res) => {
  try {
    res.status(200).json(await salesSlip(req));
  } catch (err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
})

module.exports = app => app.use('/v1/front/dashboard', router);
