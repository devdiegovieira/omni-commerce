import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { SelectLanguage } from 'digi-components';
import logo from 'digi-images/logo.svg';
import logoWhite from 'digi-images/logo.svg';
import ArrowBack from '@material-ui/icons/ArrowBack';
import styles from 'digi-components/Forms/user-jss';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Notification from 'digi-components/Notification';
import { Button, CircularProgress, Grid, Icon, IconButton, InputAdornment, Paper } from '@material-ui/core';
import classNames from 'classnames';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import ArrowForward from '@material-ui/icons/ArrowForward';
import { validateEmail } from '../../../utils/formValidation';
import { login } from '../../../utils/auth';
import ReCAPTCHA from "react-google-recaptcha";
import { changeCustom, toLowerCase } from '../../../utils/dynamicMasks';
import GoogleLogin from 'react-google-login';
import backImage from 'digi-images/login-img.png';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';

function Login(props) {
  const { classes } = props;
  const title = brand.name + ' - Login';
  const description = brand.desc;
  const [value, setValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [isValid, setIsValid] = useState(false);

  const captcha = useRef(null);

  useEffect(() => {
    if (showCaptcha) {
      setIsValid(true);

    }

  }, [showCaptcha])


  const onChange = () => {

    if (captcha.current.getValue()) {
      setIsValid(false)
      setShowCaptcha(false)
      return
    }
    setIsValid(true)
  }


  const submit = (googleToken) => {
    setLoading(true);

    login(
      values.mail,
      values.password,
      googleToken,
      (data) => {

        setLoading(false);
        window.location.href = '/';
      },
      (err) => {
        if (!googleToken) setShowCaptcha(true);

        enqueueSnackbar(err, { variant: 'error' })
        setLoading(false);
      }
    );

  };

  const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
    return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
  });


  const loginGoogle = (response) => {
    const {
      profileObj: { name, email, imageUrl },
    } = response;

    let googleToken = response.getAuthResponse().id_token

    submit(googleToken)

  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
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
      message: 'O Campo senha é obrigatório'
    }

  ]);


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


      <Hidden xsDown>
        <Grid item xl={7} lg={7} md={7} sm={5} xs={12}>

          <div >
            <div className={classes.openingWrap}>
              <div className={classes.openingHead}>
                <NavLink to="/" className={classes.brand}>
                  <img src={logoWhite} alt={brand.name} />
                </NavLink>
              </div>
              <p style={{ fontWeight: 700, fontSize: 70, color: '#4b05af', maxWidth: 500, marginBottom: -40, marginLeft: 15, fontFamily: 'Poppins' }}>
                Bem vindo
              </p>
              <p style={{ fontWeight: 700, fontSize: 70, color: '#4b05af', maxWidth: 500, marginBottom: -30, marginLeft: 15, fontFamily: 'Poppins' }}>
                ao nosso
              </p>
              <p style={{ fontWeight: 700, fontSize: 70, color: '#4b05af', maxWidth: 500, marginBottom: -50, marginLeft: 15, fontFamily: 'Poppins' }}>
                HUB
              </p>

              &nbsp;

              <p style={{ fontWeight: 700, fontSize: 20, color: '#4b05af', maxWidth: 500, marginBottom: -70, marginTop: 20, marginLeft: 20, fontFamily: 'Poppins' }}>
                Faça o login para acessar
              </p>
            </div>
            <div className={classes.openingFooter}>
              <NavLink to="/" className={classes.back}>
                <ArrowBack />
                &nbsp;Voltar
              </NavLink>
              <div className={classes.userToolbar}>
                <SelectLanguage />
              </div>
            </div>
          </div>


        </Grid>

      </Hidden>

      <Grid item xl={5} lg={5} md={5} sm={7} xs={12} >
        <Paper className={classes.sideWrap} >
          <Hidden mdUp>
            <div className={classes.headLogo}>
              <NavLink to="/" className={classes.brand}>
                <img src={logo} alt={brand.name} />
              </NavLink>
            </div>
          </Hidden>
          {/* 
            <Hidden mdDown>

            </Hidden> */}

          <Form onSubmit={handleSubmit}>

            <Grid container spacing={1}  >

              <Grid item xs={12}>
                <div className={classes.topBar}>
                  <Typography variant="h4" className={classes.title} >
                    <FormattedMessage {...messages.login} />
                  </Typography>
                  <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/register">
                    <Icon className={classNames(classes.icon, classes.signArrow)}>arrow_forward</Icon>
                    <FormattedMessage {...messages.newAcount} />
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Controls.Input
                  name="mail"
                  label="E-mail*"
                  onChange={(e) => changeCustom(e, toLowerCase, handleInputChange)}
                  value={values.mail}
                  error={errors.mail}
                  inputProps={{ maxLength: 100 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Controls.Input
                  name="password"
                  value={values.password}
                  label="Senha*"
                  error={errors.password}
                  type={showPassword ? 'text' : 'password'}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 20, }}
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

              <Grid style={{ display: 'flex', justifyContent: 'right', marginBottom: 10 }} item xs={12}>
                <div >
                  <Button size="small" className={classes.buttonLink} component={LinkBtn} to="/reset-password">
                    <Icon style={{ marginLeft: 5, fontSize: 17 }} className={classes.icon}>no_encryption</Icon>
                    <FormattedMessage {...messages.password} />
                  </Button>
                </div>
              </Grid>

              <Grid item xs={12}>
                {showCaptcha && (<>

                  <Grid item Xs={12} style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }} xs={12}>
                    <ReCAPTCHA
                      //6LdQr1odAAAAAGGGYBG_Kw_VEpSRRKvGrBv4DMKS - Prod
                      //6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI - Homolog
                      sitekey={
                        process.env.NODE_ENV === 'production' ?
                          '6LdQr1odAAAAAGGGYBG_Kw_VEpSRRKvGrBv4DMKS' :
                          '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                      }
                      ref={captcha}
                      onChange={onChange}
                    />
                  </Grid>
                </>)}
                <Grid
                  container
                  spacing={2}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Grid item xs={'auto'}>
                    <Button

                      onClick={() => setShowGoogleLogin(true)}
                      disabled={loading || showCaptcha}
                    >
                      <GoogleLogin
                        style={{ borderRadius: 3, padding: 4, textTransform: 'none', fontSize: 11, minWidth: 110 }}
                        clientId="994466419809-ramfmi15g5efqgr7vg7pu8e2klome5qm.apps.googleusercontent.com"
                        buttonText="Entrar com o Google"
                        onSuccess={loginGoogle}
                      />
                    </Button>
                  </Grid>

                  <Grid item>
                    <p>ou</p>
                  </Grid>

                  <Grid item>
                    <ButtonDefault
                      disabled={loading || showCaptcha || isValid}
                      label={'Continue'}
                      icon={'arrow_forward'}
                      type='submit'

                    />


                  </Grid>
                </Grid>

              </Grid>

            </Grid>

          </Form>

        </Paper>
      </Grid>

    </Grid>



  );
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Login);
