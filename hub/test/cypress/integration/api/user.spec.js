import { SHA256 } from "crypto-js";

describe('Teste api de usuario', () => {


  it('Registro de usuario SU', () => {
    cy.request(
      'POST', 
      'http://localhost:2540/v1/front/user/', 
      { 
        name:'Bruna',
        phone: '(11) 99999-9999',
        document: '023.051.156-28',
        mail: 'bruna.fernandes@arsenalcar.com.br',
        password: (SHA256('Hobbit@1')).toString(),
        code: 'normal',
        su: true
      }
    ).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.userToken).to.exist;
    })
  })
})

