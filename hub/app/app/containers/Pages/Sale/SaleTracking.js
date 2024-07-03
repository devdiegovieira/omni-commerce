import React, { useState } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import StepConnector from '@material-ui/core/StepConnector';
import clsx from 'clsx';
import Check from '@material-ui/icons/Check';
import { StylesProvider } from '@material-ui/styles';

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#784af4',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#784af4',
    zIndex: 1,
    fontSize: 16,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
    </div>
  );
}

const QontoConnector = withStyles({
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
})(StepConnector);



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  labelContainer: {
    "& $alternativeLabel": {
      marginTop: 0
    }
  },
  alternativeLabel: {
    fontSize: 10
  },

}));

export default function CustomizedSteppers(props) {
  const { sale } = props;
  const classes = useStyles();
  const [statusList] = useState([
    { id: 'paid', title: 'Pago' },
    { id: 'invoiced', title: 'Faturado' },
    { id: 'shipped', title: 'Finalizado' },
    { id: 'cancelled', title: 'Cancelado' }
  ]);



  return (

    <div className={classes.root}>
      {/*   */}
      <Stepper alternativeLabel activeStep={statusList.findIndex(e => e.id == sale.status)} connector={<QontoConnector />} style={{ padding: 0 }}>
        {statusList && statusList.map(m => {

          let stepProps = {};
          if (m.id == 'cancelled' && sale.status == 'cancelled')
            stepProps.error = true;
          //  else stepProps.StepIconComponent={QontoStepIcon};

          return (
            <Step key={m.id}>
              <StepLabel {...stepProps} StepIconComponent={QontoStepIcon} classes={{
                alternativeLabel: classes.alternativeLabel,
                labelContainer: classes.labelContainer
              }} >{m.title}</StepLabel>
            </Step>
          )
        })}
      </Stepper>


    </div>
  );
}