const { MongoClient } = require("mongodb");
const { generateDefaultBaseTest } = require("../model/defaultBaseTest");


let client = null;
async function mongoConnect() {
  const env = require('dotenv').config().parsed || {};

  const dev = process.argv.find(f => f == 'dev' || f == 'hom' );
  const dontReset = process.argv.find(f => f == 'dontReset');

  const uri = 
    dev ? 
    "mongodb+srv://:2021@cluster0.cg2iu.mongodb.net?retryWrites=true":
    env.MONGO_URI ? env.MONGO_URI : "mongodb+srv://:2021@cluster0.weemq.mongodb.net?retryWrites=true";
  
  client = new MongoClient(uri , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let db = client.db(dev == 'dev' ? "hub_DEV" : dev == 'hom' ? "hub_HOM" :  "hub"); 
  if (dev && !dontReset) await generateDefaultBaseTest(db)

  return db;
}

module.exports = mongoConnect; 