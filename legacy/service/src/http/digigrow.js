let axios = require('axios');

const putSku = async (config, seller, body) => {

  try {
    let configAxios = {
      method: 'put',
      timeout: 20000,
      url: `${config.urls.}/v1/sku/stockAndPrice`,
      headers: {
        'sellerId': seller..sellerId,
        'userToken': seller..userToken,
        'Content-Type': 'application/json'
      },
      data: body
    };

    return (await axios(configAxios)).data;
  } catch (error) {
    error
  }
}


const getFilaPedido = async (config, seller) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.}/v1/order/queue`,
    headers: {
      'userToken': seller..userToken,
      'Content-Type': 'application/json'
    }
  };

  return (await axios(configAxios)).data;
}

const deleteFilaPedido = async (config, seller, queueIdList) => {
  let configAxios = {
    method: 'delete',
    timeout: 20000,
    url: `${config.urls.}/v1/order/queue`,
    headers: {
      'userToken': seller..userToken,
      'Content-Type': 'application/json'
    },
    data: queueIdList
  };

  return (await axios(configAxios)).data;
}


const getPedidos = async (config, seller, orderIds) => {
  let configAxios = {
    method: 'get',
    timeout: 20000,
    url: `${config.urls.}/v1/order`,
    // url: `http://localhost:2540/v1/order`,
    headers: {
      userToken: seller..userToken,
      'Content-Type': 'application/json'
    },
    params: {
      orderIds
    }
  };

  return (await axios(configAxios)).data;
}

const putStatusPedido = async (config, seller, data) => {
  let configAxios = {
    method: 'put',
    timeout: 20000,
    url: `${config.urls.}/v1/order/status`,
    // url: `http://localhost:2540/v1/order/status`,
    headers: {
      userToken: seller..userToken,
      'Content-Type': 'application/json'
    },
    data
  };

  return (await axios(configAxios)).data;
}




module.exports = { putSku, getFilaPedido, getPedidos, deleteFilaPedido, putStatusPedido };
