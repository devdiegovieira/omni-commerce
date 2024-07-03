import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Icon, Paper, Tooltip, Typography
} from '@material-ui/core';



export default function DashboardCards(props) {

  const { cardData } = props;

  const getStatusIcon = (status) => {
    let ret = {};
    switch (status) {
      case 'ORDER':
        ret.title = 'Pedidos';
        // // ret.color = 'black';
        ret.icon = 'loyalty';
        break;

      case 'SKU':
        ret.title = 'Produtos';
        // // ret.color = 'black';
        ret.icon = 'inventory_2';
        break;

      case 'cancelled':
        ret.title = 'Cancelado';
        ret.color = 'red';
        ret.icon = 'cancel';
        break;

      case 'QUESTIONS':
        ret.title = 'Questões';
        ret.color = 'red';
        ret.icon = 'help';
        break;

      case 'MESSAGES':
        ret.title = 'Mensagens';
        ret.color = 'red';
        ret.icon = 'forum';
        break;
    }

    return ret;
  }

  const DashCard = (props) => {

    let {
      title,
      subtitle,
      value,
      subValue,
      footer,
      icon,
      iconColor
    } = props;

    return (
      <Paper elevation={3} style={{ padding: 20 }} >

        <Grid container>

          <Grid item xs={12}>
            <Grid container>

              <Grid item xs={2}>
                <Icon style={{ color: iconColor, marginTop: 5 }} >{icon}</Icon>
              </Grid>

              <Grid item xs={10}>
                <Grid container justifyContent='flex-end'>
                  <Typography style={{ fontSize: 25, fontWeight: 600 }} align='right' >
                    {value}
                  </Typography>
                </Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container>

              <Grid item xs={4}>
                <Typography style={{ fontSize: 15 }}>
                  {title}
                </Typography>
              </Grid>

              <Grid item xs={8}>
                <Typography align='right' >
                  {subValue}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{ minHeight: 15 }}>
            <Typography style={{ fontSize: 10 }} >
              {subtitle}
            </Typography>
          </Grid>

          <Grid item xs={12} style={{ marginTop: 10, minHeight: 16 }} >
            {footer}
          </Grid>
        </Grid>
      </Paper >
    )
  }

  return (



    <Grid container spacing={2}>
      <Grid item lg={4} md={4} sm={6} xs={12} >
        <DashCard
          icon='add_shopping_cart'
          iconColor='lime'
          title='Vendas(mês)'
          subtitle='Quantidade de pedidos'
          value={(cardData.total.totalMonth ? cardData.total.totalMonth : 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
          subValue={cardData.total.thisMonth ? cardData.total.thisMonth : '0'}
          footer={(
            <Typography style={{ fontSize: 10 }} align='center' >
              <Icon style={{ color: cardData.total.lastMonth < 0 ? 'red' : 'green', fontSize: 12, paddingTop: 2 }}>
                {cardData.total.lastMonth < 0 ? 'arrow_downward' : 'arrow_upward'}
              </Icon>
              {
                `${(!cardData.total.lastMonth ? 0 : cardData.total.lastMonth).toLocaleString('pt-BR', {
                  style: 'percent',
                  minimumFractionDigits: 2
                })} Referencia: mês passado`
              }
            </Typography>
          )}
        />
      </Grid>


      <Grid item lg={4} md={4} sm={6} xs={12} >
        <DashCard
          icon='local_atm'
          iconColor='blue'
          title='Ticket Médio'
          subtitle='Mês atual'
          value={(cardData.total.salesale ? cardData.total.salesale : 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        />
      </Grid>

      <Grid item lg={4} md={4} sm={6} xs={12} >
        <DashCard
          icon='help'
          iconColor='yellow'
          title='Perguntas'
          subtitle='Hoje'
          value={cardData.total.questions ? cardData.total.questions : 0}
        />
      </Grid>

    </Grid >


  );
}
