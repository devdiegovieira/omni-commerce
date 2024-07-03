const executeMeli = require('./src/mercadoLivre');
const mongoConnect = require('./../lib/db/mongo');
const getConfig = require('./../lib/data/config');
const { executeSigep } = require('./src/sigep');
const { executeInternal } = require('./src/internal');
const { upsertQueueError } = require('../lib/data/queue');


const serviceExecute = async (db, service, config) => {
  let serviceCollection = db.collection('configServices');
  let platformCollection = db.collection('platform');
  let lastExecutionTime = new Date();

  let platform = await platformCollection.findOne({ '_id': service.platformId });

  if (platform) {
    try {
      switch (platform.code) {
        case "MLB":
          await executeMeli(service, db, config);
          break;
        case "SIGEP":
          await executeSigep(service, db, config);
          break;
        case "INTERNAL":
          await executeInternal(service, db, config);
          break;
      }
    }
    catch (err) {
      upsertQueueError(db, 'INTERNAL', 'ANY', null, null, null, 'SERVICE', JSON.stringify(err))
    }
    
    lastExecutionTime = Math.abs(lastExecutionTime - new Date()) / 1000;
    await serviceCollection.updateOne(
      { '_id': service._id },
      { $inc: { threadWorking: -1 }, $set: { lastExecutionTime } }
    );
  }
}

const executeServices = async () => {
  let db = await mongoConnect();
  let debug = process.argv.find(f => f == 'debug');

  let serviceColl = db.collection('configServices');
  await serviceColl.updateMany({}, { $set: { threadWorking: 0 } });

  setInterval(async function () {
    let config = await getConfig(db);

    // verifica quais serviços precisam ser executados
    let services = config.services.filter(f =>
      ((!debug && f.active) || (debug && f.debug)) && (f.threadLimit > f.threadWorking) &&
      Math.abs(f.lastExecute - new Date()) >= f.intervalSeconds * 1000
    );

    let serviceColl = db.collection('configServices');
    for (let service of services) {
      await serviceColl.updateMany({ '_id': service._id }, { $inc: { threadWorking: 1 }, $set: { lastExecute: new Date() } });
      serviceExecute(db, service, config);
    }

    // services.forEach(service => {
    //   serviceExecute(db, service, config);
    // });

  }, 5000);
}

executeServices();