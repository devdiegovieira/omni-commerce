import { darken } from '@material-ui/core/styles/colorManipulator';
const styles = theme => ({
  root: {
    padding: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    // marginBottom: theme.spacing(3),
    boxShadow: theme.shade.light,
    color: theme.palette.text.primary,
    [theme.breakpoints.up('sm')]: {
      padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`
    },
    '&$noMargin': {
      margin: 0
    },
  },
  descBlock: {
    display: 'flex',
    
    // marginBotto: theme.spacing(5),
    // [theme.breakpoints.down('sm')]: {
    //   marginBottom: theme.spacing(1),
    // }
  },
  titleText: {
    flex: 1
  },
  title: {
    position: 'relative',
    textTransform: 'capitalize',
    fontSize: 16,
    fontWeight: 700,
    // marginTop:10,
    // marginLeft: 15,
    // [theme.breakpoints.down('xs')]: {
    //   textAlign: 'center',
    //   fontWeight: 600,
    //   marginBottom: theme.spacing(1)
    // }
  },
  description: {
    maxWidth: 960,
    // paddingTop: theme.spacing(0.5),
    // marginLeft: 15,
    // [theme.breakpoints.down('xs')]: {
    //   textAlign: 'center'
    // }
  },
  content: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.rounded.medium,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(2)
    }
  },
  whiteBg: {
    backgroundColor: 'transparent',
    margin: 0,
    padding: 0,
  },
  noMargin: {},
  colorDark: {
    backgroundColor: theme.palette.type === 'dark' ? darken(theme.palette.primary.dark, 0.5) : theme.palette.primary.main,
    '& $title': {
      color: theme.palette.grey[100],
    },
    '& $description': {
      color: theme.palette.grey[100],
    }
  },
  colorLight: {
    backgroundColor: theme.palette.type === 'dark' ? darken(theme.palette.primary.dark, 0.5) : theme.palette.primary.light,
    '& $title': {
      color: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.primary.dark,
    },
    '& $description': {
      color: theme.palette.text.primary,
    }
  },
  overflowX: {
    width: '100%',
    overflowX: 'auto',
  },
  iconTitle: {
    borderRadius: '50%',
    background: theme.palette.background.default,
    width: 48,
    height: 48,
    textAlign: 'center',
    // [theme.breakpoints.down('xs')]: {
    //   display: 'none'
    // },
    '& span': {
      width: '60%',
      height: '60%',
      verticalAlign: 'middle',
      color: theme.palette.type === 'dark' ? theme.palette.secondary.light : theme.palette.primary.main
    }
  },
  gridTitle:{
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    },
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'space-between'
    }
  }
});

export default styles;
