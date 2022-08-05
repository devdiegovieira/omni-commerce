import { clickMenuItemSale, clickOpenSideBar } from "../../../support/page-objects/left-Side-Bar";
import { clickContinueLoginPage, typeEmailLoginPage, typePasswordLoginPage } from "../../../support/page-objects/page-login";
import { clickCalendarHeaderLeft, clickSelectStartPeriod } from "../../../support/page-objects/sale";

describe('Teste automatizado tela de vendas', () => {


    it('Teste tela de vendas', () => {
      cy.visit('/');
      typeEmailLoginPage("bruna.fernandes@arsenalcar.com.br");
      typePasswordLoginPage("Hobbit@1");
      clickContinueLoginPage();
      cy.wait(1000);
      clickOpenSideBar();
      clickMenuItemSale();
      cy.wait(1000)
      clickSelectStartPeriod();
      clickCalendarHeaderLeft();
      
  })
})