const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
let dev = process.argv.find(f => f == 'dev');
let  = process.argv.find(f => f == '');
let uri = "mongodb+srv://:@cluster0.eqwws.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = null;
async function mongoConnect(){
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  let database = null;

  if ()
    database = client.db("digiInvento");
  else if (dev)
    database = client.db("inventoDb_DEV");
  else
    database = client.db("inventoDb");

  return database;
}

module.exports = mongoConnect; 