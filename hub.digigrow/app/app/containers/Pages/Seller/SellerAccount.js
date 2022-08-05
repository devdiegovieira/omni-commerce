import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Chip, Divider, Grid, Paper, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { green } from '@material-ui/core/colors';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { api, promisseApi } from '../../../api/api';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';


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

export default function SellerAccount(props) {
  const theme = useTheme();
  const classes = useStyles();


  const {
    values, errors, setButtonSaveLoading, handleInputChange, handleSubmit
  } = props;

  const { enqueueSnackbar } = useSnackbar();

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

                  <Grid item xs={9} >
                    <Controls.Input
                      name="bank"
                      label="Banco"
                      onChange={handleInputChange}
                      value={values.bank}
                      error={errors.bank}

                    />
                  </Grid>
                  <Grid item xs={3} >
                  </Grid>
                  <Grid item xs={3} >
                    <Controls.Input
                      name="agency"
                      label="Agência"
                      type="number"
                      onChange={handleInputChange}
                      value={values.agency}
                      error={errors.agency}

                    />
                  </Grid>
                  <Grid item xs={3} >
                    <Controls.Input
                      name="account"
                      type="number"
                      label="Conta"
                      onChange={handleInputChange}
                      value={values.account}
                      error={errors.account}

                    />
                  </Grid>
                  <Grid item xs={3} >

                    <Controls.Select
                      name="accountType"
                      label="Tipo de conta"
                      onChange={handleInputChange}
                      value={values.accountType}
                      error={errors.accountType}
                      options={[{ id: 'POUPANÇA', title: 'Conta poupança' },
                      { id: 'SALARIO', title: 'Conta salário' },
                      { id: 'DIGITAL', title: 'Conta digital' },
                      { id: 'CORRENTE', title: 'Conta corrente' }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={3} >
                  </Grid>



                  <Grid item xs={12} >
                    <Typography>
                      Aviso
                    </Typography>
                    <Typography>
                      O repasse sempre será feito nos dias 05 e 20 de cada mês.
                    </Typography>
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
