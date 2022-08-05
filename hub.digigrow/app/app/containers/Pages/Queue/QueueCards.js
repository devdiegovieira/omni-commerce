import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Grid, Icon, Paper, Typography } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import CardStats from '../../../components/Cards/Card';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { yellow } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  cardContainer: {
    margin: '0 -5px !important',
    width: 'unset'
  },
  card: {
    padding: '0 5px !important',
    marginBottom: 10
  }
}));

export default function QueueCards(props) {
  const classes = useStyles();

  const { filterData } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [cardData, setCardData] = useState({
    waiting: 0,
    error: 0,
    success: 0,
    yesterday: 0
  });



  useEffect(() => {

    promisseApi(
      'get',
      '/queue/status',
      setCardData,
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );

  }, [filterData]);

  return (
    <Grid container >

      <Grid xs={12}>

        <Grid container style={{ padding: 15 }}>


          <Grid item lg={4} md={4} xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ paddingTop: 10 }} >
                    <Grid container justifyContent='flex-start'>
                      <Icon style={{ color: yellow[600] }} >cached</Icon>
                      <Typography style={{ fontSize: 12, }} > Aguardando</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justifyContent='flex-end'>
                      <Typography style={{ fontSize: 40, fontWeight: 600 }}>{cardData.waiting.count}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item lg={3} md={3} xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ paddingTop: 10 }} >
                    <Grid container justifyContent='flex-start'>
                      <Icon style={{ color: 'red' }} >error_outline</Icon>
                      <Typography style={{ fontSize: 12 }} >Erros</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justifyContent='flex-end'>
                      <Typography style={{ fontSize: 40, fontWeight: 600 }}>{cardData.error.count}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>


          <Grid item xs={1}>
            <Divider orientation="vertical" />
          </Grid>

          <Grid item lg={3} md={3} xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ paddingTop: 10 }} >
                    <Grid container justifyContent='flex-start'>
                      <Icon style={{ color: 'green' }} >check_circle_outline_icon</Icon>
                      <Typography style={{ fontSize: 12 }} >Sucesso</Typography>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justifyContent='flex-end'>
                      <Typography style={{ fontSize: 40, fontWeight: 600 }}>{cardData.success.count}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

        </Grid>

      </Grid>

    </Grid>

  );
}
