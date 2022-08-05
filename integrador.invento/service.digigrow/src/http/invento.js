let axios = require('axios');
let { chunkArray } = require('./../helper/javaScript');

const postPedidoInvento = async (config, cliente, data) => {
  let configAxios = {
    method: 'post',
    timeout: 20000,
    url: `${config.urls.inventoV1.replace('{0}', cliente.subdominio)}/orders`,
    headers: {
      'Authorization': cliente.tokenIntegration,
      'Content-Type': 'application/json'
    },
    data
  };
  return (await axios(configAxios)).data;
}

const getPedidoStatusInvento = async (config, cliente) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.inventoV1.replace('{0}', cliente.subdominio)}/orders/status/queue/${cliente.tokenAccount}/500`,
    headers: {
      'Authorization': cliente.tokenIntegration,
      'Content-Type': 'application/json'
    }
  };
  return (await axios(configAxios)).data;
}

const removePedidoStatusInvento = async (config, cliente, data) => {
  configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.inventoV1.replace('{0}', cliente.subdominio)}/status/queue/confirm`,
    headers: {
      'Authorization': cliente.tokenIntegration,
      'Content-Type': 'application/json'
    },
    data
  };
  return await axios(configAxios);
}

const getStatusSkuInventoV2 = async (config, sku, cliente) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.inventoV2}/sku/${sku}/status`,
    headers: {
      'Authorization': config.tokens.bearerInventoV2,
      'tokenAccount': cliente.tokenAccount,
      'Content-Type': 'application/json'
    }
  };
  return await axios(configAxios);
}

// Consumir preço Invento

const getQueuePrice = async (config, tokenAccount) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.inventoV2}/queue/price`,
    headers: {
      'Authorization': config.tokens.bearerInventoV2,
      'tokenAccount': tokenAccount,
      'Content-Type': 'application/json'
    }
  };
  return (await axios(configAxios)).data;
}

const getQueueStock = async (config, tokenAccount) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.inventoV2}/queue/stock`,
    headers: {
      'Authorization': config.tokens.bearerInventoV2,
      'tokenAccount': tokenAccount,
      'Content-Type': 'application/json'
    }
  };
  return (await axios(configAxios)).data;
}

//Remover da fila Invento

const removeQueue = async (config, tokenAccount, data) => {

  let chuncksBody = chunkArray(data, 500);

  for (let chunck of chuncksBody) {
    let configAxios = {
      method: 'delete',
      timeout: 20000,
      url: `${config.urls.inventoV2}/queue`,
      headers: {
        'Authorization': config.tokens.bearerInventoV2,
        'tokenAccount': tokenAccount,
        'Content-Type': 'application/json'
      },
      data: chunck
    };
   await axios(configAxios)
  }
}

const getOrderNumberInvento = async (config, tokenAccount, orderNumber) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.inventoV2}/order/number`,
    headers: {
      'Authorization': config.tokens.bearerInventoV2,
      'tokenAccount': tokenAccount,
      'Content-Type': 'application/json'
    },
    params: {
      orderNumber
    }
  };
  return (await axios(configAxios)).data;
}

module.exports = {
  postPedidoInvento,
  getPedidoStatusInvento,
  removePedidoStatusInvento,
  getStatusSkuInventoV2,
  getQueuePrice,
  getQueueStock,
  removeQueue,
  getOrderNumberInvento
};