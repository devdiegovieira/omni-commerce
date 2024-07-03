import { clickBtnClearFilter, clickBtnFilter, clickBtnMoreFilters, getSellerDocument, getNameList, slctFilterSeller, slctFilterStatusProducts, slctFilterStatusSeller, typeFantasyName, typeSellerDocument, typeSkuProducts, typeTittleProducts, getProdList, getProdListSeller, getProdStatus, slctFilterAtt, typeFilterAtt, typeValueAttProduct, typeTitlePublish, getPublishTittle, typeSKUPublish, clickExpandLineProd, viewAttribute, getPublishAtt, clickCloseDialog, getProdAtt, clickExpandLinePublish, slctFilterPremium, slctFilterStatusPublish, getPublishStatus } from "../../../support/page-objects/filter"
import { clickMenuItemProducts, clickMenuItemPublish, clickMenuItemRegister, clickMenuItemSale, clickMenuItemSeller, clickOpenSideBar } from "../../../support/page-objects/left-Side-Bar";
import { clickBtnSignUp, clickContinueLoginPage, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";

describe('Teste automatizado cadastro de produto', () => {

  it('Cadastro Produto', () => {

    cy.visit('/');
    typeEmailLoginPage('bruna.fernandes@arsenalcar.com.br');
    typePasswordLoginPage('Hobbit@1');
    clickContinueLoginPage();
    clickOpenSideBar();
    clickMenuItemRegister();
    clickMenuItemSeller();
    cy.wait(1000)
    typeFantasyName('Empresa1');
    clickBtnFilter();
    cy.wait(100);
    getNameList().then((sellerName) => {expect(sellerName).include('Empresa1')});
    clickBtnClearFilter();
    typeSellerDocument('49.121.059/0001-27');
    clickBtnFilter();
    cy.wait(100);
    getSellerDocument().then((sellerDocument) => {expect(sellerDocument).include('49.121.059/0001-27')});
    clickBtnClearFilter();
    slctFilterStatusSeller();
    clickBtnFilter();
    clickBtnClearFilter();
    clickMenuItemProducts();
    cy.wait(1000);
    typeSkuProducts('PROD001');
    clickBtnFilter();
    cy.wait(100);
    getProdList().then((codeProd) => {expect(codeProd).include('PROD001')});
    clickBtnClearFilter();
    typeTittleProducts('Produto001');
    clickBtnFilter();
    clickBtnClearFilter();
    slctFilterSeller();
    clickBtnFilter();
    cy.wait(1000);
    clickBtnClearFilter();
    clickBtnMoreFilters();
    slctFilterStatusProducts();
    clickBtnFilter();
    cy.wait(100);
    getProdStatus().then((listProduct) => {expect(listProduct).include('Sem registros para mostrar')});
    clickBtnClearFilter();
    typeFilterAtt('Cor');
    typeValueAttProduct('Branco');
    clickBtnFilter();
    cy.wait(100);
    clickExpandLineProd();
    getProdAtt().then((attProd) => {expect(attProd).include('Cor: Branco')});
    clickBtnClearFilter();
    clickMenuItemPublish();
    cy.wait(1000);
    typeTitlePublish('Produto001');
    clickBtnFilter();
    cy.wait(100);
    getPublishTittle().then((listPublish) => {expect(listPublish).include('Produto001')});
    clickBtnClearFilter();
    cy.wait(100);
    typeSKUPublish('VAR002');
    clickBtnFilter();
    clickBtnClearFilter();
    clickBtnMoreFilters();
    typeFilterAtt('Cor');
    typeValueAttProduct('Branco');
    clickBtnFilter();
    cy.wait(1000);
    clickExpandLinePublish();
    viewAttribute();
    getPublishAtt().then((att) => {expect(att).include('Cor: Branco')});
    clickCloseDialog();
    clickBtnClearFilter();
    cy.wait(100);
    slctFilterPremium();
    clickBtnFilter();
    clickBtnClearFilter();
    slctFilterStatusPublish();
    clickBtnFilter();
    cy.wait(100);
    getPublishStatus().then((statusPublish) => {expect(statusPublish).include('Pendente')});
    clickBtnClearFilter();
    clickMenuItemSale();
    

  })
})