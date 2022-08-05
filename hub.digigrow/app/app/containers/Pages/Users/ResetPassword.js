import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import brand from 'digi-api/dummy/brand';
import PropTypes from 'prop-types';
import logoWhite from 'digi-images/logo.svg';
import { withStyles } from '@material-ui/core/styles';
import styles from '../../../components/Forms/user-jss';
import { Button, Container, Grid, Icon, IconButton, InputAdornment, Paper, Typography } from '@material-ui/core';
import Controls from '../../../components/Forms/controls';
import { changeCustom, toLowerCase } from '../../../utils/dynamicMasks';
import { passwordsMatch, validateEmail } from '../../../utils/formValidation';
import { Form, useForm } from '../../../components/Forms/useForm';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { NavLink } from 'react-router-dom';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import { promisseApi } from '../../../api/api';
import { SHA256 } from 'crypto-js';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { checkPasswordStrength } from '../../../utils/auth';
import ArrowBack from '@material-ui/icons/ArrowBack';
import backImage from 'digi-images/login-img.png';
import ButtonDefault from '../../../components/Button/ButtonDefault';

function ResetPassword(props) {
  const { classes } = props;
  const [value, setValue] = useState({});
  const [counter, setCounter] = useState(0);
  const [showReset, setShowReset] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
    return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
  });

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter])


  const submit = () => {
    setLoading(true);
    promisseApi(
      'post',
      '/user/resetPassword',
      (data) => {

        setLoading(false);
        enqueueSnackbar('Senha Redefinida com sucesso!', { variant: 'success' });

        window.location.href = '/';
      },
      (err) => {
        enqueueSnackbar(err, { variant: 'error' });
        setLoading(false)
      },
      {
        reset: true,
        mail: values.mail,
        password: (SHA256(values.password)).toString(),
        name: values.name,
        code: values.code
      }

    );
  };

  const sendMail = (e) => {
    e.preventDefault(e);
    setLoading(true);

    promisseApi(
      'post',
      '/user/confirmMail',
      (data) => {
        setLoading(false);
        setShowConfirmation(false);
        setShowReset(true);
        setCounter(300)


        enqueueSnackbar('Código Enviado!', { variant: 'success' });
      },
      (err) => {
        enqueueSnackbar(err, { variant: 'error' })
        setLoading(false);
        setShowConfirmation(true);
        setShowReset(false);
        resetForm();
      },
      {
        ...values
      }
    );
  }



  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(value, true, submit, [
    {
      field: 'mail',
      message: 'Email inválido',
      rule: (fieldValue) => {
        return !validateEmail(fieldValue.mail);
      }
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
    },
  ]);

  return (
    <Grid container >
      <img src={backImage} style={{ position: 'absolute', zIndex: -1, height: '100%', width: '100%' }} />

      <Grid item xs={12} style={{ paddingTop: 40, paddingBottom: 20 }}>
        <Grid container justifyContent='center'>

          <p to="/">
            <img src={logoWhite} alt={brand.name} style={{ height: 60 }} />
          </p>
        </Grid>
      </Grid>


      <Grid item xs={12} className={classes.formWrap}>

        <Paper elevation={3} style={{ padding: 20, margin: 20 }} >

          <Button
            color="primary"
            to={"/"}
            component={LinkBtn}
          // variant="contained"
          >
            <ArrowBack style={{ marginRight: 10 }} /> Voltar
          </Button>


          <Typography variant="h4" className={classNames(classes.title)} gutterBottom align="center">
            <FormattedMessage {...messages.resetPassword} />
          </Typography>

          <Typography variant="caption" component="p" className={classes.subtitle} gutterBottom align="center">
            <FormattedMessage {...messages.sendResetCode} />
          </Typography>


          {showConfirmation && (
            <Form onSubmit={sendMail}>
              <Grid container spacing={1} >
                <Grid item xs={12}>
                  <Controls.Input
                    autoFocus
                    name="mail"
                    label="E-mail*"
                    onChange={(e) => changeCustom(e, toLowerCase, handleInputChange)}
                    value={values.mail}
                    error={errors.mail}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ButtonDefault
                    fullWidth
                    disabled={loading}
                    onChange={handleInputChange}
                    label={'Enviar código'}
                    value={values.buttom}
                    error={errors.buttom}
                    type='submit'
                    startIcon={<Icon style={{ marginLeft: 5, fontSize: 14 }}>mail_outline</Icon>} justifyContent='center' />




                </Grid>
              </Grid>
            </Form>
          )}

          {showReset && (
            <Form onSubmit={handleSubmit}>
              <Grid container spacing={1} >
                <Grid item xs={6}>
                  <Controls.Input
                    autoFocus
                    name="password"
                    label="Nova Senha*"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    value={values.password}
                    error={errors.password}
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

                <Grid item xs={6}>
                  <Controls.Input
                    name="passwordConfirm"
                    label="Confirmar Senha*"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    value={values.passwordConfirm}
                    error={errors.passwordConfirm}
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

                <Grid item xs={12}>
                  <Controls.Input
                    name="code"
                    label="Código de Confirmação*"
                    onChange={(e) => changeCustom(e, toLowerCase, handleInputChange)}
                    value={values.code}
                    error={errors.code}
                    inputProps={{ maxLength: 10 }}
                    
                  />
                  <Grid style={{ marginTop: '0', fontSize: 13, color: 'primary' }} item xs={12}>
                    <Icon color='primary' style={{ marginBottom: -2, fontSize: 14, marginRight: 5 }}>timer</Icon>
                    <b style={{ fontSize: 14, color: 'primary' }}>Tempo de Expiração para código: {counter}s</b>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <ButtonDefault
                    fullWidth
                    type='submit'
                    name="buttom"
                    label={'Confirmar'}
                    disabled={loading}
                    onChange={handleInputChange}
                    value={values.buttom}
                    error={errors.buttom}
                    startIcon={<Icon style={{ marginLeft: 5, fontSize: 14 }}>mail_outline</Icon>}


                  />


                </Grid>
              </Grid>
            </Form>
          )}

        </Paper>
      </Grid>

    </Grid>

    // <Container component="main" >


    // </Container>
  );
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResetPassword);
