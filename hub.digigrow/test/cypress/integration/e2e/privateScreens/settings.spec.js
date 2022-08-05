import { clickContinueLoginPage, getErroMessageEmail, getErroMessagePassword, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickMenuItemProducts, clickMenuItemRegister, clickMenuItemSettings, clickOpenSideBar, getUserName } from "../../../support/page-objects/left-Side-Bar";
import { clickBtnConfirm, clickBtnRedefineMail, clickBtnRedefinePassword, clickSaveProfile, clickTab, clickTabLogin, clickTabProfile, getConfirmMessageSettings, typeMailSettings, typeNewPassword, typePassword, typePasswordConfirm, typeUserName, uploadImageProfile } from "../../../support/page-objects/setttings";
import { clickBtnContinueRegisterPage, typeConfirmationCode } from "../../../support/page-objects/register";

describe('Teste automatizado tela de configurações', () => {

  it('Tela configurações', () => {
    cy.visit('/');
    typeEmailLoginPage('bruna.fernandes@arsenalcar.com.br');
    typePasswordLoginPage('Hobbit@1');
    clickContinueLoginPage();
    clickOpenSideBar();
    clickMenuItemSettings();
    cy.wait(100);
    clickTabProfile();
    typeUserName('Bruna Fernandes');
    uploadImageProfile();
    clickSaveProfile();
    getConfirmMessageSettings().then((confirmMsgSettings) => {expect(confirmMsgSettings).equal('Dados salvos com sucesso!')});
    clickTabLogin();
    cy.wait(100);
    typePassword('Hobbit@1');
    typeNewPassword('Hobbit@2');
    typePasswordConfirm('Hobbit@2');
    clickBtnRedefinePassword();
    getConfirmMessageSettings().then((confirmMsgSettings) => {expect(confirmMsgSettings).equal('Senha Redefinida com sucesso!')});
    typeMailSettings('bruna.fernandes@digigrow.com.br');
    clickBtnRedefineMail();
    cy.wait(100)
    typeConfirmationCode('5555');
    clickBtnConfirm();
    
  })
})