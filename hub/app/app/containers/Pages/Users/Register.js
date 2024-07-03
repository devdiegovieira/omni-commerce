import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { NavLink } from 'react-router-dom';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { SelectLanguage } from 'digi-components';
import styles from 'digi-components/Forms/user-jss';
import brand from 'digi-api/dummy/brand';
import logo from 'digi-images/logo.svg';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { Checkbox, CircularProgress, FormControlLabel, IconButton, InputAdornment, Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import logoWhite from 'digi-images/logo.svg';
import classNames from 'classnames';
import Controls from '../../../components/Forms/controls';
import { Form, useForm } from '../../../components/Forms/useForm';
import { promisseApi } from '../../../api/api';
import { capitalizeFirst, changeCustom, maskPhone, toLowerCase } from '../../../utils/dynamicMasks';
import { passwordsMatch, validateEmail } from '../../../utils/formValidation';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { checkPasswordStrength, login } from '../../../utils/auth';
import GoogleLogin from 'react-google-login';
import backImage from 'digi-images/login-img.png';
import { decode } from '../../../utils/base64';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';



const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
  return <NavLink to={props.to} {...props} innerRef={ref} />;
});

function Register(props) {
  let paths = location.pathname.split('/');

  const { classes } = props;
  const title = brand.name + ' - Register';
  const description = brand.desc;
  const SHA256 = require('crypto-js/sha256');
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();
  const [checked, setChecked] = useState(true);
  const [value, setValue] = useState({
    outMail: paths.length > 2 && decode(paths[2]),
    mail: paths.length > 2 && decode(paths[2]) ? decode(paths[2]) : undefined,
  });
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState();
  const [showRegister, setShowRegister] = useState(false);
  const [imageUser, setImageGoogleUser] = useState('');
  const [researchList, setResearchList] = useState();
  const [showSendTimer, setShowSendTimer] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const startAgain = () => {
    setShowRegister(false);
    setShowSendTimer(false);
    setCounter();
  }

  useEffect(() => {
    if (counter || counter == 0) {
      if (counter == 0) {
        startAgain();
      }

      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

      return () => clearInterval(timer);
    }
    promisseApi(
      'get',
      '/selectList/research',
      (data) => setResearchList(data.map(m => {
        return {
          id: m,
          title: m
        }
      }))
    )

  }, [counter])


  const handleChange = (event) => {
    setChecked(event.target.checked);
  }

  const submit = () => {
    setLoading(true);
    promisseApi(
      'post',
      '/user',
      (data) => {

        setLoading(false);
        enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' });

        login(
          values.mail,
          values.password,
          null,
          (data) => {
            window.location.href = '/';
          },
          (err) => {
            enqueueSnackbar(err, { variant: 'error' })
            setLoading(false);
          }
        );

      },
      (err) => {
        enqueueSnackbar(err, { variant: 'error' });
        setLoading(false);
      },
      {
        mail: values.mail,
        password: (SHA256(values.password)).toString(),
        document: values.document,
        phone: values.phone,
        name: values.name,
        code: values.code,
        google: imageUser,
        googleToken: values.googleToken,
        picture: imageUser ? imageUser : values.picture,
        type: values.outMail ? 'outMail' : (values.type ? values.type : 'normal'),
        whereUfind: values.whereUfind,
        other: values.other

      }

    );

  }

  const sendMail = () => {
    setCounter(600)
    setLoading(true);
    promisseApi(
      'post',
      '/user/confirmMail',
      (data) => {
        setShowRegister(true)
        setShowSendTimer(true)
        setLoading(false);
        enqueueSnackbar('Código Enviado!', { variant: 'success' });
        setValue({ ...value, ...valuesSendMail });

        // validate();

      },
      (err) => {
        enqueueSnackbar(handleError(err), { variant: 'error' });
        setLoading(false);
      },
      {
        ...valuesSendMail,
        new: true
      }
    );
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(value, true, submit, [
    {
      field: 'name',
      message: 'O Campo nome é obrigatório'
    },
    {
      field: 'document',
      message: 'O Campo documento é obrigatório'
    },
    {
      field: 'phone',
      message: 'O Campo telefone é obrigatório'
    },
    {
      field: 'code',
      message: 'Código enviado no seu e-mail é obrigatório',
      rule: (fieldValue) => {
        return !(fieldValue.code || (!fieldValue.code && (fieldValue.outMail || fieldValue.googleToken)))
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
    {
      field: 'mail',
      message: 'Email inválido',
      rule: (fieldValue) => {
        return !validateEmail(fieldValue.mail);
      }
    },
    {
      field: 'whereUfind',
      message: 'Necessário preencher pesquisa',
      rule: (fieldValue) => {
        return !(fieldValue.whereUfind);
      }
    }

  ]);


  const {
    values: valuesSendMail,
    errors: errorsSendMail,
    handleInputChange: handleInputChangeSendMail,
    handleSubmit: handleSubmitSendMail,
    validate
  } = useForm(value, true, sendMail, [

    {
      field: 'mail',
      message: 'Email inválido',
      rule: (fieldValue) => {
        return !validateEmail(fieldValue.mail);
      }
    }

  ]);



  const responseGoogle = (response) => {
    const {
      profileObj: { name, email, imageUrl },
    } = response;

    let googleToken = response.getAuthResponse().id_token

    setValue({
      name,
      mail: email,
      googleToken: googleToken,
    })

    validate({
      name,
      mail: email,
      googleToken: googleToken,
    })

    setImageGoogleUser(imageUrl);
    values.type = 'google';
    setShowRegister(true);
  };

  const handlePhone = (e) => {
    if (
      e.nativeEvent.inputType == 'deleteContentBackward' &&
      e.target.value.length == 9
    ) {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    }
    changeCustom(e, maskPhone, handleInputChange);
  }

  const [state, setState] = React.useState(
    false
  );
  const handleCheck = () => {
    setState(!state);
    values.whereUfind = null
  };

  return (

    <Grid container component="main" style={{ height: '100vh', padding: 0 }}>
      <img src={backImage} style={{ position: 'absolute', zIndex: -1, height: '100%' }} />


      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      {/* <div className={classes.containerSide}> */}
      <Hidden smDown>
        <Grid item xl={7} lg={7} md={7} sm={5} xs={12}>
          <div className={classes.openingWrap}>
            <div className={classes.openingHead}>
              <NavLink to="/" className={classes.brand}>
                <img src={logoWhite} alt={brand.name} />
                {/* {brand.name} */}
              </NavLink>
            </div>
            <p style={{ fontWeight: 700, fontSize: 70, color: '#4b05af', maxWidth: 500, marginBottom: -30, fontFamily: 'Poppins' }}>
              Olá, como vai?
            </p>
            <p style={{ fontWeight: 700, fontSize: 18, color: '#4b05af', maxWidth: 500, marginBottom: -70, marginTop: 20, fontFamily: 'Poppins' }}>
              Crie uma conta grátis para começar a usar
            </p>

          </div>
          <div className={classes.openingFooter}>
            <Grid container direction="row-reverse" justifyContent="space-between" alignItems="center">
              <NavLink to="/" className={classes.back}>
                <ArrowBack />
                &nbsp;Voltar
              </NavLink>
              <div className={classes.userToolbar}>
                <SelectLanguage />
              </div>
            </Grid>
          </div>
        </Grid>
      </Hidden>

      <Grid item xl={5} lg={5} md={5} sm={7} xs={12} >

        {/* <div style={{ height: '100vh', maxWidth: 570, padding: 0 }}> */}

        <Paper className={classes.sideWrap}>
          <Hidden mdUp>
            <NavLink to="/" className={classes.brand}>
              <ArrowBack />
              &nbsp;Voltar
              <img src={logo} alt={brand.name} />
            </NavLink>

          </Hidden>


          <Grid container spacing={1}>


            <Grid item xs={12}>
              <div className={classes.topBar}>
                <Typography variant="h4" className={classes.title}>
                  <FormattedMessage {...messages.register} />
                </Typography>
                <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/login">
                  <Icon className={classNames(classes.icon, classes.signArrow)}>arrow_forward</Icon>
                  <FormattedMessage {...messages.toAccount} />
                </Button>
              </div>

            </Grid>

            <Grid item xs={12}>
              <Form onSubmit={handleSubmitSendMail}>
                <Controls.Input
                  fullWidth
                  name="mail"
                  label="E-mail*"
                  onChange={(e) => changeCustom(e, toLowerCase, handleInputChangeSendMail)}
                  value={valuesSendMail.mail}
                  disabled={loading || values.outMail || showRegister}
                  error={errorsSendMail.mail}
                  inputProps={{ maxLength: 100 }}
                />

                {!showRegister &&
                  <Grid container justifyContent='center'>

                    < Grid item>

                      <ButtonDefault
                        type='submit'
                        style={{ marginTop: 10, height: 40, width: 150, fontSize: 13 }}
                        name="sendMail"
                        label={'Enviar Código'}
                        icon={'mail_outline'}
                        disabled={loading || valuesSendMail.outMail || showRegister}
                      >

                      </ButtonDefault>
                    </Grid>


                    <Grid item style={{ margin: 10, marginTop: 15 }}>ou</Grid>

                    <Grid item style={{ marginTop: 8 }}>
                      <GoogleLogin
                        clientId="994466419809-ramfmi15g5efqgr7vg7pu8e2klome5qm.apps.googleusercontent.com"
                        buttonText="Usar o Google"
                        onSuccess={responseGoogle}
                        disabled={loading || valuesSendMail.outMail || showRegister}
                      />
                    </Grid>
                  </Grid>
                }

                {showRegister &&
                  <Grid container justifyContent='center'>

                    < Grid item>
                      <ButtonDefault
                        style={{ marginTop: 10, height: 40, width: 150, fontSize: 13 }}
                        label={'Trocar E-mail'}
                        icon={'repeat'}
                        name="goToStart"
                        onClick={() => { startAgain() }}
                      />
                    </Grid>
                  </Grid>
                }
              </Form>
            </Grid>



            <Form onSubmit={handleSubmit}>
              {showSendTimer && !values.outMail && (
                <Grid item xs={12}>
                  <Grid container justifyContent='flex-end' spacing={2}>
                    <Grid item xs={6}>
                      <Controls.Input
                        name="code"
                        label="Código enviado no E-mail"
                        onChange={handleInputChange}
                        value={values.code}
                        error={errors.code}
                        inputProps={{ maxLength: 20 }}
                      />
                    </Grid>
                    <Grid item style={{ marginTop: 25 }} xs={6}>
                      <b style={{ fontSize: 14, color: 'primary' }}>
                        <Icon color='primary' style={{ marginBottom: -2, fontSize: 14 }}>timer</Icon> {`O código expira em: ${counter / 60 >= 1 ? `${Math.round(counter / 60)} ${Math.round(counter / 60) == 1 ? 'minuto' : 'minutos'}` : `${counter} segundos`}`}
                      </b>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {(showRegister || values.outMail) && (
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Controls.Input
                        name={"name"}
                        onChange={(e) => changeCustom(e, capitalizeFirst, handleInputChange)}
                        value={values.name}
                        label="Nome"
                        autoComplete='new-password'
                        error={errors.name}
                        inputProps={{
                          maxLength: 100,
                        }}
                      />
                    </Grid>


                    <Grid item xs={12}>
                      <Controls.Input
                        name="document"
                        label="CPF*"
                        onChange={handleInputChange}
                        value={values.document}
                        autoComplete='new-password'
                        mask="999.999.999-99"
                        error={errors.document}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controls.Input
                        name="phone"
                        label="Telefone*"
                        autoComplete='new-password'
                        onChange={handlePhone}
                        value={values.phone}
                        error={errors.phone}
                      />
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Controls.Select
                          name="whereUfind"
                          label="Como nos encontrou?"
                          value={values.whereUfind}
                          disabled={state == true}
                          onChange={handleInputChange}
                          options={researchList}
                          error={errors.whereUfind}
                        /> </Grid>

                      <Grid item xs={4} style={{ paddingTop: 25 }} >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={state.checkedA}
                              onChange={handleCheck}
                              name="checkedB"
                              color="primary"
                            />
                          }
                          label="Outros"
                        />
                      </Grid></Grid>
                    {state == true &&
                      <Grid item xs={12}>
                        <Controls.Input
                          name="whereUfind"
                          label="Outros*"
                          onChange={handleInputChange}
                          value={values.whereUfind}
                          error={errors.whereUfind}
                        />
                      </Grid>
                    }

                    <Grid item xs={12} >
                      <Grid container spacing={2}>

                        <Grid item xs={6}>
                          <Controls.Input
                            name="password"
                            autoComplete='new-password'
                            value={values.password}
                            label="Senha*"
                            error={errors.password}
                            type={showPassword ? 'text' : 'password'}
                            onChange={handleInputChange}
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
                            autoComplete='new-password'
                            label="Confimar senha*"
                            value={values.passwordConfirm}
                            onChange={handleInputChange}
                            type={showPassword ? 'text' : 'password'}
                            error={errors.passwordConfirm}
                            inputProps={{ maxLength: 20 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                  >{showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </Grid>

                      </Grid>
                    </Grid>


                    <Grid item  >
                      <Checkbox
                        name="checkbox"
                        checked={checked}
                        value={values.checkbox}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                      <Button size="small" className={classes.buttonLink} style={{ marginLeft: 5, marginTop: 12 }} component={LinkBtn} to="/register">
                        <FormattedMessage {...messages.terms} />
                        <Icon style={{ marginLeft: 5, fontSize: 15 }}>content_paste_go</Icon>
                      </Button>
                    </Grid>

                    <ButtonDefault
                      fullWidth
                      disabled={loading}
                      icon={'arrow_forward'}
                      label={'Continue'}
                      type="submit"
                    />

                  </Grid>
                </Grid>)}


            </Form>
          </Grid>
        </Paper>
      </Grid>
      {/* </div > */}
    </Grid >
  );
}

Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
