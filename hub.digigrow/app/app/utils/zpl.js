import axios from "axios";
import { handleError } from "./error";

export const getZPLImage = (zpl, success, error) => {
  const configAxios = {
    method: 'post',
    timeout: 20000,
    url: 'https://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/',
    headers: {
      Accept: 'image/png',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'arraybuffer',
    data: zpl
  };

  axios(configAxios)
    .then(data => {
      success(Buffer.from(data.data, 'binary').toString('base64'))
    })
    .catch(
      (err) => error(handleError(err))
    );
}