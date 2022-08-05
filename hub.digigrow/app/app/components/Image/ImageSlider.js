import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 700,
    flexGrow: 1,
    // border:'1px solid grey',
    borderRadius:'9px',
    // backgroundColor:'rgba(240,248,255,0.2)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    marginTop: '10px',
    height:220,
    maxWidth: 350,
    overflow: 'hidden',
    display: 'block',
    width: 'auto',
    borderRadius: '10px',
  },
  imageContainer:{
    display:'flex',
    justifyContent:'center',
    marginBottom:'8px'
  }
}));

export default function TextMobileStepper(props) {
  let { imageList } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = imageList && imageList.length ? imageList.length : 0;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      {/* <Paper square elevation={0} className={classes.header}>
        <Typography>{imageList && imageList.length ? imageList[activeStep].label : 'Sem Imagens'}</Typography>
      </Paper> */}
      <div className={classes.imageContainer}>
        <img
          className={classes.img}
          src={imageList && imageList.length ? imageList[activeStep].imgPath : ''}
          alt={imageList && imageList.length ? imageList[activeStep].label : ''}
        />
      </div>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="text"
        activeStep={activeStep}
        style={{
          // backgroundColor:'rgba(0,0,0,0.0)',
          height:'35px',
          borderRadius:'20px'
        }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} style={{
            color:'grey',
          }}>
            Próximo
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}  style={{
            color:'grey'}}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Anterior
          </Button>
        }
      />
    </div>
  );
}