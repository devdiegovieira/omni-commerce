import React from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './appStyles-jss';
import { Container } from '@material-ui/core';

function Outer(props) {
  const {
    children,
  } = props;

  return (

      <Container maxWidth="auto">
        {children}
      </Container>
  );
}

Outer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default (withStyles(styles)(Outer));
