/// <reference types="Cypress" />

const avatar = '.MuiAvatar-root'
const menuItens= '.MuiListItemText-root'
const openSideBar= 'path[d*="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"]'


export function getUserName(){
   return cy.get(avatar).siblings().invoke('text')
}

export function clickMenuItemRegister(){
cy.get(menuItens).contains('Cadastros').click()
}

export function clickMenuItemSeller(){
   cy.get(menuItens).contains('Empresas').click()
   }

export function clickMenuItemProducts(){
   cy.get(menuItens).contains('Produtos').click()
}

export function clickMenuItemPublish(){
   cy.get(menuItens).contains('Anúncios').click()
}

export function clickMenuItemSale(){
   cy.get(menuItens).contains('Vendas').click()
   }

   export function clickMenuItemMoney(){
      cy.get(menuItens).contains('Financeiro').click()
   }

   export function clickMenuItemSettings(){
      cy.get(menuItens).contains('Configurações').click()
   }

   export function clickMenuItemLogout(){
      cy.get(menuItens).contains('Sair').click()
   }

   export function clickOpenSideBar(){
      cy.get(openSideBar).click()
   }