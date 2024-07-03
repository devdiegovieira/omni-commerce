/// <reference types="Cypress" />

const btnSettingsPage = '[class*="MuiButtonBase-root"]'
const inputNameSettingsPage = '[name="name"]'
const msgSettingsPage= '[id*="notistack-snackbar"]'
const fixtureFile= 'filecat.png'
const inputPassword= '[name*="passwordOld"]'
const inputNewPassword= '[name="password"]'
const inputPasswordConfirm= '[name="passwordConfirm"]'
const inputMailSettings= '[name="mail"]'

export function clickBtnConfirm(){
  cy.get(btnSettingsPage).contains('Confirmar').click()
}

export function clickBtnRedefineMail(){
  cy.get(btnSettingsPage).children().contains('Enviar código').parent().click()
}

export function typeMailSettings(mailSettings){
  cy.get(inputMailSettings).type(mailSettings)
}


export function clickBtnRedefinePassword(){
  cy.get(btnSettingsPage).children().contains('Redefinir Senha').parent().click()
}

export function typePasswordConfirm(passwordConfirm){
  cy.get(inputPasswordConfirm).type(passwordConfirm)
}

export function typeNewPassword(newPassword){
  cy.get(inputNewPassword).type(newPassword)
}

export function typePassword(password){
  cy.get(inputPassword).type(password)
}

export function clickTabLogin(){
  cy.get(btnSettingsPage).children().contains('Login').parent().click()
}

export function clickTabProfile(){
  cy.get(btnSettingsPage).children().contains('Perfil').parent().click()
}

export function typeUserName(userName){
  cy.get(inputNameSettingsPage).clear().type(userName)
}

export function clickSaveProfile(){
  cy.get(btnSettingsPage).children().contains('Salvar').parent().click()
}

export function getConfirmMessageSettings(){
  return cy.get(msgSettingsPage).invoke('text')
}

export function uploadImageProfile(){
  cy.get('[id*="icon-button-file"]').attachFile(fixtureFile)
}