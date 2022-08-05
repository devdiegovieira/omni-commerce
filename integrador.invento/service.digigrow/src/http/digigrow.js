let axios = require('axios');

const putSkuDigigrow = async (config, sellerDigigrow, body) => {

  try {
    let configAxios = {
      method: 'put',
      timeout: 20000,
      url: `${config.urls.digigrow}/v1/sku/stockAndPrice`,
      headers: {
        'sellerId': sellerDigigrow.digigrow.sellerId,
        'userToken': sellerDigigrow.digigrow.userToken,
        'Content-Type': 'application/json'
      },
      data: body
    };

    return (await axios(configAxios)).data;
  } catch (error) {
    error
  }
}


const getFilaPedidoDigigrow = async (config, sellerDigigrow) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.digigrow}/v1/order/queue`,
    headers: {
      'userToken': sellerDigigrow.digigrow.userToken,
      'Content-Type': 'application/json'
    }
  };

  return (await axios(configAxios)).data;
}

const deleteFilaPedidoDigigrow = async (config, sellerDigigrow, queueIdList) => {
  let configAxios = {
    method: 'delete',
    timeout: 20000,
    url: `${config.urls.digigrow}/v1/order/queue`,
    headers: {
      'userToken': sellerDigigrow.digigrow.userToken,
      'Content-Type': 'application/json'
    },
    data: queueIdList
  };

  return (await axios(configAxios)).data;
}


const getPedidosDigigrow = async (config, sellerDigigrow, orderIds) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.digigrow}/v1/order`,
    // url: `http://localhost:2540/v1/order`,
    headers: {
      userToken: sellerDigigrow.digigrow.userToken,
      'Content-Type': 'application/json'
    },
    params: {
      orderIds
    }
  };

  return (await axios(configAxios)).data;
}

const putStatusPedidoDigigrow = async (config, sellerDigigrow, data) => {
  let configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.digigrow}/v1/order/status`,
    // url: `http://localhost:2540/v1/order/status`,
    headers: {
      userToken: sellerDigigrow.digigrow.userToken,
      'Content-Type': 'application/json'
    },
    data
  };

  return (await axios(configAxios)).data;
}




module.exports = { putSkuDigigrow, getFilaPedidoDigigrow, getPedidosDigigrow, deleteFilaPedidoDigigrow, putStatusPedidoDigigrow };
