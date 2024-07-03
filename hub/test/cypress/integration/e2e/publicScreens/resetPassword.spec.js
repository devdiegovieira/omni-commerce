import { clickBtnForgotPassword, clickConfirmReset, clickSubmitCode, getMsgConfirmReset, getMsgConfirmSubmitCode, typeCodeConfirm, typeEmailResetPassword, typeNewPassword, typeRepeatNewPassword } from "../../../support/page-objects/resetPassword";

describe('Teste automatizado resetar senha', () => {

    it('Resetar senha', () => {
        cy.visit('/');
        clickBtnForgotPassword();
        typeEmailResetPassword('bruna.fernandes@arsenalcar.com.br');
        clickSubmitCode();
        getMsgConfirmSubmitCode().then((msgConfirm) => {
            expect(msgConfirm).equal('Código Enviado!')
          });
        typeNewPassword('Hobbit@2');
        typeRepeatNewPassword('Hobbit@2');
        typeCodeConfirm('6555');
        clickConfirmReset();
        getMsgConfirmReset().then((msgConfirm) => {
            expect(msgConfirm).equal('Senha Redefinida com sucesso!')
          });
    })
})