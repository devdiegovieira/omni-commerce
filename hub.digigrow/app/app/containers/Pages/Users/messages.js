/*
 * User Messages
 *
 * This contains all the text for the User page.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.Users';

export default defineMessages({
  toAccount: {
    id: `${scope}.Register.create`,
    defaultMessage: 'Já tem uma conta?',
  },
  googleAuth: {
    id: `${scope}.Register.googleAuth`,
    defaultMessage: 'Google',
  },
  terms: {
    id: `${scope}.Register.terms`,
    defaultMessage: 'Li e concordo com os Termos e condições',
  },
  remember: {
    id: `${scope}.Register.remember`,
    defaultMessage: 'Lembrar',
  },
  sendResetCode: {
    id: `${scope}.Register.remember`,
    defaultMessage: 'Enviar código de confirmação de email',
  },
  resetPassword: {
    id: `${scope}.Register.remember`,
    defaultMessage: 'Resetar Senha',
  },
  login: {
    id: `${scope}.login.home`,
    defaultMessage: 'Entrar',
  },
  voltar: {
    id: `${scope}.login.home`,
    defaultMessage: 'Voltar',
  },
  loginOr: {
    id: `${scope}.Login.or`,
    defaultMessage: 'Or sign in with',
  },
  loginButtonContinue: {
    id: `${scope}.Login.button.continue`,
    defaultMessage: 'Continue',
  },
  sendEmail: {
    id: `${scope}.Reset.button.email`,
    defaultMessage: 'email',
  },
  aggree: {
    id: `${scope}.Register.agree`,
    defaultMessage: 'Agree with',
  },
  aggree: {
    id: `${scope}.Register.agree`,
    defaultMessage: 'Agree with',
  },
  newAcount: {
    id: `${scope}.Register.newAcount`,
    defaultMessage: "Crie uma conta",
  },
  register: {
    id: `${scope}.Register.signup`,
    defaultMessage: 'Registrar',
  },
  welcomeTitle: {
    id: `${scope}.Welcome.title`,
    defaultMessage: 'Bem Vindo',
  },
  sync: {
    id: `${scope}.Welcome.sync`,
    defaultMessage: 'Enviar Código',
  },
  welcomeSubtitle: {
    id: `${scope}.Welcome.subtitle`,
    defaultMessage: 'Please sign in to continue',
  },
  greetingTitle: {
    id: `${scope}.Greeting.title`,
    defaultMessage: 'Hi...nice to meet you',
  },
  greetingSubtitle: {
    id: `${scope}.Greeting.subtitle`,
    defaultMessage: 'Just register to join with us',
  },
  createNewAccount: {
    id: `${scope}.Login.create`,
    defaultMessage: 'Create new account',
  },

  loginOr: {
    id: `${scope}.Login.or`,
    defaultMessage: 'Or sign in with',
  },
  registerOr: {
    id: `${scope}.Register.or`,
    defaultMessage: 'Or register with',
  },
  loginFieldName: {
    id: `${scope}.Register.field.name`,
    defaultMessage: 'Username',
  },
  loginFieldEmail: {
    id: `${scope}.Login.field.email`,
    defaultMessage: 'Your Email',
  },
  loginFieldDocument: {
    id: `${scope}.Register.field.document`,
    defaultMessage: 'Document',
  },
  loginFieldPhone: {
    id: `${scope}.Register.field.phone`,
    defaultMessage: 'Phone Number',
  },
  loginFieldPassword: {
    id: `${scope}.Login.field.password`,
    defaultMessage: 'Your Password',
  },
  loginFieldRetypePassword: {
    id: `${scope}.Register.field.retypePassword`,
    defaultMessage: 'Re-type Password',
  },
  loginForgotPassword: {
    id: `${scope}.Login.field.forgot`,
    defaultMessage: 'Forgot Password',
  },
  loginRemember: {
    id: `${scope}.Login.field.remember`,
    defaultMessage: 'Remember',
  },
  tabEmail: {
    id: `${scope}.Register.tab.email`,
    defaultMessage: 'With Email',
  },
  password: {
    id: `${scope}.Register.tab.email`,
    defaultMessage: 'Esqueceu a senha?',
  },
  tabSocial: {
    id: `${scope}.Register.tab.social`,
    defaultMessage: 'With Social Media',
  },
  aggree: {
    id: `${scope}.Register.agree`,
    defaultMessage: 'Agree with',
  },
  resetTitle: {
    id: `${scope}.Reset.title`,
    defaultMessage: 'Reset Password',
  },
  resetSubtitle: {
    id: `${scope}.Reset.subtitle`,
    defaultMessage: 'Send reset password link to Your email',
  },
  resetButton: {
    id: `${scope}.Reset.button`,
    defaultMessage: 'Send Reset Link',
  },
  lockHint: {
    id: `${scope}.Lock.hint`,
    defaultMessage: 'Hint: Type anything to unlock!',
  },
  requiredForm: {
    id: `${scope}.Required.text`,
    defaultMessage: 'Required',
  },
});
