/// <reference types="Cypress" />

const btnSellerPage= '[class*="MuiButtonBase-root"]'
const inputSellerName= '[name="code"]'
const inputSocialName= 'input[name*="name"]' 
const inputSellerDocument= '[name="document"]' 
const inputZipCode= 'input[name="cep"]'
const btnRegisterSeller= 'button[name="cep"]'
const inputSellerNumber= '[name="number"]' 
const inputPhone= '[name="phone"]' 
const inputUserName= '[name="userName"]' 
const inputUserDocument= '[name="rg"]'
const inputUserDocumentCPF= '[name="cpf"]'
const clickbtnTab='button[class*="MuiButtonBase-root"]'
const inputStateRegistration= '[name="ie"]'
const btnselectST= '[id*="mui-component-select-taxRegime"]'
const btnSelectStSeller= '[class*="MuiButtonBase-root"]'
const btnInventoryControl= '[class*="PrivateSwitchBase-input"]'
const btnSaveRegisterSeller= '[class*="MuiGrid-root "]'
const btnBackSellerPage= '[title*="Empresas"]'
const msgConfirmSeller= '[id*="notistack-snackbar"]'
const fixtureFile = 'logo.png'
const fixturePDF = 'testPdf.pdf'
const uploadFilePDF = '[style*="margin-bottom"]'

export function getUploadFile(){
  cy.get('[type*="file"]').attachFile(fixtureFile)
  && cy.get('[accept*=".pdf"]').children().children().attachFile(fixturePDF)
}

export function getMsgConcluedRegister(){
  return cy.get(msgConfirmSeller).invoke('text')
}

export function clickCompleteReegistration(){
  cy.get(btnSellerPage).contains('Concluir').click()
  }

  export function clickAddNewSeller(){
      cy.get(btnSellerPage).contains('Adicionar').click()
  }

  export function typeSellerName(sellerName){
    cy.get(inputSellerName).type(sellerName)
  }

  export function typeSocialName(socialName){
    cy.get(inputSocialName).type(socialName)
  }

  export function typeSellerDocument(sellerDocument){
    cy.get(inputSellerDocument).type(sellerDocument)
  }

  export function typeZipCode(zipCode){
    cy.get(inputZipCode).type(zipCode)
  }

  export function clickSearchZipCode(){
    cy.get(btnRegisterSeller).click()
}

  export function typeNumber(number){
    cy.get(inputSellerNumber).type(number)
  }

  export function typePhone(phone){
    cy.get(inputPhone).type(phone)
  }

  export function typeUserNameSeller(userName){
    cy.get(inputUserName).type(userName)
  }

  export function typeUserDocumentSeller(userDocument){
    cy.get(inputUserDocument).type(userDocument)
  }

  export function typeUserDocumentSellerCPF(userDocumentCPF){
    cy.get(inputUserDocumentCPF).type(userDocumentCPF)
  }

  export function clickTaxTab(){
    cy.get(clickbtnTab).contains('Tributário').click()
  }

  export function clickGeralTap(){
    cy.get(clickbtnTab).contains('Geral').click()
  }

  export function typeStateRegistration(stateRegistration){
    cy.get(inputStateRegistration).type(stateRegistration)
  }

  export function clickSelectST(){
    cy.get(btnselectST).click()
  }

  export function clickSelectTRegime(){
    cy.get(btnSelectStSeller).contains('Simples Nacional').click()
  }

  export function clickInventoryControl(){
    cy.get(btnInventoryControl).click()
  }

  export function clickSaveSeller(){
    cy.get(btnSaveRegisterSeller).contains('Salvar').click()
  }

  export function clickBackSellerPage(){
    cy.get(btnBackSellerPage).contains('Empresas').click()
  }

  export function clickFilter(){
    cy.get(btnSellerPage).contains('Filtrar').click()
  }

