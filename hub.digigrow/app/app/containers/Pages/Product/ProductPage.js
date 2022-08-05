import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import {
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Paper,
  Slide,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@material-ui/core';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import brand from 'digi-api/dummy/brand';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import ProductFilter from './ProductFilter';
import { promisseApi } from '../../../api/api';
const FileDownload = require('js-file-download');
import { useHistory } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import { useTheme } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { green } from '@material-ui/core/colors';
import ProductActions from './ProductActions';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import PageTitle from '../../../components/Header/PageTitle';
import ButtonDefault from '../../../components/Button/ButtonDefault';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    paddingRight: 0,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  saveProgress: {
    color: green[500],
    position: 'absolute',
    top: -26,
    left: -23,
    zIndex: 1,
  },
  saveButton: {
    position: 'absolute',
    top: -14,
    left: -10,
    zIndex: 1,
  },
  wrapper: {
    position: 'relative',
  },
  downloadProgress: {
    color: 'primary',
    marginLeft: -42,
    position: 'relative',
    top: 14
  },
}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);


function ProductPage(props) {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const title = `Produto - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const history = useHistory();
  const [rowsSelected, setRowsSelected] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  let paths = props.location.pathname.split('/');
  const [skuId, setSkuId] = useState(paths.length > 2 && paths[2] ? paths[2] : undefined);

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths != skuId) setSkuId(paths);

  const [gridData, setGridData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [publishies, setPublishies] = useState([]);
  const [head, setHead] = useState({});
  const [clearIsLoading, setClearIsLoading] = useState(false);

  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    ...JSON.parse(sessionStorage.getItem('productState'))
  });

  const [gridFilter, setGridFilter] = useState({
    limit: 25,
    offset: 0,
    ...JSON.parse(sessionStorage.getItem('productFilter'))
  });


  const handleClickOpen = (data, e) => {
    history.push(`${props.location.pathname}/${data}`);
  }

  const handleRefreshClick = () => {
    getGridData();
  };

  const getGridData = () => {
    
    promisseApi(
      'get',
      '/sku',
      (data) => {
        setGridData(data.list);
        setIsLoading(false);
        setClearIsLoading(false);

        setGridState({ ...gridState, total: data.total })
      },
      (err) => { enqueueSnackbar(err, { variant: 'error' }) },
      {},
      {
        params: gridFilter
      }
    )
  };

  useEffect(() => {
    getGridData();
  }, [gridFilter]);

  const putStatus = (id, isActive) => {
    promisseApi(
      'put',
      '/sku/status',
      (data) => {
        getGridData();
        setRowsSelected([])


      },
      {},
      {
        _id: id,
        isActive: isActive,
        multiple: head,
        gridFilter
      },
    )
  }


  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage });
      sessionStorage.setItem('productFilter', JSON.stringify({ ...gridFilter, offset: tableState.page * tableState.rowsPerPage }));
      sessionStorage.setItem('productState', JSON.stringify({ page: tableState.page, rowsPerPage: tableState.rowsPerPage }));
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
            sku: data._id,
          })

        }
      }
      setRowsSelected(selected);
    }
  };



  const columns = [
    {
      name: '',
      label: '',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <>
              <Avatar
                variant="rounded"
                alt={value.title}
                src={
                  Array.isArray(value.variations) && value.variations.length > 0 &&
                    Array.isArray(value.variations[0].image) && value.variations[0].image.length > 0 ?
                    value.variations[0].image[0] :
                    Array.isArray(value.image) && value.image.length > 0 ? value.image[0] : ''
                }
                style={{ width: 40, height: 40 }}
              >
                {value.title ? value.title.toString().charAt(0) : ''}
              </Avatar>
            </>
          )
        }

      }
    },
    {
      name: 'title',
      label: 'Código',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <>

              <p style={{ marginTop: 10 }}>{value.sku}</p>
            </>
          )
        }

      }
    },
    {
      name: 'price',
      label: 'Produto',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex]

          return (
            <>
              <p>
                {value.title ? value.title.toString().substring(0, 25) : 'Sem título'}
              </p>

              <p style={{ fontSize: 11, marginBottom: 0 }}>
                {'R$' + value.price} |<b> Saldo : </b> {value.stock}
              </p>
            </>
          )
        }
      }
    },
    {
      name: 'sellerName',
      label: 'Empresa',
    },
    {
      name: 'categoryId',
      label: "Categoria",
    },
    {
      name: 'Status',
      label: '',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <Grid container justifyContent='flex-start'>
              <Chip icon={<Icon style={{ fontSize: '18px', color: value.isActive ? 'green' : 'red' }}  >lens</Icon>} label={value.isActive ? 'Ativo' : 'Inativo'}
                deleteIcon={<Icon>lens</Icon>} />
            </Grid>
          );
        }

      }
    },
    {
      name: 'options',
      label: ' ',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];


          return (
            (!value.variations || value.variations.length == 0) &&
            <Tooltip title={'Anúncios que possuem este produto/variação'}>
              <IconButton
                onClick={() => {
                  setPublishies(value.publishies || [])
                }}
                disabled={!Array.isArray(value.publishies) || value.publishies.length == 0}
              >
                <Icon>dvr</Icon>
              </IconButton>
            </Tooltip>

          )
        }

      }
    },
    {
      name: 'options2',
      label: ' ',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];


          return (
            <Grid container justifyContent='flex-end'>
              <Tooltip title="Editar detalhes">
                <ButtonDefault
                  onClick={() => handleClickOpen(value._id)}
                  icon={'edit'}
                  label={'Detalhes'}
                />
              </Tooltip>
            </Grid>

          )
        }
      }
    }
  ];

  const options = {
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    page: gridState.page,
    rowsPerPageOptions: [25, 50, 100],
    count: gridState.total,
    filter: false,
    search: false,
    print: false,
    sort: false,
    download: false,
    jumpToPage: true,
    responsive: "scrollMaxHeight",
    viewColumns: false,
    expandableRowsHeader: false,
    selectableRowsHeader: true,
    // expandableRowsOnClick: true,
    isRowExpandable: (dataIndex, expandedRows) => {
      let data = gridData[dataIndex];
      return data.variations && data.variations.length > 0;
    },
    expandableRows: true,
    renderExpandableRow: (rowData, rowMeta) => {
      let data = gridData[rowMeta.dataIndex];

      return (

        <Grid container>
          <Grid item xs={12}>

            <List>
              {data.variations && data.variations.map(item => (


                <ListItem style={{ paddingLeft: 85 }}>


                  <Grid container spacing={2}>

                    <Grid item >
                      <Avatar variant="rounded" style={{ marginTop: 3 }}>
                        <img src={item.image ? item.image[0] : []} />
                      </Avatar>
                    </Grid>

                    <Grid item style={{ paddingLeft: 20 }} lg={3} sm={3} xs={12} >

                      <b>{item.sku}</b>
                      <p style={{ marginBottom: 0, fontSize: 15 }}>{`R$ ${item.price ? item.price.toLocaleString('pt-BR') : '0'}` + '  |  ' + (item.stock ? item.stock : '') + ' Disponíveis'}</p>
                    </Grid>

                    <Grid item lg={8} sm={8} xs={12}>

                      <Tooltip title={'Anúncios'}>
                        <IconButton

                          onClick={() => {
                            setPublishies(item.publishies || [])
                          }}
                          style={{ marginRight: '%', marginTop: 10 }}
                          disabled={!Array.isArray(item.publishies) || item.publishies.length == 0}
                        >
                          <Icon>dvr</Icon>
                        </IconButton>
                      </Tooltip>

                      {Array.isArray(item.attributes) && item.attributes.map(m => {
                        return (
                          <Chip style={{ marginLeft: 5, marginTop: 7 }}
                            label={`${m.id ? m.id : ''}: ${m.value ? m.value : ''}`}
                          />
                        )
                      })}
                    </Grid>
                  </Grid>
                </ListItem>
              ))}

            </List>
          </Grid>
        </Grid >
        //   </Grid>
        // </Grid>
      )
    },
    setTableProps: () => ({
      size: 'small'
    }),
    filterType: 'multiselect',
    textLabels: dataGridTexts(intl),
    responsive: 'simple',
    customToolbar: () => (
      <ProductActions
        rowsSelected={rowsSelected}
        gridFilter={gridFilter}
        handleRefreshClick={getGridData}
      />

    ),
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true
      }
    },
    onTableChange: handleGridState,
    onRowSelectionChange: (a, b, c, type) => {
      if (type === 'head') { setHead(true) }
      if (type === 'cell') { setHead(false) }
    },
    customToolbarSelect: () => (<></>),
    selectToolbarPlacement: 'none'
  };

  const filterSubmit = (filter) => {
    sessionStorage.setItem('productFilter', JSON.stringify({ ...filter, limit: 25, offset: 0 }));
    sessionStorage.setItem('productState', JSON.stringify({ limit: 25, offset: 0 }));

    setGridFilter({ ...filter, limit: 25, offset: 0 });
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

      {
        skuId &&
        (
          <ProductDetail
            handleRefreshClick={handleRefreshClick}
            skuId={skuId}
            intl={intl}
            gridData={gridData}
            paths={paths}
          />
        )
      }

      {
        !skuId && (
          <>
            <PageTitle icon={'sell'} label={'Produtos'} />

            <Paper>
              <Grid container >

                <Grid item xs={12} >
                  <ProductFilter filter={gridFilter} setFilter={setGridFilter} filterSubmit={filterSubmit} isLoading={isLoading} setIsLoading={setIsLoading} clearIsLoading={clearIsLoading} setClearIsLoading={setClearIsLoading}/>
                </Grid>

                <Grid item xs={12} style={{paddingTop: 10}}>
                  <Divider />
                </Grid>

                <Grid item xs={12} >
                  <MUIDataTable
                    data={gridData}
                    columns={columns}
                    options={options}
                  />
                </Grid>

              </Grid>
            </Paper>
          </>
        )
      }

      <Dialog
        fullScreen={fullScreen}
        open={publishies.length > 0}
        onClose={() => {
          setPublishies([])
        }}
        TransitionComponent={Transition}
        fullWidth>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => {
            setPublishies([])

          }} aria-label="Sair">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Anúncios
          </Typography>

        </Toolbar>
        <DialogContent>
          <List>
            {
              publishies.map(item => (
                <ListItem button onClick={() => history.push(`/publish/${item.publishId}`)}>
                  <ListItemText primary={item.publishId} />
                </ListItem>
              ))
            }
          </List>
        </DialogContent>
      </Dialog >
    </div >
  );
}

ProductPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(ProductPage);