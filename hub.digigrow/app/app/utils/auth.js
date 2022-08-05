import { api, promisseApi } from "../api/api";

export const checkPasswordStrength = (password) => {
  var regexp = /[A-Z]/gi;
  if (!password) return false;

  let strength = 0;
  let validate = true

  if (password.match(regexp)) {
    strength += 1;
  }

  if (password.match(/[0-9]+/)) {
    strength += 1;
  }



  if (password.length < 6) validate = false


  if (password.length > 20) validate = false


  if (strength < 2) validate = false

  return validate;
}





export const login = (mail, password, googleToken, handleSuccess, handleError) => {
  const SHA256 = require('crypto-js/sha256');

  //   const client = new OAuth2Client("228817226732-n7c098tuvhu86tkqtsv7ecqrridj6k0j.apps.googleusercontent.com");

  //   async function verify() {
  //     const ticket = await client.verifyIdToken({
  //         idToken: token,
  //         audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
  //         // Or, if multiple clients access the backend:
  //         //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  //     });
  //     const payload = ticket.getPayload();
  //     const userid = payload['sub'];
  //     // If request specified a G Suite domain:
  //     // const domain = payload['hd'];
  //   }
  // verify().catch(console.error);

  promisseApi(
    'post',
    '/user/auth',
    data => {
      localStorage.setItem('userToken', data.userToken);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userId', data._id);
      localStorage.setItem('userPicture', data.picture);
      localStorage.setItem('userMail', data.mail);
      localStorage.setItem('loggedAt', new Date().getTime());
      localStorage.setItem('links', data.links);
      localStorage.setItem('hasSellers', data.hasSellers);
      handleSuccess();
    },
    (err) => { handleError(err) },
    {
      mail,
      password: (SHA256(password)).toString(),
      googleToken: googleToken
    }
  );
}



export const criptPassword = (pass) => {
  const SHA256 = require('crypto-js/sha256');
  return (SHA256(pass)).toString();
}

export const isAuthorized = (path) => {
  let auth = localStorage.getItem('userToken') && localStorage.getItem('links').includes(`/${path.split('/')[1]}`);

  return auth;
}

export const getAppMenu = (success, error) => {

  api.get('/app/menu')
    .then((data) => {

      let linkMenu = data.data.map(m => m.link).join(',');
      let linkSubMenu = data.data.map(m => m.child ? m.child.map(mm => mm.link) : '').join(',')

      let links = linkMenu + linkSubMenu
      localStorage.setItem('links', links);
      success(data)

    })
    .catch(error);
}

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userPicture');
  localStorage.removeItem('loggedAt');

  location.href = '/';
}