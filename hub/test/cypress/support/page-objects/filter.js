/// <reference types="Cypress" />

const inputFilters= '[class*="MuiInputBase-root"]'
const btnFilters= '[class*="MuiButtonBase-root"]'
const lineList= '[class*="MuiTableBody-root"]' 
const slctFilter= '[class*="MuiSelect-root"]'
const dialogProduct = '[class*="MuiDialogContent-root"]'
const btnIcon ='[class*="MuiIconButton-label"]'



export function slctFilterStatusPublish(){
  cy.get(slctFilter).parent().siblings().contains('Status').parent().click()
  && cy.get(btnFilters).children().contains('Pendente').click()
  && cy.get('body').click()
}

export function slctFilterPremium(){
  cy.get(slctFilter).parent().siblings().contains('Destaque').parent().click()
  && cy.get(btnFilters).children().contains('Premium').click()
  && cy.get('body').click()
}

export function clickCloseDialog(){
  cy.get('[class*="MuiTypography-root"]').contains('Atributos').siblings().click()
}

export function clickExpandLineProd(){
  cy.get(lineList).contains('Produto002').parent().parent().parent().find('[id*="expandable-button"]').click()
}

export function clickExpandLinePublish(){
  cy.get(lineList).contains('Produto002').parent().parent().parent().parent().find('[id*="expandable-button"]').click()
}

export function viewAttribute(){
  cy.get(btnFilters).contains('Atributos').click()
}

export function clickBtnMoreFilters(){
  cy.get(btnFilters).contains('Mais filtros').click()
}

export function typeFantasyName(fantasyName){
  cy.get(inputFilters).siblings().contains('Nome Fantasia').siblings().type(fantasyName)
}

export function clickBtnFilter(){
  cy.get(btnFilters).contains('Filtrar').click()
}
export function clickBtnClearFilter(){
  cy.get(btnFilters).contains('Limpar Filtros').click()
}

export function getNameList(){
  return cy.get(lineList).children().children().contains('Nome fantasia').parent().invoke('text')
}

export function typeSellerDocument(sellerDocument){
  cy.get(inputFilters).siblings().contains('CNPJ').siblings().type(sellerDocument)
}

export function getSellerDocument(){
  return cy.get(lineList).children().children().contains('CNPJ').parent().invoke('text')
}

export function getSellerStatus(){
  return cy.get(lineList).invoke('text')
}

export function slctFilterStatusSeller(){
  cy.get(slctFilter).parent().siblings().contains('Status').parent().click()
  && cy.get(btnFilters).contains('Em análise').click()
}

export function typeSkuProducts(skuProduct){
  cy.get(inputFilters).siblings().contains('Código Produto ou Variação').parent().clear().type(skuProduct)
}

export function typeTittleProducts(tittleProduct){
  cy.get(inputFilters).siblings().contains('Título').parent().type(tittleProduct)
}

export function slctFilterSeller(){
  cy.get(slctFilter).parent().siblings().contains('Empresa').parent().click()
  && cy.get(btnFilters).children().contains('Empresa2').click()
  && cy.get('body').click()
}

export function slctFilterStatusProducts(){
  cy.get(slctFilter).parent().siblings().contains('Status').parent().click()
  && cy.get(btnFilters).contains('Inativo').click()
}

export function getProdList(){
  return cy.get(lineList).children().children().children().contains('Código').parent().invoke('text')
}

export function getProdListTittle(){
  return cy.get(lineList).children().children().contains('Produto').parent().invoke('text')
}

export function getProdListSeller(){
  return cy.get(lineList).children().children().contains('Empresa').parent().invoke('text')
}

export function getPublishStatus(){
  return cy.get(lineList).children().children().contains('Status').parent().invoke('text')
}

export function getProdStatus(){
  return cy.get(lineList).invoke('text')
}

export function typeFilterAtt(attProduct){
  cy.get(inputFilters).siblings().contains('Atributo').parent().type(attProduct)
}

export function typeValueAttProduct(valueAtt){
  cy.get(inputFilters).siblings().contains('Valor Atributo').parent().type(valueAtt)
}

export function getPublishAtt(){
  return cy.get(dialogProduct).find('[class*="MuiChip-root"]').invoke('text')
}

export function getProdAtt(){
  return cy.get(btnFilters).siblings().find('[class*="MuiChip-label"]').invoke('text')
}

export function typeTitlePublish(titlePublish){
  cy.get(inputFilters).parent().contains('Título').siblings().clear().type(titlePublish)
}

export function getPublishTittle(){
  return cy.get(lineList).children().children().contains('Produto').parent().invoke('text')
}

export function typeSKUPublish(skuPublish){
  cy.get(inputFilters).parent().contains('SKU').siblings().type(skuPublish)
}