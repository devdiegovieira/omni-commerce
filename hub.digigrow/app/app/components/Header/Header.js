import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import FullscreenOutlined from '@material-ui/icons/FullscreenOutlined';
import FullscreenExitOutlined from '@material-ui/icons/FullscreenExitOutlined';
import InvertColors from '@material-ui/icons/InvertColorsOutlined';
import HelpOutlineOutlined from '@material-ui/icons/HelpOutlineOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';
import brand from 'digi-api/dummy/brand';
import logo from 'digi-images/logo.svg';
import { injectIntl, intlShape } from 'react-intl';

import SearchUi from '../Search/SearchUi';
import SelectLanguage from '../SelectLanguage';
import messages from './messages';
import styles from './header-jss';

const elem = document.documentElement;

function Header(props) {
  const {
    changeMode,
    classes,
    toggleDrawerOpen,
    margin,
    mode,
    openGuide,
    history,
    intl
  } = props;
  const [open] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [turnDarker, setTurnDarker] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  // Initial header style
  let flagDarker = false;
  let flagTitle = false;

  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagDarker = (scroll > 30);
    const newFlagTitle = (scroll > 40);
    if (flagDarker !== newFlagDarker) {
      setTurnDarker(newFlagDarker);
      flagDarker = newFlagDarker;
    }
    if (flagTitle !== newFlagTitle) {
      setShowTitle(newFlagTitle);
      flagTitle = newFlagTitle;
    }
  };

  const openFullScreen = () => {
    setFullScreen(true);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const closeFullScreen = () => {
    setFullScreen(false);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const turnMode = newMode => {
    if (newMode === 'light') {
      changeMode('dark');
    } else {
      changeMode('light');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar
      className={classNames(
        classes.appBar,
        classes.floatingBar,
        margin && classes.appBarShift,
        turnDarker && classes.darker,
      )}
    >
      <Toolbar disableGutters={!open}>
        {/* <div className={classNames(classes.brandWrap, dense && classes.dense)}> */}
        <span>
          <IconButton
            className={classes.menuButton}
            aria-label="Menu"
            onClick={toggleDrawerOpen}
            style={{ marginLeft: 18 }}
          >
            <MenuIcon />
          </IconButton>
        </span>
        {/* <Hidden smDown> */}
        <NavLink to="/" className={classes.brand}>
          <img src={logo} alt={brand.name} />
        </NavLink>
        {/* </Hidden> */}
        {/* </div> */}
        <Hidden smDown>
          <div className={classes.headerProperties} style={{ marginLeft: 20 }}>
            <div
              className={classNames(
                classes.headerAction,
                //  showTitle && classes.fadeOut,
              )}
            >
              {fullScreen ? (
                <Tooltip title={intl.formatMessage(messages.fullScreen)} placement="bottom">
                  <IconButton
                    onClick={closeFullScreen}
                  >
                    <FullscreenExitOutlined />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title={intl.formatMessage(messages.exitFullScreen)} placement="bottom">
                  <IconButton
                    onClick={openFullScreen}
                  >
                    <FullscreenOutlined />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={intl.formatMessage(messages.lamp)} placement="bottom">
                <IconButton
                  onClick={() => turnMode(mode)}
                  style={{ marginLeft: 10 }}
                >
                  <InvertColors />
                </IconButton>
              </Tooltip>
              <Tooltip title={intl.formatMessage(messages.guide)} placement="bottom">
                <IconButton
                  onClick={openGuide}
                  style={{ marginLeft: 10 }}
                >
                  <HelpOutlineOutlined />
                </IconButton>
              </Tooltip>
            </div>

          </div>
        </Hidden>
        <div className={classes.searchWrapper}>
          <div className={classes.wrapper}>
            <div className={classes.search}>
              <SearchIcon />
            </div>
            <SearchUi history={history} />
          </div>
        </div>
        <Hidden xsDown>
          <span className={classes.separatorV} />
        </Hidden>
        {/* <div className={classes.userToolbar}>
          <SelectLanguage />
        </div> */}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  avatar: PropTypes.string.isRequired,
  margin: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool,
  dense: PropTypes.bool,
  mode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired,
  openGuide: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: intlShape.isRequired
};

Header.defaultProps = {
  dense: false,
  isLogin: false
};

export default withStyles(styles)(injectIntl(Header));
