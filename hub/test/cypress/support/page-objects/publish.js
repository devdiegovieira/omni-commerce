/// <reference types="Cypress" />

const btnPublishPage = '[class*="MuiButtonBase-root"]'
const inputSelectPublish = '[class*="MuiFormLabel-root"]'
const inputDescribePublishPage = '[class*="MuiFormControl-root"]'
const inputBrandPublish = '[name="BRAND"]'
const msgConfirmSavePublish = '[id="notistack-snackbar"]'



export function selectCategory(){
    cy.get(btnPublishPage).contains('Categoria*').click() 
    && cy.get(btnPublishPage).contains('Acessórios para Veículos').click()
    && cy.wait(1000)
    && cy.get(btnPublishPage).contains('Aces. de Carros e Caminhonetes').click()
    && cy.wait(1000)
    && cy.get(btnPublishPage).contains('Exterior').click()
    && cy.wait(1000)
    && cy.get(btnPublishPage).contains('Acabamentos para Racks').click()
    && cy.get(btnPublishPage).contains('Categoria*').click() 
}

export function typePublishDescribe(publishDescribe){
    cy.get(inputDescribePublishPage).parent().children().contains('Descrição*').siblings().type(publishDescribe)
}

export function clickDetailPublish(){
    cy.get(btnPublishPage).contains('Detalhes').click()
}

export function selectPublish(){
    cy.get(inputSelectPublish).contains('Tipo de Anúncio').parent().click()
}

export function slctPublish(){
    cy.get(btnPublishPage).contains('Premium').click()
}

export function selectShipping(){
    cy.get(inputSelectPublish).contains('Modo de Envio*').parent().click()
}

export function slctShippingME1(){
    cy.get(btnPublishPage).contains('Mercado Envios 1').click()
}

export function selectAccount(){
    cy.get(inputSelectPublish).contains('Conta').parent().click()
}

export function slctAccount(){
    cy.get(btnPublishPage).contains('Grow Store').click()
}

export function selectWarranty(){
    cy.get(inputSelectPublish).contains('Garantia*').parent().click()
    && cy.get(btnPublishPage).contains('Sem garantia').click()
}

export function typeWarrantyTime(warrantyTime){
    cy.get(inputSelectPublish).contains('Tempo da Garantia*').siblings().clear().type(warrantyTime)
}

export function selectWarrantyTime(){
    cy.get(inputSelectPublish).contains('Tipo de Garantia*').parent().click()
    && cy.get(btnPublishPage).contains('dias').click()
}

export function typeBrand(brand){
    cy.get(inputBrandPublish).type(brand)
}

export function clickBtnSavePublish(){
    cy.get(btnPublishPage).contains('Salvar').click()
}

export function getMsgConfirmSavePublish(){
    return cy.get(msgConfirmSavePublish).invoke('text')
}

export function clickBtnBackPublish(){
    cy.get(btnPublishPage).contains('Anúncios').click()
}