import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { Route, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import borderHexaGrey from 'digi-images/decoration/hexaGrey.svg';
import borderHexaWhite from 'digi-images/decoration/hexaWhite.svg';
import messages from './messages';
import { Grid } from '@material-ui/core';
import Button from '../Forms/controls/Button';

const styles = theme => ({
  invert: {},
  errorWrap: {
    background: `url(${theme.palette.type === 'dark' ? borderHexaWhite : borderHexaGrey}) no-repeat`,
    backgroundSize: '100% 100%',
    backgroundPosition: '-4px center',
    width: 500,
    height: 500,
    [theme.breakpoints.down('sm')]: {
      width: 300,
      height: 300,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    margin: `${theme.spacing(3)}px auto`,
    '&$invert': {
      '& h1, h5': {
        color: theme.palette.common.white
      }
    },
    '& h5': {
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.2rem',
      },
    },
  },
  title: {
    color: theme.palette.text.secondary,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: '4rem',
      marginBottom: theme.spacing(2)
    },
  },
  deco: {
    boxShadow: theme.shadows[2],
    position: 'absolute',
    borderRadius: 2,
  },
  button: {
    marginTop: 24
  },
  //gif: {
  //  position: "relative"
  //},
  //image: {
  //  position: "absolute",
  //  marginLeft: "50%",
  //  transform: 'translate(-50%)'
  //},
  //p: {
  //  position: "absolute",
  //  marginTop: "45%",
  //  marginLeft: "50%",
  //  transform: 'translate(-50%)'
  //}
});

const ErrorWrap = (props) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = 404; // eslint-disable-line
      }
      const {
        classes,
        title,
        desc,
        invert,
        subtitle,
      } = props;
      return (
        <>
          <Grid container spacing={0}>
            <Grid item lg={12} sm={12} xs={12} >
              <Grid container justifyContent='center'>
                <img style={{marginTop:50, marginBottom:20, height:300}} src="https://dbaasltd.com/assets/img/support-and-maintenance.gif" /> 
              </Grid>
            </Grid>
            <Grid item lg={12} sm={12} xs={12}>
              <Grid container justifyContent='center'>
                <Typography variant="h4" gutterBottom>
                  {desc}
                </Typography>
              </Grid>
            </Grid>
            <Grid item lg={12} sm={12} xs={12}>
              <Grid container justifyContent='center' style={{ marginBottom: 15 }}>
                <Typography variant="h6" gutterBottom>
                  {subtitle}
                </Typography>
              </Grid>
            </Grid>
            <Grid item lg={12} sm={12} xs={12} >
              <Grid container justifyContent='center'>
                <Button onClick={() => { window.location.href = "http://localhost:3001" } } text="Voltar ao início"></Button>
              </Grid>
            </Grid>
          </Grid>  


        </>
      );
    }}
  />
);

ErrorWrap.propTypes = {
  classes: PropTypes.object.isRequired,
  desc: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  invert: PropTypes.bool,
};

ErrorWrap.defaultProps = {
  invert: false,
};

export default withStyles(styles)(ErrorWrap);
