let axios  = require('axios');

const getPedidoAnyMarket = async (config, pedido) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.anyMarket}/orders/${pedido.content.id}`,
    headers: { 
      'gumgaToken': pedido.gumgaToken, 
      'Content-Type': 'application/json'
    }
  };
  
  return await axios(configAxios);
}

const getFeedAnyMarket = async (config, gumgaToken) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.anyMarket}/orders/feeds`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    params: {
      limit:1000
    }
  };
  
  return await axios(configAxios);
}

const putRemoveFeedAnyMarket = async (config, gumgaToken, feedAny) => {
  let configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.anyMarket}/orders/feeds/${feedAny.id}`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    data: {token: feedAny.token}
  };
  
  return await axios(configAxios);
}

const putStatusPedidoAnyMarket = async (config, idAny, gumgaToken, body) => {
  let configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.anyMarket}/orders/${idAny}`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    data: body
  };
 
  return await axios(configAxios);
}

const putPriceAnyMarket = async (config, product, gumgaToken, body) => {
  let configAxios = {
    method: 'put',
    url: `${config.urls.anyMarket}/products/${product.idProdutoAny}/skus/${product.idSkuAny}`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    data: body
  };

  return await axios(configAxios);
}
    

const getSkuAnyMarket = async (config, product, gumgaToken) => {
  let configAxios = {
    method: 'get',
    url: `${config.urls.anyMarket}/products/${product.idProdutoAny}/skus/${product.idSkuAny}`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    }
  };

  return await axios(configAxios);
}

const putStocksAnyMarket = async (config, gumgaToken, body) => {
  let configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.anyMarket}/stocks`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    data: body
  };
 
  return await axios(configAxios);
}


const getProductAnyMarket = async (config, gumgaToken) => {
  let configAxios = {
    method: 'get',
    url: `${config.urls.anyMarket}/products/`,
    headers: { 
      'gumgaToken': gumgaToken, 
      'Content-Type': 'application/json'
    },
    params: {
    limit:100
  
    }
  };

  let productsAny = [];
  let returnAny = (await axios(configAxios)).data;
  let pages = Math.trunc(returnAny.page.totalElements / 100);
  productsAny.push(...returnAny.content);

  for (var page = 1; page <= pages; page++) {
    configAxios.params.offset = page * 100;
    returnAny = (await axios(configAxios)).data;
    productsAny.push(...returnAny.content);
  }
  
  return productsAny;

}



module.exports = {getPedidoAnyMarket, getFeedAnyMarket, putRemoveFeedAnyMarket, putStatusPedidoAnyMarket, putStocksAnyMarket, putPriceAnyMarket, getSkuAnyMarket, getProductAnyMarket};
