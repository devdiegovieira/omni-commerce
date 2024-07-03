import { clickConfirmDeleteImage, clickDeleteImage, getMsgConfirmAlteration, getUploadLogoSeller, openDetail } from "../../../support/page-objects/imageComponent";
import { clickMenuItemRegister, clickMenuItemSeller, clickOpenSideBar } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickSaveSeller, getUploadFile } from "../../../support/page-objects/seller";

describe('Validação componente de imagem', () => {

  it('Teste Componete de imagem em todas as tela', () => {

    cy.visit('/');
        typeEmailLoginPage("bruna.fernandes@arsenalcar.com.br");
        typePasswordLoginPage("Hobbit@1");
        clickContinueLoginPage();
        cy.wait(1000);
        clickOpenSideBar();
        clickMenuItemRegister();
        clickMenuItemSeller();
        cy.wait(1000)
        openDetail();
        getUploadLogoSeller();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        cy.wait(1000)
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        getUploadLogoSeller();
        clickSaveSeller();
        getMsgConfirmAlteration().then((msgConfirm) => { expect(msgConfirm).contains('Registro atualizado com sucesso!') });
        clickSaveSeller();
        getMsgConfirmAlteration().then((msgConfirm) => { expect(msgConfirm).contains('Registro atualizado com sucesso!') });
        clickSaveSeller();
        getMsgConfirmAlteration().then((msgConfirm) => { expect(msgConfirm).contains('Registro atualizado com sucesso!') });
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();
        clickDeleteImage();
        clickConfirmDeleteImage();

  })
  })