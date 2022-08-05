import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import GetAppIcon from '@material-ui/icons/GetApp';
import {
  Button,
  CircularProgress, Divider, Grid, IconButton, Paper, Tooltip
} from '@material-ui/core';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import brand from 'digi-api/dummy/brand';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import meli from 'digi-images/logoMeli25.png';
import SaleFilter from './SaleFilter';
import SellerSelectToolbar from './SaleSelectToolbar';
import { promisseApi } from '../../../api/api';
import SaleCards from './SaleCards';
import { useHistory } from 'react-router-dom';
import SaleDetail from './SaleDetail';
import { SaleLabel } from './SaleLabel';
import { createWorkSheet, writeXLSX } from '../../../utils/xlsx';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { chunkArray } from '../../../../../lib/util/javaScript';
import RefreshIcon from '@material-ui/icons/Refresh';
import ButtonDefault from '../../../components/Button/ButtonDefault';

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: '0 15px !important',
  },
  gridContainer: {
    margin: '0 -15px !important',
    width: 'unset'
  },
  downloadProgress: {
    color: 'primary',
    marginLeft: -42,
    position: 'relative',
    top: 14
  },
}));


function SalePage(props) {

  let paths = props.property.location.pathname.split('/');
  const [orderId, setOrderId] = useState(paths.length > 2 && paths[2] ? paths[2] : undefined);

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths != orderId) setOrderId(paths);

  const classes = useStyles();
  const title = `Vendas - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearIsLoading, setClearIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // const [open, setOpen] = useState(false);
  // const [sellerId, setSellerId] = useState(null);
  const handleClickOpen = (data, props) => {
    history.push(`${props.location.pathname}/${data.orderId}`);
    // setPublishId(data.publishId);
  }

  const [orderLabel, setOrderLabel] = useState();
  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    totalStatus: []
  });

  const [gridFilter, setGridFilter] = useState({
    limit: 25,
    offset: 0,
    total: 0,
    dateClosedFrom: new Date(),
    dateClosedTo: new Date()
  });

  const handleDownloadReport = () => {
    setIsDownloading(true);

    let dateClosedFrom;
    if (gridFilter.dateClosedFrom) {
      dateClosedFrom = new Date(gridFilter.dateClosedFrom);
      dateClosedFrom.setHours(0, 0, 0, 0);
    }
    let dateClosedTo;
    if (gridFilter.dateClosedTo) {
      dateClosedTo = new Date(gridFilter.dateClosedTo);
      dateClosedTo.setHours(23, 59, 59, 999);
    }

    promisseApi(
      'get',
      '/order/report',
      (data) => {
        let chunks = chunkArray(data, 20000);

        let workSheets = [];

        for (let items of chunks) {
          let index = chunks.indexOf(items);
          let result = createWorkSheet(items ? items : [], `Vendas-${index}`)
          workSheets.push(result)
        }

        writeXLSX('RelatorioVendas.xlsx', workSheets);
        setIsDownloading(false);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      { params: { ...gridFilter, dateClosedFrom: dateClosedFrom.toISOString(), dateClosedTo: dateClosedTo.toISOString() } }
    )
  };

  const handleRefreshClick = () => {
    getGridData(gridFilter);
  };

  const getGridData = (gridFilter) => {
    let dateClosedFrom;
    if (gridFilter.dateClosedFrom) {
      dateClosedFrom = new Date(gridFilter.dateClosedFrom);
      dateClosedFrom.setHours(0, 0, 0, 0);
    }
    let dateClosedTo;
    if (gridFilter.dateClosedTo) {
      dateClosedTo = new Date(gridFilter.dateClosedTo);
      dateClosedTo.setHours(23, 59, 59, 999);
    }

   
    setGridData([]);

    promisseApi(
      'get',
      '/order/list',
      data => {
        setGridState({ ...gridState, total: data.total, totalStatus: data.totalStatus, note: data.note, totalFilter: data.totalFilter });
        setGridData(data.items.map(m => ({
          ...m,
          dateClosed: new Date(m.dateClosed).toLocaleString(),
          freight: m.freightSeller ? m.freightSeller.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }) : 'R$ 0',
          total: m.gross ? m.gross.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }) : 0,
        })));
        setIsLoading(false);
        setClearIsLoading(false);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          ...gridFilter,
          dateClosedFrom,
          dateClosedTo
        }
      }
    )

  };

  useEffect(() => {
    getGridData(gridFilter);
  }, [gridFilter]);

  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage });
    }
  };


  const gridColumns = [
    {
      name: 'items',
      label: 'Skus',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex].items;

          return (
            <AvatarGroup spacing="small" max={3}>
              {value.map((val, key) => (
                <Tooltip title={`${val.sku} - ${val.title}`}>
                  <Avatar alt={val.sku} src={val.userImage}>
                    {val.sku ? val.sku.charAt(0) : ''}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          );
        },
      }
    },
    {
      name: '_id',
      label: 'Id',
      options: {
        display: false,
        sort: false,

      }
    },
    {
      name: 'orderId',
      label: 'Venda',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = gridData[dataIndex];
          return (
            <>
              <b style={{ position: 'relative' }}>{data.orderId}</b>
              <br />
            </>
          );
        }
      }
    },
    {
      name: 'marketPlaceName',
      label: 'Conta',
      options: {
        sort: false,
        display: false,
      }
    },
    {
      name: 'sellerCode',
      label: 'Empresa',
      options: {
        sort: false,
      }
    },
    {
      name: 'name',
      label: 'Comprador',
      options: {
        display: false,
        sort: false
      }
    },
    {
      name: 'document',
      label: 'Documento',
      options: {
        display: false,
        sort: false
      }
    },
    {
      name: 'dateClosed',
      label: 'Data Venda',
      options: {
        sort: false
      }
    },
    {
      name: 'freight',
      label: 'Frete',
      options: {
        sort: false
      }
    },
    {
      name: 'total',
      label: 'Total',
      options: {
        sort: false
      }
    },
    {
      name: '',
      label: ' ',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = gridData[dataIndex];

          let icon;
          let style;

          switch (data.status) {
            case 'Pago':
              icon = 'price_check';
              style = { color: 'lime' };
              break;
            case 'Cancelado':
              icon = 'cancel';
              style = { color: 'red' };

              break;
            case 'Faturado':
              icon = 'receipt';
              style = { color: 'blue' };
              break;
          }

          return (
            <Grid container justifyContent='flex-end'>
              {
                data.marketPlaceOficial

                && (
                  <IconButton
                    size="small"
                  >
                    <Tooltip title="Conta Oficial Digigrow">
                      <Icon
                        fontSize="small"
                        color="primary"
                      >
                        military_tech
                      </Icon>
                    </Tooltip>
                  </IconButton>
                )


              }

              <IconButton
                disabled={!data.note}
                size="small"
              >
                <Tooltip title="Tem observação">
                  <Icon fontSize="small">message</Icon>
                </Tooltip>
              </IconButton>

              <IconButton
                disabled={!data.label}
                size="small"
                onClick={() => setOrderLabel({ ...data })}
              >
                <Tooltip title="Etiqueta">
                  <Icon fontSize="small">photo_album</Icon>
                </Tooltip>
              </IconButton>

              <IconButton
                size="small"
              >
                <Tooltip title={data.status}>
                  <Icon fontSize="small" style={style}>{icon}</Icon>
                </Tooltip>
              </IconButton>

              <Tooltip title={data.platformName}>
                <img
                  src={meli}
                  style={{ height: 20, marginLeft: 5, marginTop: 3 }}
                />
              </Tooltip>

            </Grid>
          );
        }
      }
    },
    {
      name: 'optionsButton',
      label: ' ',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {

          return (
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Tooltip title="Editar detalhes">
                  <ButtonDefault
                    onClick={() => { handleClickOpen(gridData[dataIndex], props.property) }}
                    icon={'edit'}
                    label={'Detalhes'}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          );
        }
      }
    },

  ];

  const gridOptions = {
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    page: gridState.page,
    rowsPerPageOptions: [25, 50, 100],
    count: gridState.total,
    filter: false,
    search: false,
    print: false,
    download: false,
    sort: false,
    jumpToPage: true,
    viewColumns: false,
    selectableRows: false,
    setTableProps: () => ({
      size: 'small'
    }),
    textLabels: dataGridTexts(intl),
    responsive: 'simple',
    customToolbar: () => (

      <Grid container justifyContent='flex-end' spacing={2}>
        <Grid item xs={6} md={'auto'} lg={'auto'}>
          <ButtonDefault
            onClick={() => {
              () => { handleRefreshClick() }
            }}
            icon={'refresh'}
            label={'Atualizar'}
          />

        </Grid>

        <Grid item xs={6} md={'auto'} lg={'auto'}>
          <ButtonDefault
            onClick={() => { handleDownloadReport() }}
            icon={'download'}
            isLoading={isDownloading}
            disabled={isDownloading || gridState.total == 0}
            label={'Download Planilha'}
          />
        </Grid>

      </Grid>


    ),
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true
      }
    },
    onTableChange: handleGridState,
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <SellerSelectToolbar
        selectedRows={selectedRows}
        displayData={displayData}
        setSelectedRows={setSelectedRows}
        getGridData={getGridData}
      />
    ),
  };

  const filterSubmit = (filter) => {
    setGridFilter(filter);
  };

  return (
    <div>

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>


      <Grid container  >

        <Grid item xs={12} >
          <SaleFilter filter={gridFilter} setFilter={setGridFilter} filterSubmit={filterSubmit} isLoading={isLoading} setIsLoading={setIsLoading} clearIsLoading={clearIsLoading} setClearIsLoading={setClearIsLoading} />

        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>


        <Grid item xs={12}>
          <SaleCards filterData={gridState} />
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} >
          <MUIDataTable
            title={''}
            data={gridData}
            columns={gridColumns}
            options={gridOptions}
          />
        </Grid>
      </Grid>


      <SaleLabel orderId={orderLabel} />

    </div>
  );
}

SalePage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(SalePage);

