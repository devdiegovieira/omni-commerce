import React from 'react';
import { PropTypes } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
const styles = {
  circularProgress: {
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    margin:'auto'
  }
};

function Loading(props) {
  const { classes } = props;
  return (<CircularProgress className={classes.circularProgress} size={90} thickness={1} color="secondary" />);
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default (withStyles(styles)(Loading));
