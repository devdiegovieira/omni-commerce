export const encode = (decoded) => {
  let buff = new Buffer.from(decoded);
  return buff.toString('base64');
}

export const decode = (encoded) => {
  let buff = new Buffer.from(encoded, 'base64');
  return buff.toString('ascii');
}
