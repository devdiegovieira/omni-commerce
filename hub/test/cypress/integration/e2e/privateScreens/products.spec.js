import { clickMenuItemProducts, clickMenuItemRegister, clickOpenSideBar, getUserName } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, getErroMessageEmail, getErroMessagePassword, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickNewProducts, typeEANCode, typeTittleProducts, slctSellerProducts, typeDescription, slctCategory, typeBarCode, typeSKU, typePriceProduct, typeStockProduct, clickAddVariation, getUploadFileProducts, typeCEST, typeNCM, typeHeight, typeWidth, typeDepth, typeWeigth, typeHeigth, clickSaveProduct} from "../../../support/page-objects/products";
import { clickBackPage, getUploadFile } from "../../../support/page-objects/seller";

describe('Teste automatizado cadastro de produto', () => {


  it('Cadastro Produto', () => {
    cy.visit('/');
    typeEmailLoginPage('bruna.fernandes@.com.br');
    typePasswordLoginPage('Hobbit@2');
    clickContinueLoginPage();
    clickOpenSideBar();
    clickMenuItemRegister();
    clickMenuItemProducts();
    cy.wait(1000);
    clickNewProducts();
    // typeSku('PROD001');
    // typeTittle('Produto001');
    // cy.wait(100);
    // clickOpenSelectSeller();
    // clickSelectSeller();
    // typePrice('9999999999');
    // typeStock('99999999');
    // typeCategory('Mecânica');
    // clickAddAttribute();
    // typeAttribute('Cor');
    // typeAttValue('Amarelo');
    // clickConfirmAtt();
    // clickAddVariation();
    // typeSkuVar('VAR001');
    // getUploadFileProducts();
    // typeStockVar('99999');
    // typePriceVar('99999999');
    // clickAddAttribute();
    // typeAttribute('Cor');
    // typeAttValue('Amarelo');
    // clickConfirmAtt();
    // clickTaxData();
    // typeCest('11111111111111');
    // typeNcm("111111111111111");
    // clickDimensions();
    // typeHeight('20');
    // typeWidth('20');
    // typeLength('20');
    // typeWeight('20');
    // clickActivateProduct();
    // clickSaveProduct();
    // getMsgConfirmSave().then((confirmMsgProducts) => {
    //   expect(confirmMsgProducts).equal('Registro salvo com sucesso!')
    // });
    // cy.url({timeout: 3000}).should('not.contain', '/product/new');
    // clickBackProductsPage();
    // clickNewProducts();
    // typeSku('PROD002');
    // typeTittle('Produto002');
    // cy.wait(100);
    // clickOpenSelectSeller();
    // clickSelectSeller2();
    // typePrice('9999999999');
    // typeStock('99999999');
    // typeCategory('Mecânica');
    // clickAddAttribute();
    // typeAttribute('Cor');
    // typeAttValue('Branco');
    // clickConfirmAtt();
    // clickAddVariation();
    // typeSkuVar('VAR002');
    // getUploadFileProducts();
    // typeStockVar('99999');
    // typePriceVar('99999999');
    // clickAddAttribute();
    // typeAttribute('Cor');
    // typeAttValue('Branco');
    // clickConfirmAtt();
    // clickTaxData();
    // typeCest('11111111111111');
    // typeNcm("111111111111111");
    // clickDimensions();
    // typeHeight('20');
    // typeWidth('20');
    // typeLength('20');
    // typeWeight('20');
    // clickActivateProduct();
    // clickSaveProduct();
    // getMsgConfirmSave().then((confirmMsgProducts) => {
    //   expect(confirmMsgProducts).equal('Registro salvo com sucesso!')
    // });
    // cy.url({timeout: 3000}).should('not.contain', '/product/new');
    // clickBackProductsPage();
    // clickCheckBoxProd01();
    // btnButtonGroup();
    // clickGenerateAd();
    // clickGenerateAd();
    // clickMenuItemRegister();
    // clickMenuItemProducts();
    // cy.wait(1000);
    // clickCheckBoxProd02();
    // btnButtonGroup();
    // clickGenerateAd();
    // clickGenerateAd();



    typeEANCode(111111111111);
    typeTittleProducts('Teste titulo anuncio/produto');
    slctSellerProducts();
    typeDescription('Teste teste teste teste teste teste');
    slctCategory();
    typeBarCode('222222222222');
    typeSKU('PROD0001');
    typePriceProduct('500000');
    typeStockProduct('100');
    //NÃO CONSIGO PREENCHER AS VARIAÇÕES COM id
    clickAddVariation();
    getUploadFileProducts();
    typeCEST('1111111111111');
    typeNCM('1111111111111');
    typeHeigth('50');
    typeWidth('50');
    typeDepth('50');
    typeWeigth('30000');
    clickSaveProduct();


  })
})