import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Divider, Grid, Icon, Tooltip, Typography
} from '@material-ui/core';
import { promisseApi } from './../../../api/api';
import CardStats from '../../../components/Cards/Card';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';


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

export default function SaleCards(props) {
  const classes = useStyles();

  const { filterData } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [cardData, setCardData] = useState({
    today: 0,
    totalToday: 0,
    thisMonth: 0,
    yesterday: 0,
    lastMonth: 0,
    totalMonth: 0,
  });


  useEffect(() => {
    const localDateStart = new Date();
    localDateStart.setHours(0, 0, 0, 0);

    const localDateEnd = new Date();
    localDateEnd.setHours(23,59,59,999);

    promisseApi(
      'get',
      '/order/count',
      data => {
        const {
          today, yesterday, thisMonth, lastMonth, totalToday, totalMonth
        } = data;
        setCardData({
          today,
          totalToday,
          yesterday: (today / yesterday) - 1,
          thisMonth,
          totalMonth,
          lastMonth: (thisMonth / lastMonth) - 1
        });
      },
      (err)=> enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          localDateStart: localDateStart.toISOString(),
          localDateEnd: localDateEnd.toISOString()
        }
      }
    )

  }, [filterData]);


  const SaleCard = (props) => {
    let { value, quantity, label, color, icon } = props;

    return (

      <Grid container style={{ padding: 20 }}>

        <Grid item xs={3} style={{ marginTop: 20, marginBottom: 20 }} >
          <Icon style={{ color }} >{icon}</Icon>
          <Typography style={{ fontSize: 12, marginTop: 5 }} >{label}</Typography>
        </Grid>

        <Grid item xs={9} style={{ marginTop: 15 }}>
          <Grid container>
            <Grid item xs={12}>

              <Grid container justifyContent='flex-end'>
                <Typography style={{ fontSize: 25, fontWeight: 600 }}>
                  {(value ? value : 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </Typography>

              </Grid>
            </Grid>

            <Grid item xs={12}>

              <Grid container justifyContent='flex-end'>

                <Typography style={{ fontSize: 17, fontWeight: 600 }}>
                  {quantity ? quantity : 0}
                </Typography>

              </Grid>
            </Grid>
          </Grid>

        </Grid>

      </Grid>
    )
  }


  return (

    <Grid container spacing={2} >

      <Grid item lg={4} md={4} xs={12} >
        <SaleCard
          value={cardData.totalToday}
          quantity={cardData.today}
          label={'Total Hoje'}
          icon={'today'}
          color={'gold'}
        />

      </Grid>

      <Grid item lg={4} md={4} xs={12} >
        <SaleCard
          value={cardData.totalMonth}
          quantity={cardData.thisMonth}
          label={'Total Mês'}
          icon={'event_note'}
          color={'red'}
        />
      </Grid>

      <Grid item lg={4} md={4} xs={12}>
        <SaleCard
          value={filterData.totalFilter}
          quantity={filterData.total}
          label={'Total Filtro'}
          icon={'filter_list'}
          color={'green'}
        />
      </Grid>

    </Grid>


  );
}
