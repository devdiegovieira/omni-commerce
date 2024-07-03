/// <reference types="Cypress" />

const inputEmail= '[name="mail"]'
const inputPassword= '[name="password"]'
const btnContinue= 'button[class*="MuiButton-root"]'
const btnResetPassword='MuiButtonBase-root'
const errorMessageEmail= '.MuiFormHelperText-root'
const errorMessagePassword= '[id="notistack-snackbar"]'
const btnSignUp= '.MuiButtonBase-root'

export function typeEmailLoginPage(email){
cy.get(inputEmail).clear()
cy.get(inputEmail).type(email)
}

export function typePasswordLoginPage(password){
  cy.get(inputPassword).clear()
  cy.get(inputPassword).type(password)
}

export function clickBtnResetPassword(){
  cy.get(btnResetPassword).contains('Esqueceu a senha?').click()
}

export function clickContinueLoginPage(){
  cy.get(btnContinue).contains('Continue').parents('button').click()
}

export function clickLoginGoogle(){
  cy.get(btnContinue).contains('Entrar com o Google').parents('button').click()
}

export function getErroMessageEmail(){
  return cy.get(errorMessageEmail).invoke('text')
}

export function getErroMessagePassword(){
  return cy.get(errorMessagePassword).invoke('text')
}

export function clickBtnSignUp(){
  return cy.get(btnSignUp).contains('Crie uma conta').click()
}