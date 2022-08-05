const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const args = process.argv.find(f => f == 'dev');
const uri = "mongodb+srv://digigrow:digigrow@cluster0.eqwws.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

let client = null;
async function mongoConnect(){
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();

  
  let database = null;
  if (!args)
    database = client.db("inventoDb");
  else
    database = client.db("inventoDb_DEV");

  return database;
}

module.exports = mongoConnect; 