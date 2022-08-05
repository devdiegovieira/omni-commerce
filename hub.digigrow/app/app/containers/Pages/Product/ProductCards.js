import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Icon, Tooltip } from '@material-ui/core';
import { api } from '../../../api/api';
import CardStats from '../../../components/Cards/Card'
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

export default function ProductCards(props) {
  const classes = useStyles();

  const { filterData } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [cardData, setCardData] = useState({
    today: 0,
    thisMonth: 0,
    yesterday: 0,
    lastMonth: 0
  });


  useEffect(() => {
    const localDateStart = new Date();
    localDateStart.setHours(0, 0, 0, 0);

    const localDateEnd = new Date();
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
        const {
          today, yesterday, thisMonth, lastMonth
        } = data.data;
        setCardData({
          today,
          yesterday: (today / yesterday) - 1,
          thisMonth,
          lastMonth: (thisMonth / lastMonth) - 1
        });

      }
    ).catch(
      error => {
        enqueueSnackbar({ message: error.response ? error.response.data : error.message ? error.message : JSON.stringify(error), variant: 'error' });
      }
    );
  }, [filterData.total]);

  return (
    <Grid container justifyContent='flex-end'>
    
    {/* <Button subtitle="Total Filtro"> */}
          <CardStats
            subtitle="Upload por planilha"
            title={filterData.total}
            icon="file_upload"
            color="orange"
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
                  const status = {};
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
                        <Icon style={{ color: status.color }}>{status.icon}</Icon>
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
                  );
                })}


              </Box>
            )}
          />

        {/* </Button> */}
        {/* <Button subtitle="Total Filtro"> */}
          <CardStats
            subtitle="Download do Log"
            title={filterData.total}
            icon="download"
            color="Red"
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
                  const status = {};
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
                        <Icon style={{ color: status.color }}>{status.icon}</Icon>
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
                  );
                })}


              </Box>
            )}
          />
        {/* </Button> */}
    </Grid>

  );
}
