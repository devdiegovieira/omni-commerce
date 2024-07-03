import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { api } from '../../../api/api';
import { Box, Grid, Icon, Tooltip } from "@material-ui/core";
import CardStats from "../../../components/Cards/Card";



const useStyles = makeStyles((theme) => ({
  cardContainer: {
    margin: "0 -5px !important",
    width: "unset"
  },
  card: {
    padding: "0 5px !important",
    marginBottom: 10
  }
}));

export default function SaleCards(props) {
  const classes = useStyles();

  let { filterData } = props;

  const [cardData, setCardData] = useState({
    today:0,
    thisMonth:0,
    yesterday: 0,
    lastMonth: 0
  });


  useEffect(() => {
    let localDateStart = new Date();
    localDateStart.setHours(0,0,0,0);
    
    let localDateEnd = new Date();
    // localDateEnd.setHours(23,59,59,999);
    
    api.get( 
      '/order/count',
      {
        params: {
          localDateStart,
          localDateEnd
        }
      }
    ).then(
      data => {
        let{ today, yesterday, thisMonth, lastMonth } = data.data;
        setCardData({
          today, 
          yesterday: (today / yesterday) - 1, 
          thisMonth, 
          lastMonth: (thisMonth / lastMonth) - 1
        })
        // data.data

        // setCardData
      }
    ).catch(
    
      enqueueSnackbar(error)
      
    )
  }, [filterData.total]);

  return (
    <Grid container className={classes.cardContainer}>
      <Grid item xl={4} lg={4} md={4} sm={4} xs={12} className={classes.card}>
        <CardStats
          subtitle="Total Hoje"
          title={cardData.today}
          icon="calendar_today"
          footerIcon={cardData.yesterday < 0 ? 'arrow_downward' : cardData.yesterday > 0 ? 'arrow_upward' : ''}
          footerColor={cardData.yesterday < 0 ? 'red' :  cardData.yesterday > 0 ? 'lime' : ''}
          footerTitle={
            cardData.yesterday.toLocaleString('pt-BR', {
              style: 'percent',
              minimumFractionDigits: 2
            })
          }
          footerSubtitle={`Ref. ontem (mesmo horário)`}
          color={'green'}
        />
      </Grid>

      <Grid item xl={4} lg={4} md={4} sm={4} xs={12} className={classes.card}>
        <CardStats
          subtitle="Total Mês"
          title={cardData.thisMonth}
          icon="calendar_view_month"
          footerIcon={cardData.lastMonth < 0 ? 'arrow_downward' : cardData.lastMonth > 0 ? 'arrow_upward' : ''}
          footerColor={cardData.lastMonth < 0 ? 'red' :  cardData.lastMonth > 0 ? 'lime' : ''}

          footerTitle={
            cardData.lastMonth.toLocaleString('pt-BR', {
              style: 'percent',
              minimumFractionDigits: 2
            })
          }
          footerSubtitle="Ref. mês anterior (mesmo dia e horário)"
          color={'purple'}
        />
      </Grid>

      <Grid item xl={4} lg={4} md={4} sm={4} xs={12} className={classes.card}>
        <CardStats
          subtitle="Total Filtro"
          title={filterData.total}
          icon="filter_list"
          color={'orange'}
          footer={(
            <Box
              component="p"
              fontSize=".875rem"
              marginTop="1rem"
              marginBottom="0"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
            >
              {filterData.totalStatus && filterData.totalStatus.map(m => {
                let status = {};
                switch (m._id) {
                  case 'paid':
                    status.title = 'Pago';
                    status.color = 'lime';
                    status.icon = 'price_check';
                    break;

                  case 'invoiced':
                    status.title = 'Faturado';
                    status.color = 'blue';
                    status.icon = 'receipt';
                    break;

                  case 'cancelled':
                    status.title = 'Cancelado';
                    status.color = 'red';
                    status.icon = 'cancel';
                    break;
                      
                  case 'shipped':
                    status.title = 'Finalizado';
                    status.color = 'gray';
                    status.icon = 'check_circle';
                    break;
                        
                } 

                return (
                  <>
                    <Tooltip title={status.title}>
                      <Icon style={{color:status.color}}>{status.icon}</Icon>
                    </Tooltip>
                    <Box 
                      component="span" 
                      whiteSpace="nowrap"
                      // fontWeight="1000!important"
                      marginLeft="0.2rem"
                      marginRight="1.5rem"
                    >
                      {m.count}
                    </Box>  
                  </>
                )
              })}
               
            
            </Box>          
          )}
        />
      </Grid>

      {/* <Grid item xl={3} lg={3} xs={12} className={classes.card}>
        <CardStats
          subtitle="Valor (Este Mês)"
          title={gridState.total}
          icon="attach_money"
          color={purple[600]}
        />
      </Grid> */}
    </Grid>

  );
  
}
