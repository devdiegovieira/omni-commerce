import React, { Fragment, useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import Fade from '@material-ui/core/Fade';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {
  Header,
  Sidebar,
  BreadCrumb,
} from 'digi-components';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from 'digi-api/ui/menuMessages';
import styles from '../appStyles-jss';
import { api } from '../../../api/api';
import { getAppMenu } from '../../../utils/auth';

function LeftSidebarLayout(props) {
  const {
    classes,
    children,
    toggleDrawer,
    sidebarOpen,
    loadTransition,
    pageLoaded,
    mode,
    history,
    changeMode,
    place,
    titleException,
    handleOpenGuide,
    signOut,
    userAttr,
    isLogin
  } = props;


  const [dataMenu, setDataMenu] = React.useState([]);

  React.useEffect(() => {
    getAppMenu(
      get => {
        setDataMenu(get.data);
      },
      err => console.log(err)
    );
  }, []);

  return (
    <>
      <Header
        toggleDrawerOpen={toggleDrawer}
        margin={sidebarOpen}
        changeMode={changeMode}
        mode={mode}
        title={place}
        history={history}
        openGuide={handleOpenGuide}
        signOut={signOut}
        isLogin={isLogin}
        avatar={userAttr.avatar}
      />
      <Sidebar
        open={sidebarOpen}
        toggleDrawerOpen={toggleDrawer}
        loadTransition={loadTransition}
        dataMenu={dataMenu}
        userAttr={userAttr}
        leftSidebar        
      />
      <main className={classNames(classes.content, !sidebarOpen ? classes.contentPaddingLeft : '')} style={{padding: 8, paddingTop: 15, paddingLeft: sidebarOpen ? 10 : 75}} id="mainContent">
        <section className={classNames(classes.mainWrap, classes.sidebarLayout)}>         
          {!pageLoaded && (<img src="/images/spinner.gif" alt="spinner" className={classes.circularProgress} />)}
          <Fade
            in={pageLoaded}
            {...(pageLoaded ? { timeout: 700 } : {})}
          >
            <div className={!pageLoaded ? classes.hideApp : ''} >
              {/* Application content will load here */}
              {children}
            </div>
          </Fade>
        </section>
      </main>
    </>
  );
}

LeftSidebarLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  titleException: PropTypes.array.isRequired,
  handleOpenGuide: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  isLogin: PropTypes.bool,
  userAttr: PropTypes.object.isRequired,
};

LeftSidebarLayout.defaultProps = {
  isLogin: false
};

export default (withStyles(styles)(injectIntl(LeftSidebarLayout)));
