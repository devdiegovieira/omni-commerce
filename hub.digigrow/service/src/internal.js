const { lockAndGetQueue, upsertQueueError, deleteQueue, deleteQueueError } = require("../../lib/data/queue");
const { upsertSku, upsertProducts } = require("../../lib/data/sku");
const { getErrorMessage } = require("../../lib/util/error");

const executeInternal = async (service, db, config) => {
  switch (service.name) {
    case "uploadSku":
      await uploadSku(service, db, config);
      break;
    case "updateConcludedMoney":
      await updateConcludedMoney(service, db, config);
      break;
    case "deleteIncompleteUsers":
      await deleteIncompleteUsers(service, db, config);
      break;

  }
}

const deleteIncompleteUsers = async (service, db, config) => {
  let userColl = db.collection('user');
  let currentDay = new Date();
  let incompleteRegistrationTolerance = 1;
  let dateValidate = new Date(currentDay.setDate(currentDay.getDate() - incompleteRegistrationTolerance));
  let usersNotToken = await userColl.find({ tokenDate: { $lte: dateValidate }, userToken: { $exists: false } }).toArray();

  let deleteUserToken = [];
  for (let userNotToken of usersNotToken) {
    deleteUserToken.push(userNotToken._id);
  }
  if (!deleteUserToken.lenght) {
    await userColl.deleteMany({ _id: { $in: deleteUserToken } })
  }
}
const uploadSku = async (service, db, config) => {

  let userColl = db.collection('user');
  let queues = await lockAndGetQueue(db, config, 'UPLOAD', 'HUB', undefined, service.queueLimit);
  let usersQueue = queues.map(m => m.userId);
  let user = await userColl.find({ document: { $in: usersQueue } }).toArray();
  let userXSellerColl = db.collection('userXSeller')
  let userSeller = await userXSellerColl.find({ userId: { $in: user.map(m => m._id) } }).toArray();
  user.map(m => m.sellerIds = userSeller.filter(f => f.userId.equals(m._id)).map(m => m.sellerId))
  try {
    for (queue of queues) {
      try {
        let rets = await upsertProducts(db, queue.content, user.find(f => f.document == queue.userId));

        for (let ret of rets) {

          if (ret.type == 'error') {

            await upsertQueueError(
              db, 'UPLOAD', 'HUB', queue.sellerId, service.platformId, undefined, service.name,
              ret.error, { 'content.sku': ret.sku }, { content: { sku: ret.sku } }
            )
          }

          if (ret.type == 'success')
            await deleteQueueError(db, { 'content.sku': ret.sku, sellerId: queue.sellerId })

        }

      }
      catch (err) {
        await upsertQueueError(
          db, 'UPLOAD', 'HUB', queue.sellerId, service.platformId,
          undefined, service.name, getErrorMessage(err)
        )
      }

      await deleteQueue(db, queue);
    }

  } catch (error) {

    await upsertQueueError(
      db, 'UPLOAD', 'HUB', queues[0].sellerId, service.platformId, undefined, service.name,
      error, { 'content.sku': queue.content.sku }, { content: { sku: queue.content.sku } }

    )
  }
};

const updateConcludedMoney = async (service, db, config) => {

  let moneyOrderColl = db.collection('moneyOrder');

  let date = new Date();
  let day = date.getDate();

  if (day == 01) await moneyOrderColl.updateMany({ paymentStatus: 'received' }, { $set: { paymentStatus: 'concluded', dateClosed: date } }, { upsert: true });


};


module.exports = { executeInternal }; 