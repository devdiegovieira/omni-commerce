
let axios = require('axios');

export const getLinkStorage = (link, success, error) => {

  const configAxios = {
    method: 'get',
    timeout: 20000,
    url: link,
  };


  axios(configAxios).then((ret)=>{ success(ret.data) }).catch((err) => { error(err.response ? err.response.data : err) });
}

