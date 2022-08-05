/// <reference types="Cypress" />

const btnPattern= '[class*="MuiButtonBase-root"]'
const fileLogo= 'logo.png'
const msgConfirm= '[id*="notistack-snackbar"]'

export function openDetail(){
  cy.get(btnPattern).contains('Detalhes').click()
}

export function getUploadLogoSeller(){
  cy.get('[type*="file"]').attachFile(fileLogo)
}

export function clickDeleteImage(){
  cy.get(btnPattern).children().children().contains('delete').parent().click()
}

export function clickConfirmDeleteImage(){
  cy.get(btnPattern).contains('Sim').click()
}

export function getMsgConfirmAlteration(){
  return cy.get(msgConfirm).invoke('text')
}