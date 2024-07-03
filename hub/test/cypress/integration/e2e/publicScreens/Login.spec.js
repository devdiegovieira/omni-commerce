import { clickMenuItemRegister, getUserName } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, getErroMessageEmail, getErroMessagePassword, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";

describe('Teste automatizado login dados validos e invalidos', () => {


   it('Login dados validos', () => {
      cy.visit('/');
      typeEmailLoginPage("bruna.fernandes@arsenalcar.com.br");
      typePasswordLoginPage("Hobbit@1");
      clickContinueLoginPage();
      getUserName().then((userName) => {
         expect(userName).equal('Bruna FernandesOnline')
      })
      clickMenuItemRegister();
   })

   it('Login dados invalidos', () => {
      cy.visit('/');

      typeEmailLoginPage("bruna.fernandes");
      typePasswordLoginPage("Hobbit@1");
      getErroMessageEmail().then((errorMsg) => {
         expect(errorMsg).equal('Email inválido')
      })

   })

   it('Login dados invalidos/2', () => {
      typeEmailLoginPage("bruna.fernandes@.com.br");
      typePasswordLoginPage("xxxxx");
      clickContinueLoginPage();
      getErroMessagePassword().then((errorMsg) => {
         expect(errorMsg).equal('Usuário ou senha inválidos.')
      })

   })

})