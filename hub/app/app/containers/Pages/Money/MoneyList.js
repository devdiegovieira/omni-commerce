import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import {
  Chip,
  CircularProgress, Divider, Grid, Tooltip, Typography
} from '@material-ui/core';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';

import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import AddButtonToolbar from 'digi-components/DataGrid/addButtonToolbar';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import Icon from '@material-ui/core/Icon';
import MoneyFilter from './MoneyFilter';
import { promisseApi } from '../../../api/api';
import { useSnackbar } from 'notistack';
import MoneyActions from './MoneyActions';
import { useHistory } from "react-router-dom";
import ButtonDefault from '../../../components/Button/ButtonDefault';

function MoneyList(props) {

  const { intl, seller } = props;
  const [gridData, setGridData] = useState([]);
  const [moneyList, setMoneyList] = useState([]);
  const [total, setTotal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clearIsLoading, setClearIsLoading] = useState(false);
  const [months, setMonths] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    totalStatus: [],
    ...JSON.parse(localStorage.getItem('moneyState'))
  });



  let filter = {
    limit: 25,
    offset: 0,
    // dateFrom: new Date(),
    // dateTo: new Date(),
    // paymentStatus: ['pending', 'received'],
    // ...JSON.parse(localStorage.getItem('moneyFilter'))
  }

  useEffect(() => {


    promisseApi(
      'get',
      `/ordermoney/concludMonts`,
      (data) => {
        setMonths([...data.map(m => {
          return {
            day: m._id.day,
            month: m._id.month,
            year: m._id.year,
            value: m.concludedValue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            concluded: true
          }
        }), { concluded: false, checked: true }])

        setFilter({ monthSelected: JSON.stringify({ concluded: false, checked: true }) })
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })

    )



  }, []);


  const params = new URL(location.href).searchParams;

  if (params.get('seller')) filter.sellerId = [params.get('seller')];
  if (params.get('paymentStatus')) filter.paymentStatus = params.get('paymentStatus').split(',');
  if (params.get('month') && params.get('year')) {
    filter.dateFrom = new Date(params.get('year'), params.get('month') - 1, 1);
    filter.dateTo = new Date(params.get('year'), params.get('month'), 0);
  }
  const [gridFilter, setGridFilter] = useState(filter);

  const handleError = (error) => {
    setIsLoading(false);
    handleError(error)
  }

  const handleRefreshClick = () => {
    getGridData();
  };

  const handleClickOpen = (data, e) => {
    window.open(`/sale/general/${data}`);
  }

  const getGridData = () => {

    setGridData([]);


    let dateFrom;
    if (gridFilter.dateFrom) {
      dateFrom = new Date(gridFilter.dateFrom);
      dateFrom.setHours(0, 0, 0, 0);
    }
    let dateTo;
    if (gridFilter.dateTo) {
      dateTo = new Date(gridFilter.dateTo);
      dateTo.setHours(23, 59, 59, 999);
    }


    promisseApi(
      'get',
      '/ordermoney/',
      (data) => {
        setMoneyList(data.list)
        setTotal(data.total)
        setIsLoading(false)
        setClearIsLoading(false);
      },

      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: { ...gridFilter, dateFrom, dateTo }
      }
    );
  };


  useEffect(() => {
    getGridData();
  }, [gridFilter]);

  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage });
      localStorage.setItem('moneyState', JSON.stringify({ page: tableState.page, total: gridFilter.total ? gridFilter.total : 0, rowsPerPage: tableState.rowsPerPage }));
    }
  };

  const gridColumns = [
    {
      name: 'orderId',
      label: 'Venda',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];

          return (
            <>

              <b style={{ fontSize: 18 }}>

                {data.orderId &&
                  (
                      <Chip
                        // style={{ width: 200, fontSize: 15 }}
                        icon={<LoyaltyIcon style={{ fontSize: 14 }} />}
                        label={data.orderId}
                        onClick={() => handleClickOpen(data.orderId)}

                      />
                  )
                }
              </b>
            </>
          );
        },
        display: true,
        sort: false,
      }
    },


    {
      name: 'paymentStatus',
      label: 'Status',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          let status = '';

          switch (data.paymentStatus) {
            case 'Pendente':
              status = 'Sem previsão';
              break;
            case 'Recebido':
              status = 'Previsto';
              break;
            case 'Concluído':
              status = 'Fechamento anterior';
              break;
          }
          return (
            <>

              <Typography noWrap style={{ position: 'relative', fontSize: 15 }}>{status}
              {data.payBack && <Tooltip noWrap title={'Transação de estorno - Venda cancelada.'}><Icon style={{ color: 'rgba(255,90,40,1)', fontSize: 14, marginLeft: 10 }}>cancel</Icon></Tooltip>}</Typography>

            </>
          )
        }
      }
    },
    {
      name: 'sellerId',
      label: 'Seller',
      options: {
        display: false,
        sort: false,
      }
    },
    {
      name: 'total',
      label: 'Valor total',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap icon={''} style={{ marginBottom: 0, color: data.gross < 0 ? 'rgba(255,90,40,1)' : 'inherit', fontSize: 15 }}>{data.gross.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              }</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'saleFee',
      label: 'Taxa ML',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, color: data.saleFee < 0 ? 'rgba(255,90,40,1)' : 'inherit', fontSize: 15 }}>{data.saleFee.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              }</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'freight',
      label: 'Frete',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, color: data.freight < 0 ? 'rgba(255,90,40,1)' : 'inherit', fontSize: 15 }}>{data.freight.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              }</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'digiFee',
      label: 'Taxa Digi',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, color: data.digiFee < 0 ? 'rgba(255,90,40,1)' : 'inherit', fontSize: 15 }}>{data.digiFee.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              }</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'receivement',
      label: 'Valor Líquido',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, color: data.receivement < 0 ? 'rgba(255,90,40,1)' : 'inherit', fontSize: 15 }}>{data.receivement.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })
              }</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'newTansactionDate',
      label: 'Data',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, fontSize: 15 }}>{data.newTansactionDate}</Typography>

            </>
          );
        }
      }
    },
    {
      name: 'newCreatedAt',
      label: 'Data Transação',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Tooltip title={`Horário:  ${data.createdAt}`}>
                <Typography noWrap style={{ marginBottom: 0, fontSize: 15 }}>{data.newCreatedAt}</Typography>
              </Tooltip>
            </>
          );
        }
      }
    },
    {
      name: 'sellerName',
      label: 'Empresa',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = moneyList[dataIndex];
          return (
            <>
              <Typography noWrap style={{ marginBottom: 0, fontSize: 15 }}>{data.sellerName}</Typography>

            </>
          );
        }
      }
    },

  ];

  const gridOptins = {
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    page: gridState.page,
    rowsPerPageOptions: [25, 50, 100],
    count: total,
    filter: false,
    search: false,
    print: false,
    download: false,
    jumpToPage: true,
    textLabels: dataGridTexts(intl),
    responsive: 'simple',
    selectableRowsHideCheckboxes: true,
    viewColumns: false,
    customToolbar: () => (
      <Grid container spacing={2} justifyContent='flex-end'>
        <Grid item lg={'auto'} xs={6} >
          <ButtonDefault
            onClick={handleRefreshClick}
            icon="refresh"
            label="Atualizar" />
        </Grid>
        <Grid item lg={'auto'} xs={5} style={{ marginTop: -10, marginRight: 18 }} >
          <MoneyActions months={months} />
        </Grid>
      </Grid>

    ),
    onTableChange: handleGridState,
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} >

        <Grid container style={{ padding: 10 }} justifyContent='center'>

          <Grid item xs={12}>
            <MoneyFilter filter={gridFilter} setFilter={setGridFilter} isLoading={isLoading} setIsLoading={setIsLoading} clearIsLoading={clearIsLoading} setClearIsLoading={setClearIsLoading} />
          </Grid>

        </Grid>

        <Grid item xs={12} >
          <Divider />
        </Grid>

        <Grid item xs={12} >
          <MUIDataTable
            data={moneyList}
            columns={gridColumns}
            options={gridOptins}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default injectIntl(MoneyList);
