const express = require('express');
const sql = require('mssql');
const authentication = require('../middlewares/authMiddleware');
const getConfig = require('../helper/config')

const router = express.Router();
// // Protege endpoint com BEARER
// router.use(authentication);

router.post('/', async (req, res, next) => {
  let pool;
  try {
    if (!req.body.products) throw 'Estrutura de requisição inválida'; 

    let sellerDigigrow = (await getConfig(req.mongoConnection)).sellerDigigrow;

    let cliente = sellerDigigrow.find(e => e.prefixo == req.body.products[0].sku.substr(0, 4));
    let connectionString = cliente ? cliente.invento.connectionString : sellerDigigrow.find(e => e.prefixo == "") ? sellerDigigrow.find(e => e.prefixo == "").invento.connectionString : null;

    if (!connectionString) throw 'Connection string não encontrada';

    pool = await new sql.connect(connectionString)
    let query = await pool.request()
        .input('amount', sql.Decimal, req.body.products[0].amount)
        .input('weight', sql.Decimal, req.body.products[0].weight)
        .input('zipCode', sql.VarChar, req.body.zipCode)
        .query(
          `select top 1 
            d.Descricao serviceName,
            e.Fantasia carrierName,
            a.PrazoEntrega deliveryTime, 
            c.ValorCobrar * @amount price, 
            d.CodigoExterno freightType
          from FreteLocalidadePreco c WITH (NOLOCK)
            inner join FreteLocalidadeTransporte a WITH (NOLOCK) on (a.ID = c.FreteLocalidadeTransporteID)
            inner join FreteLocalidade b WITH (NOLOCK) on (b.ID = a.FreteLocalidadeID)
            inner join TransporteConfiguracaoServico d WITH (NOLOCK) on (d.ID = a.TransporteConfiguracaoServicoID)
            inner join Parceiro e WITH (NOLOCK) on (e.ID = a.TransportadoraID)
          where c.GCRecord is null
            and a.GCRecord is null
            and b.GCRecord is null
            and d.GCRecord is null
            and e.GCRecord is null
            and c.Peso > @weight
            and b.Ativa = 1
            and CAST (@zipcode as bigint)
            between CAST(b.CEPInicial as bigint) and CAST(b.CEPFinal as bigint)
            order by c.ValorCobrar
          `)
        
    res.status(200).json({items: query.recordset});

  } catch (err) {
    res.status(400).json(err.message ? err.message : err);
  } finally {
    if (pool) await pool.close();
  }
});

module.exports = app => app.use('/shipping', router);