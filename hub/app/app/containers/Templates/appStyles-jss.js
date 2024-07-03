import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import deco from 'digi-images/decoration/hexaMonochrome.svg';

const appFrame = {
  display: 'flex',
  width: '100%',
  minHeight: '100%',
  zIndex: 1,
};

const styles = theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },
    '*::-webkit-scrollbar-thumb': {
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    '*:hover': {
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.8)',
      }
    }

  },
  root: {
    width: '100%',
    marginTop: 0,
    zIndex: 1,
    overflow: 'auto',
  },
  blogWrap: {
    position: 'relative'
  },
  appFrameInner: {
    background: theme.palette.type === 'dark' ? darken(theme.palette.primary.dark, 0.8) : lighten(theme.palette.primary.light, 0.9),
    color: theme.palette.text.primary,
    ...appFrame,
  },
  appFrameOuter: {
    ...appFrame,
  },
  appFrameLanding: {
    backgroundColor: theme.palette.background.default,
    minHeight: 1000,
  },
  appFrameSlider: {
    display: 'flex',
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('lg')]: {
      position: 'absolute',
      overflow: 'hidden',
    },
    backgroundColor: theme.palette.background.default
  },
  topNav: {
    flexDirection: 'column',
  },
  sideNav: {
    flexDirection: 'row',
  },
  content: {
    width: '100%',
    padding: theme.spacing(2),
    minHeight: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  },
  outerContent: {
    width: '100%',
    backgroundSize: 'cover',
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgWrap: {
    position: 'fixed',
    background: theme.palette.background.default,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  headerBg: {},
  halfBg: {},
  fullBg: {},
  bgbar: {
    backgroundAttachment: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
    '&$headerBg': {
      height: 64
    },
    '&$halfBg': {
      height: 400
    },
    '&$fullBg': {
      height: '100%'
    },
  },
  solidBg: {
    backgroundColor: theme.palette.type === 'dark' ? darken(theme.palette.primary.main, 0.4) : theme.palette.primary.main,
    '&:before': {
      content: "''",
      width: '100%',
      height: '100%',
      position: 'absolute',
      opacity: 0.1,
      background: `url(${deco}) no-repeat -70px -370px, url(${deco}) no-repeat 100% 480px`
    }
  },
  sidebarLayout: {},
  topbarLayout: {},
  mainWrap: {
    height: '100%',
    position: 'relative',
    '& > div': {
      willChange: 'inherit !important' // hack for floating form issue when expaded
    },
    '&$sidebarLayout': {
      paddingTop: theme.spacing(4),
    },
    '&$topbarLayout': {
      width: '100%',
      marginTop: theme.spacing(3),
    },
  },
  preloader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    background: 'transparent',
    height: 3,
  },
  materialBg: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    opacity: 0.5
  },
  contentPaddingLeft: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(2),
  },
  contentPaddingRight: {
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(2),
  },
  contentPaddingLeftSm: {
    paddingLeft: theme.spacing(2)
  },
  contentPaddingRightSm: {
    paddingRight: theme.spacing(2)
  },
  hideApp: {
    display: 'none'
  },
  circularProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto'
  },
  brand: {
    height: 54,
    display: 'flex',
    padding: '10px 10px 5px',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      width: 120
    },
    '& h3': {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      paddingLeft: 10,
      color: theme.palette.common.white,
    }
  },
  light: {},
  pageTitle: {
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    '& h4': {
      fontWeight: 700,
      fontSize: 24,
      paddingLeft: 10,
      paddingRight: theme.spacing(1),
      textTransform: 'capitalize',
      color: theme.palette.type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.dark,
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(3)
      }
    },
  },
});

export default styles;
