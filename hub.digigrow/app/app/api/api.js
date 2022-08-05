




import axios from 'axios';
import { logout } from '../utils/auth';
import { handleError } from '../utils/error';


export const headers = localStorage.getItem('userToken') ? {usertoken: localStorage.getItem('userToken')} : {};

export const baseURL = process.env.NODE_ENV != 'production'
  ? 'http://localhost:2540/v1/front'
  : 'https://api.digigrow.com.br/v1/front';


export const api = axios.create({
  baseURL: baseURL,
  headers
});

export const promisseApi = (method, path, callbackData, callbackError, body = {}, config = {}) => {  
  let configAxios = {
    method: method,
    // timeout: 20000,
    url: `${baseURL}${path}`,
    ...config,
    data: body
  };

  configAxios.headers ? 
    configAxios.headers.usertoken = localStorage.getItem('userToken') : 
    configAxios.headers = {usertoken : localStorage.getItem('userToken')};
  
  axios(configAxios)
    .then(data => {
      callbackData(data.data)
    })     
    .catch(err => {
      if(err.response.status === 401) 
        logout()
      else
        callbackError(handleError(err)) 
    });
}
