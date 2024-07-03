import React, { useEffect, useState } from 'react';
import { PaperBlock } from 'digi-components';
import DailySalesChart from './DailySalesChart';
import SellerList from './SellerList';
import { Grid, Paper, Switch, Typography, Button, Dialog, useMediaQuery, useTheme, AppBar, Icon, colors, fontColors } from '@material-ui/core';
import DashboardCards from './DashboardCards';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import { makeStyles } from '@material-ui/core/styles';
import { promisseApi } from '../../../api/api';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import backImage from 'digi-images/banner-cadastro.png';

const useStyles = makeStyles((theme) => ({
  sellerList: {
    height: 250
  },
  appBar: {
    position: 'relative',
    paddingRight: 0
  },
}));

let timerControl = true;

function DashboardPage() {
  const [chartMoney, setChartMoney] = useState(false);
  const [newUser, setNewUser] = useState(true);
  const title = brand.name + ' - Dashboard';
  const classes = useStyles();
  const description = brand.desc;
  const { enqueueSnackbar } = useSnackbar();

  const [chartData, setChartData] = useState([]);
  const [cardData, setCardData] = useState({
    waiting: {
      count: 0,
      byOps: []
    },
    error: {
      count: 0,
      byOps: []
    },
    success: {
      count: 0,
      byOps: []
    },
    total: {
      today: 0,
      thisMonth: 0,
      yesterday: 0,
      lastMonth: 0,
      totalMont: 0,
      ticket: 0,
      questions: 0,
      salesale: 0
    }
  });
  const [listData, setListData] = useState([]);

  const [autoReload, setAutoReaload] = useState(true);
  const fullScreen = useMediaQuery



  const getDashData = () => {

    let date = new Date();
    let startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    // Chart
    promisseApi(
      'get',
      '/dashboard/dailyOrders',
      (data) => {
        setChartData({
          row1: chartMoney ? 'moneyLast' : 'qtyLast',
          row2: chartMoney ? 'money' : 'qty',
          data
        })
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          startDate,
          endDate
        }
      }
    )

    //Cards
    const localDateStart = new Date();
    localDateStart.setHours(0, 0, 0, 0);

    const localDateEnd = new Date();
    localDateEnd.setHours(23, 59, 59, 999);

    //Cards
    promisseApi(
      'get',
      '/order/count',
      data => {
        const {
          today, yesterday, thisMonth, lastMonth, totalMonth, ticket, questions
        } = data;
        setCardData({
          total: {
            today,
            yesterday: (today / yesterday) - 1,
            thisMonth,
            lastMonth: (thisMonth / lastMonth) - 1,
            totalMonth,
            ticket,
            questions,
            salesale: (totalMonth / thisMonth),
          }
        });
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          localDateStart,
          localDateEnd
        }
      }
    );
    //SellerLIST
    promisseApi(
      'get',
      '/dashboard/sellerOrders',
      (data) => {
        setListData(data)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          startDate,
          endDate
        }
      }
    )
  }



  useEffect(() => {
    let isNew = localStorage.getItem('hasSellers') == 'true';
    setNewUser(isNew)

    if (isNew) {
      getDashData();

      let interval = setInterval(() => {
        if (timerControl) {
          getDashData();
        }
      }, 60000);

      return () => {
        clearInterval(interval)
      }

    }
  }, [])

  useEffect(() => {
    setChartData({
      ...chartData,
      row1: chartMoney ? 'moneyLast' : 'qtyLast',
      row2: chartMoney ? 'money' : 'qty',
    });
  }, [chartMoney])

  return (

    <>
      {!newUser ?
        <Dialog
          maxWidth='md'
          open={true}
          onClose={() => {
            setOpenDialog(false)
            setButtonSaveLoading(false)
            resetForm()
          }}>

          <Grid container>
            <Grid item xs={6} style={{
              marginTop: 100,
            }}>

              <Grid container spacing={2}>
                <Grid item xs={12} style={{ padding: 50, paddingTop: 0 }}>
                  <p style={{
                    fontSize: 35,
                    fontWeight: 800,
                    color: '#4b05af'
                  }}>
                    <b>
                      SEJA BEM VINDO(A)
                    </b>
                  </p>

                  <p style={{
                    fontSize: 15,
                    fontWeight: 250
                  }}>Notamos que este é seu primeiro login ou que ainda não possui nenhuma empresa cadastrada.</p>
                  <p style={{

                    fontSize: 15,
                    fontWeight: 250
                  }}>Para saber como cadastrar sua empresa e começar a anunciar seus produtos, assista o tutorial em vídeo ou clique no botão "Cadastre sua empresa" logo abaixo.</p>

                </Grid>


                <Grid item xs={12} style={{ padding: 50, paddingTop: 0 }}>

                  <Button
                    type='submit'
                    style={{ marginRight: 5, height: 27, fontSize: 10 }}
                    variant="outlined"
                    color="primary"
                    size="large"
                    name="sendMail"
                    disabled={false}
                  >
                    <Icon style={{ marginLeft: 5, fontSize: 17 }} className={classes.icon}>play_arrow</Icon>
                    Assista ao tutorial

                  </Button>

                  ou

                  <Button
                    type='submit'
                    style={{ marginLeft: 5, height: 27, fontSize: 10 }}
                    variant="contained"
                    color="primary"
                    size="large"
                    name="sendMail"
                    disabled={false}
                    onClick={() => window.location.pathname = '/seller/new'}
                  >Cadastre sua empresa
                    <Icon style={{ marginLeft: 5, fontSize: 17 }} className={classes.icon}>arrow_forward</Icon>
                  </Button>


                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={6} >
              <img src={backImage} />

            </Grid>
          </Grid>

        </Dialog>
        :

        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
          </Helmet>


          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                  <div>
                    <p>
                      Recarregamento automático de página
                    </p>
                  </div>
                  <Grid item>

                    <Switch
                      label="refreshPage"
                      name="refreshPage"
                      checked={autoReload}
                      value={autoReload}
                      onChange={(e) => {
                        timerControl = !timerControl;
                        setAutoReaload(!autoReload)
                      }}
                    />

                  </Grid>
                </div>
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                  <Typography style={{ fontSize: 15, fontWeight: 600 }} >
                    Domine o HUB
                  </Typography>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12} >
                    <Paper style={{ borderRadius: '5px', overflow: 'hidden' }} elevation={3} >
                      <img src='https://user-images.githubusercontent.com/96067339/165374085-5ce84f2a-49ef-4fc4-bb66-fe6c1b26fa30.png' />
                    </Paper>
                  </Grid>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12} >
                    <Paper style={{ borderRadius: '5px', overflow: 'hidden' }} elevation={3} >
                      <img src='https://user-images.githubusercontent.com/96067339/165374089-00913ba2-5d0b-4ebd-a600-1c2f4b3756d0.png' />
                    </Paper>
                  </Grid>

                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12} >
                    <Typography style={{ fontSize: 15, fontWeight: 600 }} >
                      Resumo
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <DashboardCards
                cardData={cardData}
              />
            </Grid>
            <Grid item xl={8} lg={8} md={8} sm={8} xs={12} >
              <PaperBlock
                elevation={3}
                title="Vendas Por Dia"
                // icon="insights"
                desc="Mês passado X Mês atual"
                overflowX
                tooltipTitle={(
                  <Grid component="label" container alignItems="center" justifyContent='center' spacing={1} >
                    <Grid item>Quantidade</Grid>
                    <Grid item>

                      <Switch checked={chartMoney} onChange={(e) => { setChartMoney(e.target.checked) }} name="chartMoney" />

                    </Grid>
                    <Grid item>Valor</Grid>
                  </Grid>
                )}
              >
                <div>
                  <DailySalesChart chartData={chartData} />

                </div>
              </PaperBlock>
            </Grid>

            <Grid item xl={4} lg={4} md={4} sm={4} xs={12} >
              <PaperBlock
                elevation={3}
                title="vendas por empresa"
                // icon="equalizer"
                desc="Este mês"
                overflowX
              >
                <div className={classes.sellerList}>
                  <SellerList listData={listData} />
                </div>
              </PaperBlock>
            </Grid>
          </Grid>
        </div>
      }

    </>



  );
}

export default DashboardPage;
