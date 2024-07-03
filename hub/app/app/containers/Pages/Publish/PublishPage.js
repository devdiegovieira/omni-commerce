import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { CircularProgress, Grid, IconButton, Tooltip, Typography, Icon, List, ListItem, makeStyles, Dialog, DialogContent, useMediaQuery, useTheme, Toolbar, Slide, Button, AppBar, Paper, Divider } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import brand from 'digi-api/dummy/brand';
import { promisseApi } from '../../../api/api';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import PublishFilter from './PublishFilter';
import PublishDetail from "./PublishDetail";
import PublishActions from "./PublishActions";
import { handleError } from "../../../utils/error";
import { useSnackbar } from 'notistack';
import { chunkArray } from "../../../../../lib/util/javaScript";
import { green } from "@material-ui/core/colors";
import PageTitle from "../../../components/Header/PageTitle";
import ButtonDefault from "../../../components/Button/ButtonDefault";
import { addRowsToSheet, createWorkBook, createWorkSheet, saveExcell } from "../../../utils/exceljs";
import { is } from "date-fns/locale";


function PublishPage(props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const history = useHistory();

  const useStyles = makeStyles((theme) => ({
    grid: {
      padding: '0 15px !important',
      marginBottom: 10
    },
    gridContainer: {
      margin: '0 -15px !important',
      width: 'unset'
    },
    downloadProgress: {
      color: 'primary',
      marginRight: 0,
      position: 'relative',
      top: 14
    },
  }));

  let paths = props.location.pathname.split('/');
  const [publishId, setPublishId] = useState(paths.length > 2 && paths[2] ? paths[2] : undefined);

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths != publishId)
    setPublishId(paths);

  const classes = useStyles();
  const title = `Anúncios - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
  const [gridData, setGridData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearIsLoading, setClearIsLoading] = useState(false);
  const [attId, setAttId] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [openDialog, setOpenDialog] = useState([]);
  const [item, setItem] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [rowsSelected, setRowsSelected] = useState([]);
  const [user, setUser] = useState(false);

  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    totalStatus: [],
    ...JSON.parse(sessionStorage.getItem('publishState'))
  });

  const statusFilter =
    new URLSearchParams(props.location.search).get('status') ?
      { status: [new URLSearchParams(props.location.search).get('status')] } :
      {};

  const [gridFilter, setGridFilter] = useState({
    limit: 25,
    offset: 0,
    ...JSON.parse(sessionStorage.getItem('publishFilter')),
    ...statusFilter
  })

  const handleClickOpen = (data, props) => {
    history.push(`${props.location.pathname}/${data.publishId}`);
  }


  const handleDownloadClick = () => {
    setIsDownloading(true)
    promisseApi(
      'get',
      '/publish/report',
      (data) => {
        setReport(data);
        setIsDownloading(false)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          ...gridFilter,
          limit: 10000
        }
      }
    )
  }

  const [report, setReport] = useState();


  useEffect(() => {
    if (report) {

      if (!report.workbook) {
        report.workbook = createWorkBook();
        report.worksheet = createWorkSheet(report.workbook, 'Anúncios', report.columns);
        addRowsToSheet(report.worksheet, report.items);

        delete report.items;
      }

      promisseApi(
        'get',
        '/publish/report',
        (data) => {
          if (data.items.length > 0) {
            addRowsToSheet(report.worksheet, data.items);

            if (Number.isInteger(report.offset / 50000))
              report.worksheet = createWorkSheet(report.workbook, `Anúncios-${report.offset / 50000}`, report.columns);

            setReport({ ...report, offset: report.offset + report.limit });
          } else {
            saveExcell(report.workbook, 'RelatorioAnuncios.xlsx');
            setIsDownloading(false);
          }
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        {},
        { params: { ...gridFilter, limit: report.limit, offset: report.offset + report.limit } }
      )
    }
  }, [report]);

  const handleData = (data, setter = []) => {
    setGridState({ ...gridState, total: data.total, totalStatus: data.totalStatus });
    let condition;
    let oficialStore;
    let listingType;
    if (setter.length > 0) {
      setter(data.items.map(m => {

        switch (m.condition) {
          case 'new':
            condition = 'Novo'
            break;

          case 'used':
            condition = 'Usado'
            break;
        }

        switch (m.oficialStore) {
          case 224:
            oficialStore = 'Loja 224'
            break;
          case 1370:
            oficialStore = 'Loja 1370'
            break;
          case 2757:
            oficialStore = 'Loja 2757'
            break;
        }

        switch (m.listingType) {
          case 'gold_pro':
            listingType = 'Premium'
            break;
          case 'gold_special':
            listingType = 'Clássico'
            break;
        }
        return {
          ...m,
          condition,
          // shipMode,
          oficialStore,
          listingType,
        }
      }))
    };

    setIsLoading(false);
  }

  const getGridData = (filter, setter = []) => {
    filter = filter ? filter : gridFilter;

    promisseApi(
      'get',
      '/user/superuser',
      (data) => { setUser(data) },
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' })
    );

    promisseApi(
      'get',
      '/publish/list',
      (data) => {
        handleData(data, setter)
        setIsLoading(false)
        setClearIsLoading(false)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          ...filter
        }
      }
    );
  }

  useEffect(() => {
    getGridData(gridFilter, setGridData);
  }, [gridFilter]);


  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage })

      sessionStorage.setItem('publishFilter', JSON.stringify({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage }));

      sessionStorage.setItem('publishState', JSON.stringify({ page: tableState.page, total: gridState.total ? gridState.total : 0, rowsPerPage: tableState.rowsPerPage }));
    }

    if (action == 'rowSelectionChange') {

      let selected = [];
      for (let row of tableState.selectedRows.data) {
        let data = gridData[row.dataIndex];
        if (data) {
          selected.push({
            publishId: data.publishId,
            marketPlaceId: data.marketPlaceId,
            sellerId: data.sellerId,
            status: data.status,
            complete: data.complete
          })

        }
      }

      setRowsSelected(selected);

    }
  };

  const gridColumns = [
    {
      name: '',
      label: '',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];

          return (
            <Avatar noWrap

              variant="circular"
              alt={value.title}
              src={
                Array.isArray(value.skuXPublish) &&
                value.skuXPublish.length > 0 &&
                Array.isArray(value.skuXPublish[0].images) &&
                value.skuXPublish[0].images.length > 0 &&
                value.skuXPublish[0].images[0]
              }
              style={{
                width: 45,
                height: 45
              }}
            >
              {value.title ? value.title.charAt(0) : ''}
            </Avatar>
          );
        },
      }
    },
    {
      name: 'title',
      label: 'Produto',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];

          return (
            <>

              <Typography noWrap style={{ fontSize: 11 }}>
                {user && (value.publishId)}
                {user && value.link &&
                  (
                    <IconButton

                      onClick={() => {
                        window.open(value.link, '_blank').focus();
                      }}
                      size='small'
                    >
                      <Icon
                        style={{ fontSize: 11, marginTop: -3 }}
                      >
                        open_in_new
                      </Icon>
                    </IconButton>
                  )
                }
              </Typography>

              <Typography noWrap style={{ fontSize: 13, maxWidth: 280 }}>
                <b>{value.title}</b>
              </Typography>

              <Typography noWrap style={{ fontSize: 11, marginBottom: 0 }}>
                {value.sold >= 0 && (<>{value.sold}  vendas</>)}  {value.lastSync && (<><Tooltip arrow title="Data da última sincronização"><Icon style={{ fontSize: 10, paddingTop: 1 }}>sync</Icon></Tooltip>{new Date(value.lastSync).toLocaleDateString()} {new Date(value.lastSync).toLocaleTimeString()}</>)}
              </Typography>


            </>
          );
        },
        display: true,
        sort: false,
      }
    },
    {
      name: 'publishId',
      label: 'Detalhes',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <>
              <Grid container style={{ minWidth: 150 }}>

                {value.growStore &&
                  <Grid item>
                    <Tooltip
                      title={'Loja Oficial - Grow Store'}
                      arrow
                    >
                      <Icon color="primary" style={{ fontSize: 16 }}>store</Icon>
                    </Tooltip>
                  </Grid>
                }
                {value.condition && (
                  <Grid item>
                    <Tooltip
                      title={`Condição do anúncio - ${value.condition}`}
                      arrow
                    >
                      <Icon color="primary" style={{ fontSize: 16 }}>verified</Icon>
                    </Tooltip>
                  </Grid>)}
                {value.shipMode && (
                  <Grid item style={{ paddingRight: 3 }}>
                    <Tooltip
                      title={`Modo de Envio - ${value.shipMode}`}
                      arrow
                    >
                      <Icon color="primary" style={{ fontSize: 16 }}>local_shipping</Icon>
                    </Tooltip>
                  </Grid>)}
                {value.listingType &&
                  <Grid item>
                    <Tooltip
                      title={`Destaque - ${value.listingType}`}
                      arrow
                    >
                      <Icon color="primary" style={{ fontSize: 16 }}>diamond</Icon>
                    </Tooltip>
                  </Grid>
                }
              </Grid>

              {value.skuXPublish[0] && value.skuXPublish[0].price && (
                <Tooltip
                  title='Preço'
                  arrow
                >
                  <p style={{ marginBottom: 0 }}>
                    {value.skuXPublish[0].price.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </Tooltip>
              )}
              <Tooltip
                title='Estoque'
                arrow
              >
                <p style={{ marginBottom: 0, fontSize: 12 }}>{value.skuXPublish[0] && value.skuXPublish[0].quantity ? value.skuXPublish[0].quantity : 0} Disponíveis</p>

              </Tooltip>
            </>
          );
        },
      }
    },
    {
      name: 'sellerName',
      label: 'Empresa',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <>
              <Typography noWrap>{value.sellerName}</Typography>
            </>
          )

        }
      }
    },
    {
      name: 'marketPlaceName',
      label: 'Conta',
      options: {
        display: false,
        sort: false
      }
    },
    {
      name: 'Status',
      label: 'Status',
      options: {
        display: true,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          let status = {};

          switch (value.status) {
            case 'active':
              status.label = 'Ativo'
              status.color = 'lime'
              break;
            case 'paused':
              status.label = 'Em Pausa'
              status.color = '#FFD700'
              break;
            case 'pending':
              status.label = 'Pendente'
              status.color = 'orange'
              break;
            case 'closed':
              status.label = 'Finalizado'
              status.color = 'red'
              break;
            case 'unlinked':
              status.label = 'Desvinculado'
              status.color = 'grey'
              break;
            case 'inactive':
              status.label = 'Inativo'
              status.color = 'grey'
              break;
            // default: status.label = 'Desvinculado'
          }

          return (
            <Grid container >

              <Grid item xs={12} >
                <Grid container justifyContent="flex-start" >


                  <Chip icon={<Icon style={{ fontSize: '18px', color: status.color }}  >lens</Icon>} label={status.label}
                  />

                </Grid>
              </Grid>
            </Grid>
          );
        },
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
            <>
              <Grid container justifyContent='flex-end'>
                <Tooltip title="Editar detalhes">
                  <ButtonDefault
                    onClick={() => handleClickOpen(gridData[dataIndex], props)}
                    icon={'edit'}
                    label={'Detalhes'}
                  />
                </Tooltip>
              </Grid>
            </>
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
    sort: false,
    print: false,
    download: false,
    jumpToPage: true,
    viewColumns: false,
    isRowExpandable: (dataIndex, expandedRows) => {
      let data = gridData[dataIndex];
      return data.skuXPublish && data.skuXPublish.length > 0;
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      let data = gridData[rowMeta.dataIndex];

      return (
        <Grid container>
          <Grid item xs={12}>
            <List>
              {data.skuXPublish && data.skuXPublish.map(item => (
                <ListItem style={{ paddingLeft: 85 }}>
                  <Grid container spacing={2}>
                    <Grid item >
                      <Avatar variant="circle" style={{ marginTop: 3 }}>
                        <img src={item.images ? item.images[0] : []} />
                        <b>{item.sku.charAt(0)}</b>
                      </Avatar>
                    </Grid>
                    <Grid item style={{ paddingLeft: 20 }} lg={3} sm={3} xs={12} >
                      <b>{item.sku}</b>
                      <p style={{ marginBottom: 0, fontSize: 15 }}>{`R$ ${item.price ? item.price.toLocaleString('pt-BR') : '0'}` + '  |  ' + (item.quantity ? item.quantity : '') + ' Disponíveis'}</p>
                    </Grid>
                    <Grid item lg={8} sm={8} xs={12}>

                      <Tooltip title={'Atributos'}>
                        <Button
                          onClick={() => {
                            setOpenDialog(item.attributes || []);
                            setItem(item || []);
                            setAttId(data);
                          }}
                          style={{ marginRight: '%', marginTop: 10 }}
                          disabled={!Array.isArray(item.attributes) || item.attributes.length == 0}
                        >
                          <Icon>open_in_new</Icon>
                          Atributos
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}

            </List>
          </Grid>
        </Grid >
      )
    },

    setTableProps: () => {
      return {
        size: 'small'
      };
    },
    
    textLabels: dataGridTexts(intl),
    filter: true,
    responsive: 'stacked',
    position: 'sticky',


    customToolbar: () => {
      return (


        <Grid container justifyContent="flex-end" style={{ padding: 10 }}>
          <PublishActions
            publishies={rowsSelected}
            executeAfterAction={getGridData}
            handleDownloadClick={handleDownloadClick}
            handleRefreshClick={getGridData}
            isDownloading={isDownloading}

          />


          {
            isDownloading && <CircularProgress
              size={24}
              style={{
                position: 'absolute',
                right: 195,
                zIndex: 1,
                color: green[500]
              }}
            />
          }
        </Grid>

      );
    },
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true
      }
    },
    onTableChange: handleGridState,
    customToolbarSelect: (selectedRows) => (<></>),
    selectToolbarPlacement: 'none'
  };

  const filterSubmit = (filter) => {
    sessionStorage.setItem('publishFilter', JSON.stringify({ ...filter, limit: 25, offset: 0 }));
    setGridFilter({ ...filter, limit: 25, offset: 0 })
  }

  return (
    <>
      <div></div>

      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='twitter:title' content={title} />
        <meta property='twitter:description' content={description} />
      </Helmet>

      <Grid container>

        {!publishId &&
          (

            <Grid item xs={12} >
              <PageTitle icon={'dvr'} label={'Anúncios'} />

              <Paper>
                <Grid container>

                  <Grid item xs={12}>
                    <PublishFilter
                      filter={gridFilter}
                      setFilter={setGridFilter}
                      filterSubmit={filterSubmit}
                      user={user}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      clearIsLoading={clearIsLoading}
                      setClearIsLoading={setClearIsLoading}

                    />
                  </Grid>

                  <Grid item xs={12} style={{ zIndex: '1' }}>
                    <MUIDataTable
                      data={gridData}
                      columns={gridColumns}
                      options={gridOptions}
                    />
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          )
        }

        {publishId &&
          (
            <Grid item xs={12} >
              <PublishDetail
                publishId={publishId}
                intl={intl}
              />
            </Grid>
          )
        }
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        open={openDialog.length > 0}
        onClose={() => {
          setOpenDialog([]);
        }}
        // TransitionComponent={Transition}
        fullWidth>
        <AppBar style={{
          position: 'relative',
          paddingRight: 0
        }}>
          <Toolbar>
            <IconButton edge="start" color="grey"
              onClick={() => {
                setOpenDialog([]);
              }} aria-label="Sair">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Atributos {item.sku} - {item.publishId}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent >

          {openDialog.map((m, index) => (

            index == 0 && (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item>
                        <Avatar alt={m.value_name ? m.value_name : ''} variant="circle">
                          <img src={item.images ? item.images[0] : []} />
                          {m.value_name ? m.value_name.charAt(0) : ''}
                        </Avatar>
                      </Grid>
                      <Grid item style={{ marginLeft: 20 }}>
                        <b>{item.sku}</b>
                        <p style={{ marginBottom: 0, fontSize: 15 }}>{`R$ ${item.price ? item.price.toLocaleString('pt-BR') : '0'}` + '  |  ' + (item.quantity ? item.quantity : '') + ' Disponíveis'}</p>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} style={{ marginTop: 15 }}>
                  <Grid container spacing={1}>
                    <Grid item >
                      <Chip
                        label={`${m.name ? m.name : ''}: ${m.value_name ? m.value_name : ''}`}
                      />
                    </Grid>
                    {Array.isArray(attId.attributes) && attId.attributes.length > 0 ? attId.attributes.map(mm =>
                      <Grid item >
                        {!mm.custom && (<Chip label={`${mm.name ? mm.name : ''}: ${mm.value_name ? mm.value_name : ''}`} />)}
                      </Grid>
                    ) : ''}
                  </Grid>
                </Grid>
              </>
            )))}

        </DialogContent>
      </Dialog>

    </>
  );
}

PublishPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(PublishPage);
