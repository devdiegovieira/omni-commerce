import { clickBtnSignUp, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickBtnContinueRegisterPage, clickBtnNewSeller, clickBtnSendCode, getMessageSnackBar, getMessageConfirmationRegister, getMsgWelcome, typeConfirmationCode, typeConfirmationPasswordRegisterPage, typeEmailRegisterPage, typeUserDocument, typeUserName, typeUserPhone, getWelcomeMessage, getCheckLogin, clickSlctResearch, slctResearch } from "../../../support/page-objects/register";

describe('Teste automatizado registro de usuario', () => {


   it('Registro dados validos', () => {
      cy.visit('/');
      clickBtnSignUp();
      typeEmailRegisterPage('bruna.fernandes@arsenalcar.com.br');
      clickBtnSendCode();
      getMessageSnackBar().then((message) => { expect(message).equal('Código Enviado!') });
      typeConfirmationCode("5555");
      typeUserName("Bruna");
      typeUserDocument("02305115628");
      typeUserPhone("11972252156");
      clickSlctResearch();
      slctResearch();
      typePasswordLoginPage("Hobbit@1");
      typeConfirmationPasswordRegisterPage("Hobbit@1");
      clickBtnContinueRegisterPage();
      cy.wait(5);
      getMessageSnackBar().then((message) => { expect(message).contains('Usuário criado com sucesso!') });
      cy.wait(10);
      clickBtnNewSeller();
      })
   })

