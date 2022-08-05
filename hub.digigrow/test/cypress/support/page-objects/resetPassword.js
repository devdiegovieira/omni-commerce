/// <reference types="Cypress" />

const btnLoginAndResetPage = '[class*="MuiButtonBase-root"]'
const inputResetPassword= '[class*="MuiInputBase-root"]'
const msgConfirm= '[id*="notistack-snackbar"]'


export function clickBtnForgotPassword(){
  cy.get(btnLoginAndResetPage).contains('Esqueceu a senha?').click()
}

export function typeEmailResetPassword(emailReset){
  cy.get(inputResetPassword).find('[name*="mail"]').type(emailReset)
}

export function clickSubmitCode(){
  cy.get(btnLoginAndResetPage).contains('Enviar código').click()
}

export function getMsgConfirmSubmitCode(){
  return cy.get(msgConfirm).invoke('text')
}

export function typeNewPassword(newPassword){ 
  cy.get(inputResetPassword).siblings().contains('Nova Senha').siblings().find('[name*="password"]').type(newPassword)
}

export function typeRepeatNewPassword(newPassword){
  cy.get(inputResetPassword).find('[name*="passwordConfirm"]').type(newPassword)
}

export function typeCodeConfirm(codeConfirm){
  cy.get(inputResetPassword).find('[name*="code"]').type(codeConfirm)
}

export function clickConfirmReset(){
  cy.get(btnLoginAndResetPage).contains('Confirmar').click()
}

export function getMsgConfirmReset(){
  return cy.get(msgConfirm).invoke('text')
}