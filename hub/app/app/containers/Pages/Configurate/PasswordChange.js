import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../components/Forms/user-jss';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import { Box, Button, Divider, Grid, Icon, IconButton, InputAdornment, Paper, Typography } from '@material-ui/core';
import Controls from '../../../components/Forms/controls';
import { changeCustom, toLowerCase } from '../../../utils/dynamicMasks';
import { passwordsMatch, validateEmail } from '../../../utils/formValidation';
import { Form, useForm } from '../../../components/Forms/useForm';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { promisseApi } from '../../../api/api';
import { checkPasswordStrength, criptPassword } from '../../../utils/auth';
import { useSnackbar } from 'notistack';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

function PasswordChange(props) {
  const [passData] = useState({});
  const [mailData] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();




  const submit = () => {
    setLoading(true);

    promisseApi(
      'post',
      `/user/changePassword/${localStorage.getItem('userId')}`,
      (data) => {
        setLoading(false);
        enqueueSnackbar('Senha Redefinida com sucesso!', { variant: 'success' });
        resetForm();
      },
      (err) => {
        setLoading(false);
        enqueueSnackbar(err, { variant: 'error' })
      },
      {
        passwordOld: criptPassword(valuesPass.passwordOld),
        password: criptPassword(valuesPass.password),
      }

    );
  };

  const submitMail = () => {
    setLoading(true);

    promisseApi(
      'post',
      `/user/resetMail/${localStorage.getItem('userId')}`,
      (data) => {

        setLoading(false);
        enqueueSnackbar('E-mail Redefinido com sucesso!', { variant: 'success' });
        window.location.href = '/logout';
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        mail: localStorage.getItem('userMail'),
        newMail: valuesMail.mail,
        code: valuesMail.code
      }

    );
  };

  const sendMail = () => {
    setLoading(true);

    promisseApi(
      'post',
      '/user/resetMail',
      (data) => {
        setLoading(false);
        setShowReset(true);

        enqueueSnackbar('Código Enviado!', { variant: 'success' });
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        mail: localStorage.getItem('userMail'),
        newMail: valuesMail.mail
      }
    );
  }

  const {
    values: valuesMail,
    errors: errorsMail,
    handleInputChange: handleInputChangeMail,
    handleSubmit: handleSubmitMail
  } = useForm(mailData, true, submitMail, [
    {
      field: 'mail',
      message: 'Email inválido',
      rule: (fieldValue) => {
        return !validateEmail(fieldValue.mail);
      }
    }
  ]);

  const {
    values: valuesPass,
    errors: errorsPass,
    handleInputChange: handleInputChangePass,
    handleSubmit: handleSubmitPass,
    resetForm
  } = useForm(passData, true, submit, [
    {
      field: 'passwordOld',
      message: 'Necessário informar a senha atual',
    },
    {
      field: 'password',
      message: 'Necessário conter letras, números e no mínimo seis caracteres',
      rule: (fieldValue) => {
        return !checkPasswordStrength(fieldValue.password);
      }
    },
    {
      field: 'passwordConfirm',
      message: 'Senhas diferentes',
      rule: (fieldValue) => {
        return !passwordsMatch(fieldValue.passwordConfirm, fieldValue.password);
      }
    }
  ]);

  const [user, setUser] = useState({
  });

  useEffect(() => {

    promisseApi(
      'get',
      `/user/:user`,
      (data) => setUser(data),
      (err) => enqueueSnackbar(err, { variant: 'error' })


    )
  }, []);



  return (
    <>


      <Grid container justifyContent='center' spacing={2}>
        <Grid item xs={12}>
          <Grid container style={{ padding: 15 }}>

            <Grid item lg={6} md={6} xs={12}>
              <Form onSubmit={handleSubmitPass}>
                <Grid container justifyContent='flex-end' component={Box} style={{ transform: 'translate(-50%)', marginLeft: '50%', marginBottom: '1%' }} spacing={1} xs={12} >
                  <Grid item lg={12} style={{ paddingLeft: 15, paddingBottom: 10, paddingTop: 10 }} ><Typography style={{ fontSize: 12 }} > <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    <LockOpenIcon color='primary' style={{ fontSize: 17 }} />
                    <span  >Redefinir senha</span>
                  </div>   </Typography> </Grid>


                  <Grid item xs={12} style={{ paddingLeft: 15, paddingRight: 15 }} ><Divider /></Grid>

                  <Grid item xs={12}>
                    <Controls.Input
                      name="passwordOld"
                      label="Senha Atual*"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleInputChangePass}
                      value={valuesPass.passwordOld}
                      error={errorsPass.passwordOld}
                      inputProps={{ maxLength: 20 }}
                      InputProps={{
                        maxLength: 20,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controls.Input
                      name="password"
                      label="Nova Senha*"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleInputChangePass}
                      value={valuesPass.password}
                      error={errorsPass.password}
                      inputProps={{ maxLength: 20 }}
                      InputProps={{
                        maxLength: 20,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controls.Input
                      name="passwordConfirm"
                      label="Confirmar Senha*"
                      type={showPassword ? 'text' : 'password'}
                      onChange={handleInputChangePass}
                      value={valuesPass.passwordConfirm}
                      error={errorsPass.passwordConfirm}
                      inputProps={{ maxLength: 20 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={8}>

                  </Grid>
                  <Grid item xs={12} style={{ padding: 0 }} >
                    <ButtonDefault
                      disabled={loading}
                      type='submit'
                      icon={'lock_reset'}
                      onChange={handleInputChangePass}
                      label={'Redefinir Senha'} />
                  </Grid>

                </Grid>
              </Form>

            </Grid>


            <Grid item lg={6} md={6} xs={12}>



              <Form onSubmit={handleSubmitMail}>
                <Grid container justifyContent='flex-end' style={{ marginBottom: "1%" , paddingLeft:10}} spacing={1} >


                  <Grid item xs={12} style={{ paddingLeft: 15, paddingBottom: 10, paddingTop: 10 }} ><Typography style={{ fontSize: 12 }} > <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                    <MailOutlineIcon color='primary' style={{ fontSize: 17 }} />
                    <span  >Redefinir E-mail</span>
                  </div>   </Typography> </Grid>
                  <Grid item xs={12} style={{ paddingLeft: 15, paddingRight: 15 }} ><Divider /></Grid>

                  <Grid item xs={12}  >
                    <Controls.Input
                      name="mail"
                      label="E-mail"
                      value={valuesMail.mail}
                      onChange={handleInputChangeMail}
                      error={errorsMail.userToken}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>


                  {showReset && (
                    <>
                      <Grid item xs={12}>
                        <Controls.Input
                          name="code"
                          label="Código de Confirmação*"
                          onChange={(e) => changeCustom(e, toLowerCase, handleInputChangeMail)}
                          value={valuesMail.code}
                          error={errorsMail.code}
                          inputProps={{ maxLength: 10 }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button

                          type='submit'
                          name="buttom"
                          disabled={loading}
                          onChange={handleInputChangeMail}
                          value={valuesMail.buttom}
                          error={errorsMail.buttom}
                          startIcon={<Icon style={{ marginLeft: 5, fontSize: 14 }}>mail_outline</Icon>}
                          justifyContent='center'
                          style={{ textTransform: 'none', borderRadius:3, padding: 4, width:'100%', color: 'none'}}

                        >
                          Confirmar
                        </Button>

                      </Grid>
                    </>
                  )}
                </Grid>

                {!showReset && (
                  <Grid item xs={12} style={{paddingLeft: 10, paddingRight:5}} >
                    <ButtonDefault
                      disabled={loading}
                      onClick={() => sendMail()}
                      icon={'mail_outline'}
                      onChange={handleInputChangeMail}
                      label={'Enviar código'} />
                  </Grid>
                )}
              </Form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

PasswordChange.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PasswordChange);
