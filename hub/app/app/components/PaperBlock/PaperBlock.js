import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import styles from './papperStyle-jss';
import { Avatar, Box, Button, Grid, IconButton, ListItem, ListItemAvatar } from '@material-ui/core';
import { setMilliseconds } from 'date-fns';


function PaperBlock(props) {
  const {
    classes,
    title,
    desc,
    children,
    whiteBg,
    noMargin,
    colorMode,
    overflowX,
    icon,
    tooltipTitle,
    padding,
    paperButton,
    ...others
  } = props;

  const color = mode => {
    switch (mode) {
      case 'light':
        return classes.colorLight;
      case 'dark':
        return classes.colorDark;
      default:
        return classes.none;
    }
  };



  return (
    <Paper
      className={
        classNames(
          // classes.root,
          noMargin && classes.noMargin,
          color(colorMode)
        )
      }
      style={{ padding: 10 }}
      elevation={0}
      {...others}
    >
      <div className={classes.descBlock}>
        <div className={classes.titleText}>

          <ListItem style={{padding:0, paddingLeft: 5}}>
            {icon && (
              // <ListItemAvatar>
                <Avatar style={{marginRight: 10}}>
                  <Icon>{icon}</Icon>
                </Avatar>
              // </ListItemAvatar>
            )}

            <Grid container >

              <Grid item xs={tooltipTitle ? 8 : paperButton ? 10 : 12}>
                <Typography variant="h6" component="h2" className={classes.title}>
                  {title}
                </Typography>

                {desc && (
                  <Typography component="p" className={classes.description}>
                    {desc}
                  </Typography>
                )}

              </Grid>

              {tooltipTitle && (
                <Grid item xs={4}  >
                  {tooltipTitle}
                </Grid>
              )}

              {paperButton && (
                <Grid item xs={2} style={{ marginTop: 10 }}>
                  <Grid container justifyContent='flex-end'>
                    {paperButton}
                  </Grid>
                </Grid>
              )}

            </Grid>

          </ListItem>

        </div>
      </div>
      <section style={{ padding: !padding ? '' : 0 }} className={classNames(classes.content, whiteBg && classes.whiteBg, overflowX && classes.overflowX)}>
        {children}
      </section>
    </Paper >
  );
}

PaperBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  whiteBg: PropTypes.bool,
  colorMode: PropTypes.string,
  noMargin: PropTypes.bool,
  overflowX: PropTypes.bool,
};

PaperBlock.defaultProps = {
  whiteBg: false,
  noMargin: false,
  colorMode: 'none',
  overflowX: false,

};

export default compose(withStyles(styles))(PaperBlock);
