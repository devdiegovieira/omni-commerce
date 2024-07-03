const {
  upsertQueue,
  lockAndGetQueue,
  deleteQueue,
  upsertQueueError,
  deleteQueueError,
  upsertQueueSuccess
} = require('./../../lib/data/queue');

const {
  getPriceWithRule,
  updateSkuStock
} = require('./../../lib/data/sku');


const {
  upsertSkuCollections
} = require('./../../lib/data/publish')

let {
  getOrders,
  getOrderById,
  getShippingById,
  getBillingInfoById,
  getShippingItemsById,
  putItemById,
  getItemById,
  getMeliSaleMessage,
  getPaymentMp,
  getMeliQuestionMessage,
  getMeliUserId,
  splitShipment
} = require('./../../lib/http/mercadoLivre');

const { meliOrderToOrder, getInvoicedMeliFulfillment } = require('./../../lib/data/order');
const { syncPublishies } = require('../../lib/data/publish');
const { sleep } = require('../../lib/util/javaScript');
const { getErrorMessage } = require('../../lib/util/error');
const { putMoneyOrderMoviment, putMoneyOrderStatus } = require('../../lib/data/orderMoney');

const executeMeli = async (service, db, config) => {
  switch (service.name) {
    case "getOrderMeli":
      await getOrderMeli(db, config, service);
      break;
    case "processOrderMeli":
      await processOrderMeli(db, config, service);
      break;
    case "putSkuMeli":
      await putSkuMeli(db, config, service);
      break;
    case "syncAllPublishies":
      await syncAllPublishies(db, config, service);
      break;
    case "getMessagesMeli":
      await getMessagesMeli(db, config, service);
      break;
    case "getPaymentStatus":
      await getPaymentStatus(db, config, service);
      break;
    case "getQuestionsMeli":
      await getQuestionsMeli(db, config, service);
      break;
    case "getShippingMeli":
      await getShippingMeli(db, config, service);
      break;

  }
}

const getOrderMeli = async (db, config, service) => {
  let marketPlaceCollection = db.collection('marketPlace');
  let marketPlaces = await marketPlaceCollection.find({ platformId: service.platformId }).toArray();

  for (let marketPlace of marketPlaces) {
    try {
      let startDate = marketPlace.lastDateGetOrder ? marketPlace.lastDateGetOrder : new Date();
      let endDate = new Date();

      let params = {
        'seller': marketPlace.auth.sellerId,
        'order.date_last_updated.from': startDate.toISOString(),
        'order.date_last_updated.to': endDate.toISOString(),
        'order.status': 'paid,cancelled',
        'sort': 'date_desc',
        'access_token': marketPlace.auth.accessToken
      };

      let ordersMeli = await getOrders(db, config, params);

      for (let orderMeli of ordersMeli) {
        try {
          await upsertQueue(
            db, 'ORDER', 'MKP', marketPlace.sellerId,
            marketPlace.platformId, marketPlace._id, service.name,
            { 'content.externalId': orderMeli.id },
            { 'content.externalId': orderMeli.id, 'content.status': orderMeli.status }
          );

        } catch (error) {
          await upsertQueueError(
            db, 'ORDER', 'MKP', marketPlace.sellerId,
            marketPlace.platformId, marketPlace._id, service.name, error,
            { 'content.externalId': orderMeli.id },
            { content: { externalId: orderMeli.id, ...orderMeli } }
          );
        }
      }

      await marketPlaceCollection.updateOne({ '_id': marketPlace._id }, { $set: { 'lastDateGetOrder': endDate } });

    } catch (error) {
      await upsertQueueError(
        db, 'ORDER', 'MKP', marketPlace.sellerId, marketPlace.platformId,
        marketPlace._id, service.name, error);
    }
  }

}

const getShippingMeli = async (db, config, service) => {
  try {

    let queues = await lockAndGetQueue(db, config, 'SHIPPING', 'MKP', service.platformId, service.queueLimit);
    let orderColl = db.collection('order');
    for (let queue of queues) {
      let marketPlaceColl = db.collection('marketPlace');
      let marketPlaces = await marketPlaceColl.find({ platformId: service.platformId }).toArray();
      let marketPlace = marketPlaces.find(f => f._id.equals(queue.marketPlaceId));



      let shippingId = queue.content.shippingId

      let order = await orderColl.findOne({ 'shipping.shippingId': shippingId })
      let status = await getShippingById(db, config, marketPlace, Math.trunc(shippingId));

      if (order && order.status != status.status) {

        if (status.status != 'ready_to_ship') {
          await orderColl.updateOne({ _id: order._id }, { $set: { status: status.status } })
          await deleteQueue(db, queue);
          await deleteQueueError(db, { 'content.queue.content': queue.content });

        }
      }

    }

  } catch (error) {
    //muita atenção ao mexer neste CATCH qualquer erro que estourar aqui dentro para de processar o resto da fila
    console.log(error);
    await upsertQueueError(
      db, 'SHIPPING', 'MKP', queue.sellerId ? queue.sellerId : undefined, marketPlace ? marketPlace.platformId : undefined, marketPlace ? marketPlace._id : undefined, service.name,
      error, { 'content': queue.content }, { content: queue.content }
    )
    if (error.response && error.response.data && error.response.data.error == 'order_not_found') {
      await deleteQueue(db, queue);
      await deleteQueueError(db, { 'content.queue.content': queue.content });
    }
  }
}

const processOrderMeli = async (db, config, service) => {
  let orderColl = db.collection('order');
  let marketPlaceColl = db.collection('marketPlace');
  let publishColl = db.collection('publish');

  try {
    let marketPlaces = await marketPlaceColl.find({ platformId: service.platformId }).toArray();
    // get avaible queue
    let queues = await lockAndGetQueue(db, config, 'ORDER', 'MKP', service.platformId, service.queueLimit);

    let marketPlace;

    for (let queue of queues) {
      let orderHub;
      try {
        marketPlace = marketPlaces.find(f => f._id.equals(queue.marketPlaceId));
        if (!marketPlace) throw `Queue marketPlaceId not found.`;

        // get order detail
        let orderMeli =
          await getOrderById(db, config, marketPlace, Math.trunc(queue.content.externalId));


        if (orderMeli.pack_id)
          orderHub = await orderColl.findOne({ 'packId': orderMeli.pack_id });
        else
          orderHub = await orderColl.findOne({ 'externalId': orderMeli.id });

        // new order
        if (!orderHub) {
          orderMeli.billingInfo =
            (await getBillingInfoById(db, config, marketPlace, Math.trunc(queue.content.externalId))).billing_info;

          if (orderMeli.shipping && orderMeli.shipping.id)
            orderMeli.shippingInfo =
              await getShippingById(db, config, marketPlace, Math.trunc(orderMeli.shipping.id));

          let externalsByPath = []

          if (orderMeli.shipping && orderMeli.shipping.id && orderMeli.pack_id) {
            let itemsPack =
              await getShippingItemsById(db, config, marketPlace, Math.trunc(orderMeli.shipping.id));

            for (let item of itemsPack) {
              externalsByPath.push({ publishId: item.item_id, id: item.order_id, quantity: item.quantity });

              if (item.order_id != orderMeli.id) {
                let orderPackMeli =
                  await getOrderById(db, config, marketPlace, Math.trunc(item.order_id));

                orderMeli.order_items.push(...orderPackMeli.order_items);
                orderMeli.payments.push(...orderPackMeli.payments)
              }
            }
          }

          let publishies =
            await publishColl.find({
              publishId: { $in: orderMeli.order_items.map(m => { return m.item.id }) }
            }).toArray();


          let distictSellers = [...new Set(publishies.map(m => JSON.stringify(m.sellerId)))];
          if (publishies && publishies.length > 1 && distictSellers.length > 1) {
            let split = distictSellers.map(m => {
              return {
                orders: externalsByPath.filter(f =>
                  publishies.find(ff =>
                    ff.publishId == f.publishId && JSON.stringify(ff.sellerId) == m)
                ).map(mm => {
                  delete mm.publishId;
                  return mm;
                })
              }
            })

            await splitShipment(db, config, marketPlace, orderMeli.shipping.id, split);
          }
          else {

            if (publishies && publishies.length) {
              let sellerId = publishies[0].sellerId;

              // Save order on hub
              let digiOrder = await meliOrderToOrder(orderMeli, queue, sellerId, service.platformId, db);

              let invoice = await getInvoicedMeliFulfillment(db, digiOrder, config);

              if (invoice) digiOrder['invoice'] = invoice;

              orderMeli._id = (await orderColl.insertOne(digiOrder)).insertedId;
              orderHub = await orderColl.findOne({ _id: orderMeli._id });

              await putMoneyOrderMoviment(db, digiOrder, 'PROCESSORDER');

              let seller = await db.collection('seller').findOne({ _id: orderHub.sellerId });

              if (seller && seller.syncStock) {

                for (let skuOrder of orderHub.items) {
                  await updateSkuStock(db, 'PROCESSORDER', skuOrder.sku, orderHub.sellerId, -skuOrder.amount);
                }
              }

              await upsertQueue(
                db, 'ORDER', 'API', sellerId, marketPlace.platformId, marketPlace._id, service.name,
                { 'content.orderId': orderMeli._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id },
                { 'content.orderId': orderMeli._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id, 'content.status': orderMeli.status }
              );

              // if (orderMeli.status == 'paid' && (!orderMeli.tags || orderMeli.tags.find(f => f == 'not_delivered'))) {
              //   await sendAutomaticMessage(db, config, marketPlace, orderHub, 'paid');
              // }
            }
            else {
              if (orderMeli.status == 'paid' && (!orderMeli.tags || orderMeli.tags.find(f => f == 'not_delivered')))
                throw `Publishi(es) not found ${orderMeli.order_items.map(m => { return m.item.id }).join(', ')}`;
            }

          }

        }
        else {
          // update order status (paid to cancel)
          if (orderMeli.status != orderHub.status && orderMeli.status == 'cancelled') {
            let orderSet = {
              status: orderMeli.status,
              updatedAt: new Date()
            }

            if (orderMeli.tags.find(f => f == 'not_delivered')) {
              orderSet['shipping.status'] = 'not_delivered';
            }

            if (orderMeli.tags.find(f => f == 'delivered')) {
              orderSet['shipping.status'] = 'delivered';
            }

            await orderColl.updateOne({ '_id': orderHub._id }, { $set: orderSet });

            let seller = await db.collection('seller').findOne({ _id: orderHub.sellerId });

            await putMoneyOrderMoviment(db, orderHub, 'PROCESSORDER', true);

            if (seller && seller.syncStock) {
              for (let skuOrder of orderHub.items) {
                await updateSkuStock(db, 'PROCESSORDER', skuOrder.sku, orderHub.sellerId, skuOrder.amount);
              }
            }

            await upsertQueue(
              db, 'ORDER', 'API', orderHub.sellerId, marketPlace.platformId, marketPlace._id, service.name,
              { 'content.orderId': orderHub._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id },
              { 'content.orderId': orderHub._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id, 'content.status': orderMeli.status, }
            );
          }

          //finalização de pedido ME2
          if (
            orderMeli.status == orderHub.status &&
            orderMeli.tags &&
            orderMeli.tags.length &&
            orderMeli.tags.find(f => f == 'delivered' || f == 'tagEnviado')
          ) {
            await orderColl.updateOne({ '_id': orderHub._id }, { $set: { status: 'shipped', updatedAt: new Date() } })

            await upsertQueue(
              db, 'ORDER', 'API', orderHub.sellerId, marketPlace.platformId, marketPlace._id, service.name,
              { 'content.orderId': orderHub._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id },
              { 'content.orderId': orderHub._id, 'content.externalId': orderMeli.pack_id ? orderMeli.pack_id : orderMeli.id, 'content.status': 'shipped' }
            );
          }
        }
        //delete queue

        await deleteQueue(db, queue);
        await deleteQueueError(db, { 'content.queue.content.externalId': queue.content.externalId });
      } catch (error) {
        //muita atenção ao mexer neste CATCH qualquer erro que estourar aqui dentro para de processar o resto da fila

        await upsertQueueError(
          db, 'ORDER', 'MKP', queue.sellerId, marketPlace ? marketPlace.platformId : undefined, marketPlace ? marketPlace._id : undefined, service.name,
          error, { 'content.externalId': queue.content.externalId }, { content: queue.content }
        )
        if (error.response && error.response.data && error.response.data.error == 'order_not_found') {
          await deleteQueue(db, queue);
          await deleteQueueError(db, { 'content.queue.content.externalId': queue.content.externalId });
        }
      }
    }
  } catch (error) {
    await upsertQueueError(db, 'ORDER', 'MKP', null, null, null, service.name, error);
  }
}

const putSkuMeli = async (db, config, service) => {
  let marketPlaceCollection = db.collection('marketPlace');
  let publishCollection = db.collection('publish');
  let skuXPublishColl = db.collection('skuXPublish');
  let queueColl = db.collection('queue');

  try {

    let sellers = await queueColl.distinct('sellerId', { type: 'MKP', operation: 'SKU' });

    for (let seller of sellers) {

      let queues = await lockAndGetQueue(db, config, 'SKU', 'MKP', service.platformId, service.queueLimit, seller);
      // if (!queues.length) return;

      let skuXPublishies =
        await skuXPublishColl.find({
          platformId: service.platformId,
          sku: { $in: queues.map(m => { return m.content.sku }) }
        }).toArray();

      let publishies =
        await publishCollection.find({
          platformId: service.platformId,
          publishId: { $in: skuXPublishies.map(m => { return m.publishId }) }
        }).toArray();

      let marketPlaces =
        await marketPlaceCollection.find({
          platformId: service.platformId,
          _id: { $in: skuXPublishies.map(m => { return m.marketPlaceId }) }
        }).toArray();

      for (let queue of queues) {
        let skuXPublishiesFiltered = skuXPublishies.filter(f => f.sku == queue.content.sku);
        let queueErrors = [];
        let queueSuccess = [];
        let publish = {};
        let marketPlace = {};

        for (let skuXPublish of skuXPublishiesFiltered) {
          let skuMeli = {};
          let publishMeli;
          try {
            publish = publishies.find(f => f.publishId == skuXPublish.publishId);

            if (!publish) {
              await syncPublishies(db, config, null, skuXPublish.sellerId, [skuXPublish.publishId])
              publish = await publishCollection.findOne({ publishId: skuXPublish.publishId });
            }

            marketPlace = marketPlaces.find(f => f._id.equals(publish.marketPlaceId));
            if (!marketPlace) throw `marketPlaceId by Id ${publish.marketPlaceId} not found.`;

            if (marketPlace.putOthers || marketPlace.putPrice || marketPlace.putStock) {
              await sleep(100);
              publishMeli = (await getItemById(db, config, marketPlace, [publish.publishId]))[0];

              if (publishMeli.shipping ? publishMeli.shipping.logistic_type : false &&

                publishMeli.status != 'under_review' &&
                publishMeli.status != 'closed' &&
                // (publishMeli.status != 'paused' || (publishMeli.status == 'paused' && publishMeli.sub_status == 'out_of_stock') ) &&
                publishMeli.shipping.logistic_type != 'fulfillment') {
                let stock =
                  queue.content.stock >= 0 ?
                    queue.content.stock > 1000 ? 1000 : queue.content.stock :
                    null;

                if (publishMeli.variations && publishMeli.variations.length) {
                  skuMeli.variations = [];

                  for (let variation of publishMeli.variations) {
                    let skuVar =
                      variation.attributes.find(f => f.id == 'SELLER_SKU') ?
                        variation.attributes.find(f => f.id == 'SELLER_SKU').value_name :
                        variation.seller_custom_field ? variation.seller_custom_field :
                          skuXPublishiesFiltered.find(f => f.variationId == variation.id) ?
                            skuXPublishiesFiltered.find(f => f.variationId == variation.id).sku :
                            undefined;

                    // if (!skuVar) {
                    // await upsertSkuCollections(
                    //   db, 
                    //   marketPlace, 
                    //   skuXPublish.sellerId, 
                    //   publish.publishId, 
                    //   publishMeli.seller_id, 
                    //   variation
                    // );

                    // throw `Publish Variation ${variation.id} don't have SELLER_SKU or SELLER_CUSTOM_FIELD`;
                    // }
                    // if (!)

                    let varRet = { id: variation.id };

                    // price variation
                    if (marketPlace.putPrice && queue.content.price) {
                      varRet.price = await getPriceWithRule(
                        db, marketPlace, skuXPublish.sellerId, queue.content.price, publish
                      );
                    }

                    // stock variation
                    if (marketPlace.putStock && stock != null && stock >= 0) {
                      varRet.available_quantity =
                        queue.content.sku != skuVar ?
                          variation.available_quantity : stock;
                    }

                    skuMeli.variations.push(varRet);
                  }
                }
                else {
                  // price single
                  if (marketPlace.putPrice && queue.content.price)
                    skuMeli.price = await getPriceWithRule(
                      db, marketPlace, skuXPublish.sellerId, queue.content.price, publish
                    );

                  // stock single
                  if (marketPlace.putStock && stock != null && stock >= 0)
                    skuMeli.available_quantity = stock;
                }

                // REATIVA QUANDO INATIVOU ANÚNCIO QUE NÃO PERMITE SALDO 0
                if (
                  publishMeli.status == 'paused' &&
                  publish.status == 'active' &&
                  (skuMeli.available_quantity || (skuMeli.variations && skuMeli.variations.find(f => f.available_quantity)))
                ) {
                  skuMeli.status = 'active';
                }

                await sleep(100);
                // put sku on Meli
                let ret = await putItemById(db, config, marketPlace, publish.publishId, skuMeli);
                queueSuccess.push({ publishId: skuXPublish.publishId, marketPlaceId: marketPlace._id, reqMeli: skuMeli, ret });

              }
            }
          }
          catch (error) {
            if (
              error.response &&
              error.response.data.cause &&
              error.response.data.cause.length
            ) {
              if (error.response.data.cause[0].cause_id == 288) {
                delete skuMeli.available_quantity;
                delete skuMeli.variations;

                skuMeli.status = 'paused';

                try {
                  let retMeli = await putItemById(db, config, marketPlace, publish.publishId, skuMeli);
                  queueSuccess.push({ publishId: skuXPublish.publishId, marketPlaceId: marketPlace._id, reqMeli: skuMeli, retMeli });
                } catch (error) {
                  let errorMsg = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
                  queueErrors.push({ skuXPublish, errorMsg, reqMeli: skuMeli })
                }
              }

              if (error.response.data.cause[0].cause_id == 285) {
                await publishCollection.updateOne({ publishId: publish.publishId }, { $set: { freezedByDeal: true } });
                queueSuccess.push({ publishId: skuXPublish.publishId, marketPlaceId: marketPlace._id, reqMeli: skuMeli });
              }
            }
            else {
              let errorMsg = error.response ? error.response.data : error.message ? error.message : JSON.stringify(error);
              queueErrors.push({ skuXPublish, errorMsg, reqMeli: skuMeli })
            }
          }
        }

        if (!queueErrors.length) {
          let queueErrorColl = db.collection('queueError');
          await queueErrorColl.deleteOne({ 'content.queue._id': queue._id });

          queue.content.skuOperation = queue.content.price ? 'PRICE' : 'STOCK';
          queue.content.publishes = queueSuccess;

          await upsertQueueSuccess(
            db, 'SKU', 'MKP', queue.sellerId, marketPlace.platformId, null, service.name,
            { 'content.sku': queue.content.sku, 'content.skuOperation': queue.content.skuOperation },
            { 'content': queue.content }
          );

          await publishCollection.updateOne({ publishId: publish.publishId }, { $set: { freezedByDeal: false } });


        }
        else
          await upsertQueueError(
            db, 'SKU', 'MKP', queue.sellerId, marketPlace.platformId, marketPlace._id, service.name,
            queueErrors, { 'content.queue._id': queue._id }, { content: { queue, publishId: publish ? publish.publishId : null } }
          );

        deleteQueue(db, queue);
      }
    }

  } catch (error) {
    await upsertQueueError(db, 'SKU', 'MKP', null, null, null, service.name, error);
  }
}

const syncAllPublishies = async (db, config, service) => {
  let publishColl = db.collection('publish');
  let marketPlaceCollection = db.collection('marketPlace');

  try {
    let totalPublishies = await publishColl.count();

    for (let i = 0; i <= totalPublishies / 1000; i++) {
      let publishList = await publishColl.find({})
        .limit(1000)
        .skip(i * 1000)
        .toArray();

      let marketPlaces = await marketPlaceCollection.find({ _id: { $in: publishList.map(m => m.marketPlaceId) } }).toArray();

      for (let publish of publishList) {
        try {

          let marketPlace = marketPlaces.find(f => f._id.equals(publish.marketPlaceId));
          await syncPublishies(db, config, marketPlace, publish.sellerId, [publish.publishId]);

        } catch (error) {
          await upsertQueueError(
            db,
            'PUBLISH',
            'MKP',
            publish.sellerId,
            publish.platformId,
            publish.marketPlaceId,
            service.name,
            getErrorMessage(error),
            { publishId: publish.publishId },
            { publishId: publish.publishId }
          );
        }
      }

    }

  } catch (error) {
    await upsertQueueError(db, 'PUBLISH', 'MKP', null, null, null, service.name, getErrorMessage(error));
  }

}

const getMessagesMeli = async (db, config, service) => {

  let marketPlaceColl = db.collection('marketPlace');

  try {
    let queues = await lockAndGetQueue(db, config, 'MESSAGES', 'MKP', service.platformId, service.queueLimit);

    let sellerId;

    let marketPlaces = await marketPlaceColl.find({ _id: { $in: queues.map(m => m.marketPlaceId) } }).toArray();

    for (let queue of queues) {

      let messageResourceId;

      try {
        let marketPlace = marketPlaces.find(f => f._id.equals(queue.marketPlaceId));

        let messageMeli = await getMeliSaleMessage(db, config, marketPlace, queue.content.messagesId);

        messageResourceId = messageMeli.resourceId;

        let sellerId = await db.collection('order').find({ messageResourceId })

        // pegar o número da venda no messageMeli.resourceId e buscar no mongo na collection sale, pegar o sellerID da venda e gravar na mensagem e também nos logs de erro ok

        let message = await db.collection('questions').insertOne({
          sellerId: sellerId,
          marketPlaceId: marketPlace._id,
          platformId: queue.platformId,
          message: messageMeli.messages[0].text,
          type: 'MESSAGE'
        })

        // salva a mensagem no mongo ok


        await deleteQueue(db, queue);
      } catch (error) {

        await upsertQueueError(
          db,
          'MESSAGES',
          'MKP',
          sellerId, //este seller não é válido quando é loja oficial o valor fica null ok
          queue.platformId,
          queue.marketPlaceId,
          service.name,
          getErrorMessage(error),
          { 'content.queueId': queue._id },
          { 'content.queueId': queue._id }
        );
      }

    }

  } catch (error) {
    await upsertQueueError(db, 'MESSAGES', 'MKP', null, null, null, service.name, getErrorMessage(error));
  }
}

const getQuestionsMeli = async (db, config, service) => {

  let queues = await lockAndGetQueue(db, config, 'QUESTIONS', 'MKP', service.platformId, service.queueLimit);
  let marketPlaceColl = await db.collection('marketPlace').find({ _id: { $in: queues.map(m => m.marketPlaceId) } }).toArray();
  let questionsIds = queues.map(m => { return { ...m.content, marketPlaceId: m.marketPlaceId, _id: m._id } });

  let questions = [];

  for (let question of questionsIds) {
    try {
      questionId = await getMeliQuestionMessage(db, config, marketPlaceColl.find(f => f._id.equals(question.marketPlaceId)), question.questionsId);
      buyerName = await getMeliUserId(db, config, marketPlaceColl.find(f => f._id.equals(question.marketPlaceId)), questionId.from.id);
      questions.push({ ...questionId, name: buyerName.nickname, _id: question._id, marketPlaceName: marketPlaceColl.find(f => f._id.equals(question.marketPlaceId)).name });
    } catch (error) {

      await db.collection('questions').updateOne(
        { questionId: question.questionsId },
        {
          $set: { deleted: true }
        },
        { upsert: true })

      await deleteQueue(db, question)
    }
  }

  let publishColl = await db.collection('publish').find({ publishId: { $in: questions.map(m => m.item_id) } }).toArray();
  let skuXPublishColl = await db.collection('skuXPublish').find({ publishId: { $in: questions.map(m => m.item_id) } }).toArray();
  for (let question of questions) {
    try {

      let publish = publishColl.find(f => f.publishId == question.item_id);

      if (publish && publish.sellerId) {
        let {
          marketPlaceId,
          title,
          platformId
        } = publishColl.find(f => f.publishId == question.item_id);
        let ret = skuXPublishColl.find(f => f.publishId == question.item_id && f.price > 0);

        let set = {
          questionId: question.id,
          marketPlace: question.marketPlaceName,
          sellerId: publish.sellerId,
          marketPlaceId: marketPlaceId,
          platformId: platformId,
          price: ret.price ? ret.price : 0,
          externalId: question.item_id,
          publishName: title,
          publishPictures: Array.isArray(ret.images) && ret.images.length > 0 ? ret.images[0] : undefined,
          type: 'QUESTIONS',
          createdAt: new Date(),
          name: question.name,
          read: false,
          message: question.text,
          answser: question.answer ? question.answer.text : '',
          from: question.from.id
        }

        if (question.deleted_from_listing == true) set['deleted'] = new Date();

        if (question.text)
          await db.collection('questions').updateOne(
            { questionId: question.id },
            {
              $set: set
            },
            { upsert: true }
          );

      }
      await deleteQueue(db, question);
    } catch (error) {

      await upsertQueueError(
        db,
        'QUESTIONS',
        'MKP',
        sellerId ? sellerId : null, //este seller não é válido quando é loja oficial o valor fica null ok
        queue.platformId,
        queue.marketPlaceId,
        service.name,
        getErrorMessage(error),
        { 'content.queueId': queue._id },
        { 'content.queueId': queue._id }
      );
    }
  }
}

const getPaymentStatus = async (db, config, service) => {

  let orderColl = db.collection('order');
  let marketPlaceColl = db.collection('marketPlace');

  let ordersQty = await orderColl.count({ 'payments.status': 'approved' });


  for (let index = 0; index < ordersQty; index = index + 500) {

    let orders = await orderColl.find({ 'payments.status': 'approved' }).limit(500).skip(index).toArray();
    let marketPlaces = await marketPlaceColl.find({ _id: { $in: orders.map(m => m.marketPlaceId) } }).toArray();

    for (let order of orders) {
      let marketPlace = marketPlaces.find(f => f._id.equals(order.marketPlaceId))

      for (let idxPay = 0; idxPay <= order.payments.length - 1; idxPay++) {
        try {
          let payment = order.payments[idxPay]
          if (payment.status == 'approved') {
            let retMP = await getPaymentMp(db, config, marketPlace, payment.paymentId);

            if (new Date(retMP.money_release_date) <= new Date()) {
              await putMoneyOrderStatus(db, order.packId ? order.packId : order.externalId, 'received')
              let setter = {};
              setter[`payments.${idxPay}.status`] = 'received';
              await orderColl.updateMany({ externalId: order.externalId }, { $set: setter })
            }
          }
        } catch (error) {

          await upsertQueueError(
            db,
            'MONEY',
            'MKP',
            order.sellerId,
            order.platformId,
            order.marketPlaceId,
            service.name,
            getErrorMessage(error),
            { 'content.queueId': order.externalId },
            { 'content.queueId': order.externalId }
          );

        }
      }

    }
  }








}


module.exports = executeMeli;
