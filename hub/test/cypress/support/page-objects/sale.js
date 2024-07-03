/// <reference types="Cypress" />

const btnSalePage= '[class*="MuiButtonBase-root"]'
const inputSalePage= '[class*="MuiInputBase-root"]'
const btnCalendar= '[class*="MuiSvgIcon-root"]'

export function clickSelectStartPeriod(){
  cy.get(inputSalePage).find('[name*="dateClosedFrom"]').siblings().click()
}

export function clickCalendarHeaderLeft(){
  cy.get(btnCalendar).find('[d*="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"]').parent().parent().click()
}