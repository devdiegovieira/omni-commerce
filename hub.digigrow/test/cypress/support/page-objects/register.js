/// <reference types="Cypress" />

const inputEmailRegister= '[name="mail"]'
const btnRegisterPage= '[class*="MuiButtonBase-root"]'
const inputConfirmationCode= '[name="code"]'
const inputUserName='[name="name"]'
const inputUserDocument= '[name="document"]'
const inputUserPhone= '[name="phone"]'
const inputPasswordRegisterPage= '[name="password"]'
const inputConfirmationPasswordRegisterPage= '[name="passwordConfirm"]'
const btnContinueRegisterPage= '[class*="MuiButton-label"]'
const message= '[id*="notistack-snackbar"]'
const btnNewSeller= '.MuiButton-label'
// const checkLogin= '[class*="MuiButtonBase-root"]'


export function slctResearch(){
  cy.get(btnRegisterPage).contains('Busca da internet').click()
}


export function clickSlctResearch(){
  cy.get(btnRegisterPage).parent().contains('Como nos encontrou?').parent().click()
}

export function typeEmailRegisterPage(email){
    cy.get(inputEmailRegister).clear()
    cy.get(inputEmailRegister).type(email)
    }

export function clickBtnSendCode(){
    cy.get(btnRegisterPage).contains('Enviar Código', {timeout: 10000}).click();
}

export function getMessageSnackBar(){
    return cy.get(message).invoke('text')
  }

  export function typeConfirmationCode(code){
    cy.get(inputConfirmationCode).type(code)
  }

  export function typeUserName(name){
    cy.get(inputUserName).type(name)
  }

  export function typeUserDocument(document){
    cy.get(inputUserDocument).type(document)
  }

  export function typeUserPhone(phone){
    cy.get(inputUserPhone).type(phone)
  }

export function typePasswordRegisterPage(password){
  cy.get(inputPasswordRegisterPage).type(password)
}

export function typeConfirmationPasswordRegisterPage(confirmationPassword){
  cy.get(inputConfirmationPasswordRegisterPage).type(confirmationPassword)
}

export function clickBtnContinueRegisterPage(){
  cy.get(btnContinueRegisterPage).contains('Continue').click()
}

export function clickBtnNewSeller(){
  cy.get(btnNewSeller).contains('Cadastre sua empresa').click()
}

export function clickAddSeller(){
  cy.get(btnNewSeller).contains('Adicionar').click()
}

export function getCheckLogin(){
  cy.get(btnRegisterPage).invoke('text')
}