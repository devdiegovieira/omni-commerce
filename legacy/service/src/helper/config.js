async function getConfig(database) {
  let config = database.collection('config');
  let configServices = database.collection('configServices');
  let sellerCollection = database.collection('seller');
  
  let configReturn = await config.findOne();
  configReturn.services = await configServices.find().toArray();
  configReturn.seller = await sellerCollection.find().toArray();

  return configReturn;
}

module.exports = getConfig; 

