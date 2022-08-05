async function getConfig(database) {
  let config = database.collection('config');
  let configServices = database.collection('configServices');
  let sellerDigigrowCollection = database.collection('sellerDigigrow');
  
  let configReturn = await config.findOne();
  configReturn.services = await configServices.find().toArray();
  configReturn.sellerDigigrow = await sellerDigigrowCollection.find().toArray();

  return configReturn;
}

module.exports = getConfig; 

