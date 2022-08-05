import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip, Divider, Grid, Icon, Paper, Typography
} from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import { useSnackbar } from 'notistack';


export default function MoneyCards(props) {

  const { monthSelected, sellerId } = props;

  const [cardData, setCardData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [monthSelectedObj, setMonthSelectedObj] = useState({})



  useEffect(() => {
    getCardData();
  }, [monthSelected, sellerId]);

  const getCardData = () => {

    if (monthSelected || sellerId) {

      setMonthSelectedObj(JSON.parse(monthSelected));
      let parsedDate = (JSON.parse(monthSelected));
      let params = {};


      params.sellerId = sellerId
      params.day = parsedDate.day;
      params.year = parsedDate.year;
      params.month = parsedDate.month;
      params.paymentStatus = parsedDate.concluded ? ['concluded'] : ['pending', 'received'];

      promisseApi(
        'get',
        '/ordermoney/summary',
        (data) => {
          setCardData(data)
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        {},
        {
          params
        }
      )

    }
  }




  return (
    <Grid container spacing={2}>
      {Array.isArray(cardData) && cardData.map((m, i, arr) => {
        let left = m['concluded'] || m['received'];
        let pb = m['pb_concluded'] || m['pb_received'];

        return (

          <Grid item xs={12} >
            <Paper elevation={2} style={{ padding: 15 }}>

              <Grid container >

                {arr.length == 1 &&
                  <Grid item xs={12} md={5} lg={5}>
                    <Grid
                      container
                      alignItems="center"
                      style={{ height: '100%', marginLeft: 15 }}
                    >

                      <Avatar style={{ width: 100, height: 100 }} >
                        <img src={m.pic} />
                      </Avatar>
                      <Grid
                        item xs={'auto'}
                        style={{ marginLeft: 10 }}
                      >
                        <p style={{ fontSize: m.sellerName.length > 18 ? 25 : 35, paddingTop: 10, marginBottom: 0 }}>{m.sellerName}</p>

                        <Button
                          variant='contained'
                          size="small"
                          style={{ borderRadius: 5, fontSize: 8, backgroundColor: 'lightBlue', marginBottom: 10 }}
                          onClick={() => {
                            let filter = {
                              paymentStatus: monthSelectedObj.concluded ? 'concluded' : 'pending,received'
                            };

                            if (sellerId) filter.seller = sellerId;
                            if (monthSelectedObj.year) filter.year = monthSelectedObj.year;
                            if (monthSelectedObj.year) filter.month = monthSelectedObj.month;

                            window.location.href = `/money/list?${Object.keys(filter).map(m => `${m}=${filter[m]}`).join('&')}`;
                          }}
                        >
                          Detalhes
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                }

                <Grid item xs={12} md={arr.length == 1 ? 7 : 12} lg={arr.length == 1 ? 7 : 12}>
                  <Grid container justifyContent='space-between'>
                    {arr.length > 1 &&
                      <Grid item xs={2} md={1} lg={1} style={{ fontSize: 15, paddingBottom: 3 }} >
                        <Avatar> <img src={m.pic} /></Avatar>
                      </Grid>

                    }
                    {arr.length > 1 &&
                      <Grid item xs={10} md={3} lg={3} style={{ paddingTop: 10, fontSize: 15, paddingLeft: 5 }} >
                        <Typography >{m.sellerName}</Typography>
                      </Grid>
                    }

                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Chip
                          icon={<Icon style={{ fontSize: 15 }} >check</Icon>}
                          color="secondary"
                          label={JSON.parse(monthSelected).concluded ? 'Realizado' : 'Previsto Dia 1'}
                          style={{ fontSize: 13, marginTop: 5, marginBottom: 5, marginRight: 3 }}
                        />
                        {m['pending'] && m['pending'] &&
                          <Grid item  >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&

                      <Grid item xs={4} >
                        <Grid container justifyContent='flex-end'>

                          <Chip
                            icon={<Icon style={{ fontSize: 13 }}>check</Icon>}
                            color="gray"
                            label={'Sem Previsão'}
                            style={{ fontSize: 13, marginTop: 5, marginBottom: 5, marginRight: 3 }}
                          />
                        </Grid>
                      </Grid>}

                    <Grid item xs={12} >
                      <Divider />
                    </Grid>

                    <Grid item xs={4} >
                      <p style={{ paddingTop: 5, fontSize: 15 }}>Valor Bruto:</p>
                    </Grid>

                    {m && !m['pending'] &&
                      <Grid item xs={4} >

                      </Grid>}

                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p style={{ paddingTop: 5, marginBottom: 0, paddingRight: 5, fontSize: 15 }}> {((left && left.gross) || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                                </p>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p
                                  style={{ color: '#fd3e3e', marginRight: 5, marginBottom: 0, fontSize: 12 }}>
                                  {((pb && pb.gross) || 0).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                              </Grid>
                            </Grid>
                          </Grid>



                        </Grid>

                        {m && !m['concluded'] && m['pending'] &&
                          <Grid item >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&
                      <Grid item xs={4}  >
                        <Grid container justifyContent='flex-end' >
                          <p style={{ paddingTop: 5, paddingRight: 5, fontSize: 15 }}>  {(((m['pending'] && m['pending'].gross) || 0) + ((m['pb_pending'] && m['pb_pending'].gross) || 0)).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</p>
                        </Grid>
                      </Grid>
                    }

                    <Grid item xs={4}  >
                      <p style={{ paddingTop: 5, fontSize: 15 }}>Taxa Mercado Livre:</p>
                    </Grid>

                    {m && !m['pending'] &&
                      <Grid item xs={4} >

                      </Grid>}


                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p style={{ paddingTop: 5, marginBottom: 0, paddingRight: 5, fontSize: 15 }}> {(left && left.saleFee || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                                </p>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p
                                  style={{ color: '#fd3e3e', marginRight: 5, marginBottom: 0, fontSize: 12 }}>
                                  {((pb && pb.saleFee) || 0).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                              </Grid>
                            </Grid>
                          </Grid>



                        </Grid>

                        {m && !m['concluded'] && m['pending'] &&
                          <Grid item >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&
                      < Grid item xs={4} >
                        <Grid container justifyContent='flex-end' >
                          <p style={{ paddingTop: 5, paddingRight: 5, fontSize: 15 }}>  {(((m['pending'] && m['pending'].saleFee) || 0) + ((m['pb_pending'] && m['pb_pending'].saleFee) || 0)).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</p>
                        </Grid>
                      </Grid>
                    }

                    <Grid item xs={4} >
                      <p style={{ paddingTop: 5, fontSize: 15 }}>Taxa Frete:</p>
                    </Grid>
                    {m && !m['pending'] &&
                      <Grid item xs={4} >

                      </Grid>}


                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p style={{ paddingTop: 5, marginBottom: 0, paddingRight: 5, fontSize: 15 }}> {(left && left.freight || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                                </p>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p
                                  style={{ color: '#fd3e3e', marginRight: 5, marginBottom: 0, fontSize: 12 }}>
                                  {((pb && pb.freight) || 0).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                              </Grid>
                            </Grid>
                          </Grid>



                        </Grid>

                        {m && !m['concluded'] && m['pending'] &&
                          <Grid item >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&
                      <Grid item xs={4}>
                        <Grid container justifyContent='flex-end' >
                          <p style={{ paddingTop: 5, paddingRight: 5, fontSize: 15 }}> {(((m['pending'] && m['pending'].freight) || 0) + ((m['pb_pending'] && m['pb_pending'].freight) || 0)).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</p>
                        </Grid>
                      </Grid>
                    }

                    <Grid item xs={4} >
                      <p style={{ paddingTop: 5, fontSize: 15 }}>Taxa Digigrow:</p>
                    </Grid>

                    {m && !m['pending'] &&
                      <Grid item xs={4} >

                      </Grid>}


                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p style={{ paddingTop: 5, marginBottom: 0, paddingRight: 5, fontSize: 15 }}> {(left && left.digiFee || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                                </p>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p
                                  style={{ color: '#fd3e3e', marginRight: 5, marginBottom: 0, fontSize: 12 }}>
                                  {((pb && pb.digiFee) || 0).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </p>
                              </Grid>
                            </Grid>
                          </Grid>



                        </Grid>

                        {m && !m['concluded'] && m['pending'] &&
                          <Grid item >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&
                      <Grid item xs={4} >
                        <Grid container justifyContent='flex-end' >
                          <p style={{ paddingTop: 5, paddingRight: 5, fontSize: 15 }}>  {(((m['pending'] && m['pending'].digiFee) || 0) + ((m['pb_pending'] && m['pb_pending'].digiFee) || 0)).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</p>
                        </Grid>
                      </Grid>
                    }

                    <Grid item xs={12} >
                      <Divider />
                    </Grid>

                    <Grid item xs={4} >
                      <p style={{ paddingTop: 5, fontSize: 15 }}>Repasse:</p>
                    </Grid>

                    {m && !m['pending'] &&
                      <Grid item xs={4} >

                      </Grid>}


                    <Grid item xs={4} >
                      <Grid container justifyContent='flex-end' style={{ height: '100%' }}>
                        <Grid item>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justifyContent='flex-end'>
                                <p style={{ paddingTop: 5, marginBottom: 0, paddingRight: 5, fontSize: 15 }}> {(left && left.receivement + ((pb && pb.receivement) || 0) || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                                </p>
                              </Grid>
                            </Grid>
                            {/* <Grid item xs ={12}>
                            <Grid container justifyContent='flex-end'>
                              <p
                                style={{ color: '#fd3e3e', marginRight: 5, marginBottom: 0, fontSize: 9 }}>
                                {((pb && pb.receivement) || 0).toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                              </p>
                              </Grid>
                            </Grid> */}
                          </Grid>



                        </Grid>

                        {m && !m['concluded'] && m['pending'] &&
                          <Grid item >
                            <Divider orientation='vertical' />
                          </Grid>}

                      </Grid>
                    </Grid>

                    {m['pending'] &&
                      <Grid item xs={4} >
                        <Grid container justifyContent='flex-end' >
                          <p style={{ paddingTop: 5, paddingRight: 5, fontSize: 15 }}>  {(((m['pending'] && m['pending'].receivement) || 0) + ((m['pb_pending'] && m['pb_pending'].receivement) || 0)).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</p>
                        </Grid>
                      </Grid>
                    }


                  </Grid>

                </Grid>


              </Grid>
            </Paper>
          </Grid >
        )
      })}




    </Grid >


  );
}



