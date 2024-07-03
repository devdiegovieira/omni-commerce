/// <reference types="cypress" />
const SHA256 = require('crypto-js/sha256');

context('API', () => {
  // beforeEach(() => {
  //   cy.visit('https://example.cypress.io/commands/actions')
  // })

  // https://on.cypress.io/interacting-with-elements

  it('API', () => {
    // https://on.cypress.io/type
    cy.request({
      method: 'POST',
      url: 'http://localhost:2540/v1/front/user/auth',
      body: {
        mail: 'everton.jackson@arsenalcar.com.br',
        password: (SHA256('12345')).toString(),
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.userToken).to.exist;
    })
  })  
})
