import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import {
  AppBar,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, List, Paper, Toolbar, Tooltip, Typography
} from '@material-ui/core';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import brand from 'digi-api/dummy/brand';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Icon from '@material-ui/core/Icon';
import meli from 'digi-images/logoMeli25.png';
import SaleFilter from './SaleFilter';
import SellerSelectToolbar from './SaleSelectToolbar';
import { promisseApi } from '../../../api/api';
import { useHistory } from 'react-router-dom';
import { handleError } from '../../../utils/error';
import AddIcon from '@material-ui/icons/Add';
import { useSnackbar } from 'notistack';
import Controls from '../../../components/Forms/controls';
import { Form, useForm } from '../../../components/Forms/useForm';

function MediationSalePage(props) {

  let paths = location.pathname.split('/');
  const [orderId, setOrderId] = useState(paths.length > 3 && paths[3] ? paths[3] : undefined);

  paths = paths.length > 3 && paths[3] ? paths[3] : undefined;
  if (paths != orderId) setOrderId(paths);

  const title = `Vendas - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const history = useHistory();
  const [gridData, setGridData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = (data, props) => {
    history.push(`${location.pathname}/${data.orderId}`);
  };

  const [dialog, setDialog] = useState(false);
  const [user, setUser] = useState({});
  const [find, setFind] = useState();
  const [isLoading, setIsLoading] = useState(false);

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
      '/order/medlist',
      data => {
        setGridState({ ...gridState, total: data.total, totalStatus: data.totalStatus, note: data.note, totalFilter: data.totalFilter });
        setGridData(data.items.map(m => ({
          ...m,
          dateClosed: new Date(m.dateClosed).toLocaleString(),
          freight: m.freight.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          receivement: m.receivement.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }) ? m.receivement.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }) : m.total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }) ,
        })));

        setIsLoading(false);
      },
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' }),
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


  const clean = () => {
    values.order = undefined
    setFind(null)
  }


  useEffect(() => {
    getGridData(gridFilter);
    promisseApi('get', '/user/superuser', (data) => setUser(data), (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
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
                    <Tooltip title="Conta Oficial ">
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
              <Tooltip title="Editar detalhes">

                <Button onClick={() => { handleClickOpen(gridData[dataIndex], props.property) }} style={{ backgroundColor: '#4b05af', color: 'white', fontSize: 9, padding: 5, borderRadius: 3, textTransform: 'none' }} >Detalhes</Button>
              </Tooltip>
            </Grid>
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
    // onRowClick: (rowData, rowState) => {
    //   handleClickOpen(gridData[rowState.dataIndex], props);
    // },
    responsive: 'simple',
    customToolbar: () => (
      <>
        {user &&
          <Grid container justifyContent='flex-end'>
            <Grid item xs={5}>
              <Button
                fullWidth
                style={{ fontSize: 12, padding: 5, borderRadius: 3, textTransform: 'none', minWidth: 150, maxWidth: 150 }}
                color='primary'
                variant='contained'
                startIcon={<AddIcon />}
                onClick={() => setDialog(true)}

              >
                Adicionar Mediação
              </Button>
            </Grid>
          </Grid>
        }
      </>
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

  const findOrder = (e) => {
    e.preventDefault();
    promisseApi(
      'get',
      `/order/${values.order}`,
      (data) => setFind([data]),
      (err) => {
        enqueueSnackbar((err), { variant: 'error' })
      }
    )
  }

  const submit = () => {
    promisseApi(
      'post',
      '/order/mediate',
      () => {

        enqueueSnackbar('Mediação aberta com sucesso', { variant: 'success' })
        setDialog(false)
        window.location.href = `/sale/mediation/${values.order}`
      },
      {},
      {},
      {
        params: { externalId: values.order, allowReplace: values.allowReplace, message: values.message ? values.message : 'Iniciou uma conversa', status: 'open' }
      }
    )
  };

  const [newMediation, setNewMediation] = useState({});


  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(newMediation, true, submit);

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
          <SaleFilter filter={gridFilter} setFilter={setGridFilter} />

        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>


        <Grid item xs={12} >
          <MUIDataTable
            title={''}
            data={gridData}
            columns={gridColumns}
            options={gridOptins}
          />
        </Grid>
      </Grid>


      <Dialog
        open={dialog}
        onClose={() => handleClose(false)}
      >
        <AppBar style={{ position: 'relative' }}>

          <Toolbar style={{ minWidth: 400 }} >
            <Grid item xs={12}>
              <Typography>Adicionar Mediação</Typography>
            </Grid>

          </Toolbar>

        </AppBar>

        <DialogContent style={{ padding: 20 }} >
          <Form onSubmit={findOrder}>
            <Grid container>
              <Grid item xs={12}  >

                <Controls.Input
                  name="order"
                  disabled={find}
                  label="Venda"
                  value={values.order}
                  onChange={(e) => handleInputChange(e)}
                  error={errors.order}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: 10, padding: 2 }}  >

                <Button disabled={!find} type='submit' variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11, marginRight: 5 }} startIcon={<Icon>close</Icon>} onClick={() => clean()}  >
                  Limpar pesquisa
                </Button>

                <Button startIcon={<Icon>search</Icon>} variant='contained' color='primary' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} onClick={(e) => findOrder(e)} >
                  Pesquisar
                </Button>
              </Grid>
              {find && (
                <Grid container >
                  <Grid item={12}>
                    <Typography>
                      {find.map(m => {
                        return (
                          <Grid>
                            <p>{`Venda: `}<b>{m.packId ? m.packId : m.externalId}</b></p>
                            <p>{`Valor: `}<b>{m.receivement.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}</b></p>
                            <p>{new Date(m.dateClosed).toLocaleDateString()}</p>
                          </Grid>
                        )
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Form>

          <Form onSubmit={handleSubmit}>

        

            <Grid item xs={12} >
              <Controls.Input
                disabled={!find}
                style={{ m: 1, minWidth: 200 }}
                label="Mensagem"
                name="message"
                onChange={handleInputChange}
                value={values.message}
                multiline

              />
            </Grid>

          </Form>
        </DialogContent>



        <DialogActions>
          <Button onClick={() => { setDialog(false); clean() }} variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} startIcon={<Icon>close</Icon>} color="primary">
            Cancelar
          </Button>
          <Button disabled={!find} type='submit' variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} startIcon={<Icon>add</Icon>} onClick={() => submit()} color="primary" autoFocus>
            Adicionar
          </Button>

        </DialogActions>
      </Dialog>

    </div >


  );
}

MediationSalePage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(MediationSalePage);

