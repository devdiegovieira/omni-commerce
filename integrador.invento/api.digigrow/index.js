const cors = require('cors');
const express = require('express');
const app = express();
const mongoConnect = require('./src/configs/mongo');
const compression = require('compression');

app.use(compression());
app.use(cors());
app.use(express.json());

let database = mongoConnect();

app.use(async (req, res, next) => {
  req.mongoConnection = await database;
  next();
})

require('./src/app/controllers/index')(app);


const port = process.env.PORT || 2530;
app.listen(port);

console.log('Servidor rodando na porta: ', port);