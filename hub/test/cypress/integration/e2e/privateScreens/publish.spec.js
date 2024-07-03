import { clickMenuItemLogout, clickMenuItemPublish, clickMenuItemRegister, clickOpenSideBar } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickBtnBackPublish, clickBtnSavePublish, clickDetailPublish, getMsgConfirmSavePublish, selectAccount, selectCategory, selectPublish, selectShipping, selectWarranty, selectWarrantyTime, slctAccount, slctPublish, slctShippingME1, typeBrand, typePublishDescribe, typeWarrantyTime } from "../../../support/page-objects/publish"

describe('Teste automatizado criar anúncio', () => {


  it('Tela anúncios', () => {

    cy.visit('/');
    typeEmailLoginPage("bruna.fernandes@arsenalcar.com.br");
    typePasswordLoginPage("Hobbit@1");
    clickContinueLoginPage();
    cy.wait(1000);
    clickOpenSideBar();
    clickMenuItemRegister();
    clickMenuItemPublish();
    cy.wait(1000);
    clickDetailPublish();
    selectPublish();
    slctPublish();
    selectShipping();
    slctShippingME1();
    selectAccount();
    slctAccount();
    typePublishDescribe('Teste Teste Teste Teste Teste Teste');
    selectCategory();
    selectWarranty();
    typeWarrantyTime('365');
    selectWarrantyTime();
    typeBrand('MarcaTeste');
    clickBtnSavePublish();
    getMsgConfirmSavePublish().then((confirmMsgPublish) => {
      expect(confirmMsgPublish).equal('Anúncio atualizado com sucesso')
    });
    clickBtnBackPublish();


  })

})