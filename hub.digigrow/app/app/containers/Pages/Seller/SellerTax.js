import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Chip, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1,
    padding: 10,
  },
  appBar: {
    position: 'relative',
    paddingRight: 0
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  grid: {
    padding: 10,
    paddingTop: 0
  },
  grid2: {
    padding: 10,
    paddingTop: 15
  },
  saveProgress: {
    color: green[500],
    position: 'absolute',
    top: -26,
    left: -23,
    zIndex: 1,
  },
  saveButton: {
    position: 'absolute',
    top: -14,
    left: -10,
    zIndex: 1,
  },
  wrapper: {
    position: 'relative',
  },
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#58F808'
  },


}));

export default function SellerTax(props) {
  const theme = useTheme();
  const classes = useStyles();

  const {
    values, errors, setButtonSaveLoading, handleInputChange, handleSubmit
  } = props;


  const [seller, setSeller] = useState({});


  return (
    <>


      <Paper>
        <Grid container className={classes.gridContainer} style={{ padding: 15 }}  >
          <Grid item lg={12} sm={12} xs={12} className={classes.grid}>
            <Grid container justifyContent="center" spacing={2} >


              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent='flex-start' >
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <p>Dados Tributários</p>
                  </Grid>

                  <Grid item xs={12} >
                    <Divider />
                  </Grid>


                  <Grid item xs={6} >
                    <Controls.Input
                      name="ie"
                      label="Inscrição Estadual"
                      onChange={handleInputChange}
                      value={values.ie}
                      error={errors.ie}
                      mask="999.999.999.999"
                    />
                  </Grid>
                  <Grid item xs={6} >
                  </Grid>
                  <Grid item xs={6} >
                    <Controls.Select
                      name="taxRegime"
                      label="Regime Tributário"
                      onChange={handleInputChange}
                      value={values.taxRegime}
                      error={errors.taxRegime}
                      options={[{ id: 'SN', title: 'Simples Nacional' },
                      { id: 'LP', title: 'Lucro Presumido' },
                      { id: 'LR', title: 'Lucro Real' },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={6} >
                  </Grid>



                </Grid>
              </Grid>


            </Grid>
          </Grid>
        </Grid>
      </Paper>



    </>
  );
}
