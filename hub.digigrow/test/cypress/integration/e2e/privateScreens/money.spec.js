describe('Teste automatizado tela financeiro', () => {


  it('Tela financeiro', () => {
    cy.visit('/');
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("bruna.fernandes@arsenalcar.com.br");
    cy.get(':nth-child(3) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("Hobbit@1");
    cy.get(':nth-child(3) > .MuiButtonBase-root').click();
    cy.get('[href="/money"] > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get("body").type('{rightarrow}').click();
    cy.get('#mui-component-select-monthSelected').click();
    cy.get('.MuiList-root > .MuiButtonBase-root').click();
    cy.get('#mui-component-select-sellerId').click();
    cy.get('.MuiList-root > [tabindex="-1"]').click();
    cy.get("body").type('{rightarrow}').click();
    cy.get('#vertical-tab-1 > .MuiTab-wrapper').click();
    cy.get(':nth-child(1) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    cy.get('.MuiPickersCalendarHeader-switchHeader > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root').click().click().click().click();
    cy.get('.MuiPickersCalendar-transitionContainer > :nth-child(1) > :nth-child(1) > :nth-child(7)').click();
    cy.get('.MuiDialogActions-root > :nth-child(2) > .MuiButton-label').click();
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root > .MuiIconButton-label > .MuiSvgIcon-root').click();
    cy.get('.MuiPickersCalendar-transitionContainer > :nth-child(1) > :nth-child(1) > :nth-child(7)').click();
    cy.get('.MuiDialogActions-root > :nth-child(2)').click();
    cy.get("body").type('{pageup}');
    cy.get('#mui-component-select-paymentStatus').click();
    cy.get('[data-value="concluded"] > .MuiListItemText-root > .MuiTypography-root').parent().parent().click({ force: true });
    cy.get("body").type('{rightarrow}').click();
    cy.get(':nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type("00000000000");
    cy.get('#mui-component-select-sellerId').click();
    cy.get('.MuiListItemText-root > .MuiTypography-root').parent().parent().click({ force: true });
    cy.get("body").type('{rightarrow}').click();
    cy.get('.MuiIconButton-label > .material-icons').click();
    cy.get('.MuiGrid-spacing-xs-2.MuiGrid-justify-content-xs-flex-end > .MuiButtonBase-root > .MuiButton-label').click();
    cy.get('.MuiDialogContent-root > .MuiFormControl-root > .MuiInputBase-root > #mui-component-select-sellerId').click();
    cy.get('.MuiList-root > [tabindex="-1"]').click();
    cy.get('[type="submit"] > .MuiButton-label').click();

  })
})