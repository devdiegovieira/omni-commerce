const mongoConnect = require('./src/configs/mongo');
const getConfig = require('./src/helper/config');
const { executeDigigrow } = require('./src/service/digigrowInvento');

const serviceExecute = async (db, service, config) => {
  let serviceColl = db.collection('configServices');
  let lastExecutionTime = new Date();
  
  await executeDigigrow(service, db, config);
  // await executeMeli (service, db, config);
  
  lastExecutionTime = Math.abs( lastExecutionTime - new Date() ) / 1000;
  await serviceColl.updateOne(
    {'_id': service._id}, 
    {$inc: { threadWorking: -1 }, $set : { lastExecutionTime }}
  );   
}

const executeServices = async () => {
  let db = await mongoConnect();
  let debug = process.argv.find(f => f == 'debug');

  let serviceColl = db.collection('configServices');
  await serviceColl.updateMany({}, {$set:{threadWorking: 0}});

  setInterval(async function () {
    let config = await getConfig(db);

    // verifica quais serviços precisam ser executados
    let services = config.services.filter(f => 
      ((!debug && f.active) || (debug && f.debug)) && (f.threadLimit > f.threadWorking) && 
      Math.abs( f.lastExecute - new Date() ) >= f.intervalSeconds * 1000
    );

    let serviceColl = db.collection('configServices');
    for (let service of services) {
      await serviceColl.updateMany({'_id': service._id}, { $inc: { threadWorking: 1 }, $set: { lastExecute: new Date() } });
      serviceExecute(db, service, config);
    }
    
    // services.forEach(service => {
    //   serviceExecute(db, service, config);
    // });

  }, 5000); 
}

executeServices();