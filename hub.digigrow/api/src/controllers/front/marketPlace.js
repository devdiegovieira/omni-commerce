const express  = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getAndCheckParamsType } = require('./../../../../lib/util/api');
const { getUserByToken } = require('./../../../../lib/data/user');
const { getErrorMessage } = require('../../../../lib/util/error');
const { getAccesToken } = require('../../../../lib/http/mercadoLivre');


router.get('/comments', async (req, res) => {
  try{
    let db = req.mongoConnection; 
    let user = await getUserByToken(req.headers, db);
    let marketPlaceComments = db.collection('autoMessage');

    let filter = {
      marketPlaceId: new ObjectId(req.query.marketPlaceId), 
      platformId: new ObjectId(req.query.platformId)
    }

    filter.sellerId = req.query.sellerId ? new ObjectId(req.query.sellerId) : { $in: [...user.sellerIds ] };

    let commentsList = await marketPlaceComments.find(filter).toArray();
    
    let resultado = commentsList.map(m => {
      let orderStatus;

      switch (m.orderStatus) {
        case 'paid':
          orderStatus = 'Pago';
          break;
        case 'invoiced':
          orderStatus = 'Faturado';
          break;
        case 'cancelled':
          orderStatus = 'Cancelado';
          break;
          case 'shipped':
            orderStatus = 'Finalizado';
          break;
        case 'concluded':
          orderStatus = 'Concluído';
          break; 
        case 'delivered':
          orderStatus = 'Enviado';
          break; 
        default: orderStatus = 'Outro';         
      };
      
      return {
        ...m,
        status: orderStatus       
      }
    });
    
    res.status(200).json(resultado)
  }
  catch(err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.put('/comments/:autoMessageId', async (req, res) => {
  try{
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let autoMessage = db.collection('autoMessage') 

    let { autoMessageId } = req.params

    let data = {}

    let { message, orderStatus, active } = req.body;

    if( message ) data['message'] = message;
    if( orderStatus ) data['orderStatus'] = orderStatus;
    if( active || active == false) data['active'] = active;

    await autoMessage.updateOne(
      { _id: new ObjectId(autoMessageId) },
      { $set: { ...data, updatedAt: new Date(), user: user.document}},
      { upsert: false }
    );
      
    res.status(200).send();

  } catch(err) {
    res.status(err && !err.auth ? 400 : 401).json(err);
  }
});

router.post('/comments', async (req, res) => {
  try{ 
    let db = req.mongoConnection;

    let user = await getUserByToken(req.headers, db);
    let autoMessage = db.collection('autoMessage') 

    let data = {};

    let { marketPlaceId, sellerId, platformId, orderStatus, active, message } = req.body;

    if( marketPlaceId ) data['marketPlaceId'] = new ObjectId(marketPlaceId);
    if( sellerId ) data['sellerId'] = new ObjectId(sellerId);
    if( platformId ) data['platformId'] = new ObjectId(platformId);
    if( orderStatus ) data['orderStatus'] = orderStatus;
    if( message ) data['message'] = message;

    data['active'] = active == true;


    let insertedId = await autoMessage.insertOne({...data, updatedAt: new Date(), user: user.document} );
   
    res.status(200).json(insertedId);
  } catch(err) {
    res.status(err && !err.auth ? 400 : 401).json(getErrorMessage(err));
  }
});

router.delete('/comments/:commentsId', async (req, res) => {
  try {
    if (!req.params.commentsId) throw 'commentsId needed!'


    let _idMessage = req.params.commentsId.split(',').map(m => { return new ObjectId(m)}); 
    
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    
    let autoMessageCol = db.collection('autoMessage');

    await autoMessageCol.deleteMany( 
      {
        _id: {
          $in: _idMessage
        },
        sellerId: {
          $in: user.sellerIds
        }
      }
    );
      
    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let marketPlaceColl = db.collection('marketPlace');

    let marketPlaceList = await marketPlaceColl.find({ sellerId: { $in: user.sellerIds } }).toArray();
    
    let sellerColl = db.collection('seller');
    let sellers = await sellerColl.find({ _id: { $in: marketPlaceList.map(m => { return m.sellerId }) } }).toArray();

    let platformColl = db.collection('platform');
    let platform = await platformColl.find({_id: { $in: marketPlaceList.map(m => {return m.platformId}) } }).toArray();
  
    res.status(200).json(marketPlaceList.map(m => {return{

      platformName:  platform.find(f => f._id.equals(m.platformId)) ? platform.find(f => f._id.equals(m.platformId)).name : '',
      sellerName: sellers.find(f => f._id.equals(m.sellerId)) ? sellers.find(f => f._id.equals(m.sellerId)).name : '',
      ...m,
      
    }}));

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:marketplaceid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let marketplaceColl = db.collection('marketPlace');
    
    let response = await marketplaceColl.findOne({ _id: new ObjectId(req.params.marketplaceid) })
  
    res.status(200).json(response);

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(err);
  }
});

router.put('/:marketplaceid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);  
    
    await getUserByToken(req.headers, db);
    
    let marketPlaceColl = db.collection('marketPlace');
    let { marketplaceid } = req.params;

    let data = {}

    let {
      name,
      platformId,
      freightCallback,
      lastDateGetOrder,
      sellerId,
    } = req.body;

    if( name ) data['name'] = name;
    if( platformId ) data['platformId'] = new ObjectId(platformId);
    if ( platformId == '' ) data['platformId'] = null;
    if( freightCallback) data['freightCallback'] = freightCallback ;
    if( lastDateGetOrder) data['lastDateGetOrder'] = new Date(lastDateGetOrder) ;
    if( sellerId) data['sellerId'] = new ObjectId(sellerId) ;
    if ( sellerId == '' ) data['sellerId'] = null;
 
    
    getAndCheckParamsType(
      data, req.body, 'boolean', 
      [
        'active',
        'getOrder',
        'putOthers',
        'putPrice',
        'putStock',
        'putOrderStatus',
        'getShippLabel'
      ]
    );


    await marketPlaceColl.updateOne(
      { _id: new ObjectId(marketplaceid) },
      { $set: { ...data,updatedAt: new Date(), updatedUser: user.document}},
      { upsert:true });
      
    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(err);
  }
});

router.post('/:marketplaceid', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);  

    let data = {}

    let {
      name,
      sellerMeli,
      tgMeli,
      platformId,
      freightCallback,
      lastDateGetOrder,
      sellerId,
    } = req.body;
    
    let auth = {
      tg: tgMeli,
      sellerId: Number(sellerMeli)
    }
   
    if ( name ) data['name'] = name;
    if ( platformId ) data['platformId'] = new ObjectId(platformId);
    if ( sellerId) data['sellerId'] = new ObjectId(sellerId) ;
    if ( platformId == '' ) data['platformId'] = null;
    if ( freightCallback) data['freightCallback'] = freightCallback ;
    if ( lastDateGetOrder) data['lastDateGetOrder'] = new Date(lastDateGetOrder) ;
    if ( sellerId == '' ) data['sellerId'] = null;
    if ( auth.tg && auth.sellerId ) data['auth'] = auth;
    
    getAndCheckParamsType(
      data, req.body, 'boolean', 
      [
        'active',
        'getOrder',
        'putOthers',
        'putPrice',
        'putStock',
        'putOrderStatus',
        'getShippLabel'
      ]
    );

    let marketplaceColl = db.collection('marketPlace');
    let { insertedId } = await marketplaceColl.insertOne(data);

    let marketPlace = await marketplaceColl.findOne({_id: insertedId});
    await getAccesToken(db, marketPlace, true)



    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(err);
  }
});

router.delete('/:marketplaceid', async (req, res) => {
  try {
    if (!req.params.marketplaceid) throw 'marketplaceid needed!' 
    let marketplaceid = new ObjectId(req.params.marketplaceid);
    
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);

    let marketplaceidColl = db.collection('marketPlace');
    await marketplaceidColl.deleteOne({_id: marketplaceid});
      
    res.status(200).send();
  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/list/oficial', async (req, res) => {

  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let marketPlaceColl = db.collection('marketPlace');

    let marketPlaceList = await marketPlaceColl.find({ sellerId: null}).toArray();
    
    let sellerColl = db.collection('seller');
    let sellers = await sellerColl.find({ _id: { $in: marketPlaceList.map(m => { return m.sellerId }) } }).toArray();

    let platformColl = db.collection('platform');
    let platform = await platformColl.find({_id: { $in: marketPlaceList.map(m => {return m.platformId}) } }).toArray();
  
    res.status(200).json(marketPlaceList.map(m => {return{

      platformName:  platform.find(f => f._id.equals(m.platformId)) ? platform.find(f => f._id.equals(m.platformId)).name : '',
      sellerName: sellers.find(f => f._id.equals(m.sellerId)) ? sellers.find(f => f._id.equals(m.sellerId)).name : '',
      ...m,
      
    }}));

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

router.get('/:markePlaceId/pricerules', async (req, res) => {
  try {
    let db = req.mongoConnection;
    let user = await getUserByToken(req.headers, db);
    let pricePlaceColl = db. collection('priceRule');
    let priceRule = await pricePlaceColl.find({sellerId: { $in: user.sellerIds }, marketPlaceId: new ObjectId(req.params.markePlaceId) }).toArray();
  
    let resultado = priceRule.map(m => {
      let calc = m.calc;
      delete m.calc;

      return {
        ...m,
        value: calc ? calc.value : 0,
        operation: calc ? calc.operation : '+',
      }
    });

  
    res.status(200).json(resultado);

  } catch (err) {
    res.status(err && !err.auth  ? 400 : 401).json(getErrorMessage(err));
  }
});

module.exports = app => app.use('/v1/front/marketplace', router);



