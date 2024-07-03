import { clickMenuItemProducts, clickMenuItemRegister, clickMenuItemRegisterSeller, clickOpenSideBar, getUserName } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, getErroMessageEmail, getErroMessagePassword, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickBtnNewSeller, typeUserName } from "../../../support/page-objects/register";
import { clickAddFirstSeller, clickAddNewSeller, clickBackSellerPage, clickFilter, clickInventoryControl, clickPageSeller, clickSaveSeller, clickSearchZipCode, clickSelectST, clickSelectTRegime, clickSellerPage, clickTaxTab, typeNumber, typePhone, typeSellerDocument, typeSellerName, typeSocialName, typeStateRegistration, typeUserDocumentSeller, typeUserDocumentSellerCPF, typeUserNameSeller, typeZipCode, clickCompleteReegistration, getMsgConcluedRegister, getUploadFile, clickGeralTap } from "../../../support/page-objects/seller";

describe('Teste automatizado registro de empresa', () => {


    it('Cadastrar primeira empresa', () => {

        cy.visit('/');
        typeEmailLoginPage("bruna.fernandes@arsenalcar.com.br");
        typePasswordLoginPage("Hobbit@1");
        clickContinueLoginPage();
        cy.wait(1000);
        clickBtnNewSeller();
        typeSellerName('Empresa1');
        typeSocialName('Empresa1');
        typeSellerDocument('66.166.657/0001-31')
        typeZipCode('074130000')
        clickSearchZipCode();
        cy.wait(1000);
        typeNumber('3636');
        typePhone('11111111111');
        typeUserNameSeller('Bruna');
        typeUserDocumentSeller('20820175');
        typeUserDocumentSellerCPF('02305115628');
        getUploadFile();
        clickTaxTab();
        typeStateRegistration('111.111.111.111');
        clickSelectST();
        clickSelectTRegime();
        clickInventoryControl();
        cy.wait(1000);
        clickSaveSeller();
        cy.wait(1000);
        clickCompleteReegistration();
        getMsgConcluedRegister().then((msgConfirmSeller) => { expect(msgConfirmSeller).contains('Cadastro concluído com sucesso') })
        cy.wait(1000);
        clickBackSellerPage();
        clickAddNewSeller();
        clickGeralTap();
        typeSellerName('Empresa2');
        typeSocialName('Empresa2');
        typeSellerDocument('49.121.059/0001-27')
        typeZipCode('074130000')
        clickSearchZipCode();
        cy.wait(1000);
        typeNumber('3636');
        typePhone('11111111111');
        typeUserNameSeller('Bruna');
        typeUserDocumentSeller('20820175');
        typeUserDocumentSellerCPF('02305115628');
        getUploadFile();
        clickTaxTab();
        typeStateRegistration('111.111.111.111');
        clickSelectST();
        clickSelectTRegime();
        clickInventoryControl();
        cy.wait(1000);
        clickSaveSeller();
        cy.wait(1000);
        clickCompleteReegistration();
        getMsgConcluedRegister().then((msgConfirmSeller) => { expect(msgConfirmSeller).contains('Cadastro concluído com sucesso') })
        cy.wait(1000);
        clickBackSellerPage();
        cy.wait(1000);
        clickOpenSideBar();
        clickMenuItemProducts();
        

        })
    })
