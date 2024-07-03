const getConfig = require('./config');       


const getCliente = async (req, mongoConnection) => {
  let tokenAccount = 
    req.headers && req.headers.tokenaccount ? 
    req.headers.tokenaccount : 
    req.query && req.query.tokenaccount ? 
    req.query.tokenaccount :
    req.params && req.params.tokenaccount ? 
    req.params.tokenaccount :
    '';  

  if (!tokenAccount) throw 'Header > tokenAccount Needed!';    

  let seller = (await getConfig(mongoConnection)).seller;

  let cliente = seller.find(e => e.invento.tokenAccount == tokenAccount);
  if (!cliente) throw `Seller by tokenAccount ${tokenAccount} not found!`;
  let connectionString = cliente.invento.connectionString;

  return {tokenAccount, cliente, connectionString};
}

module.exports = getCliente;