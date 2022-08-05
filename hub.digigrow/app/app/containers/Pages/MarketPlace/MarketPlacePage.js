import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import {
  CircularProgress, Switch, Grid, Typography, Icon, IconButton, Tooltip, Paper
} from '@material-ui/core';
import brand from 'digi-api/dummy/brand';
import { makeStyles } from '@material-ui/core/styles';
import messages from './messages';
import { api, promisseApi } from '../../../api/api';
import { dataGridTexts } from '../../../components/DataGrid/gridTexts';
import MarketPlaceDetail from './MarketPlaceDetail';
import AddButtonToolbar from '../../../components/DataGrid/addButtonToolbar';
import MarketPlaceOficial from './MarketPlaceOficial';
import { useHistory } from 'react-router-dom';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import FormDialog from '../../../components/Dialog/FormDialog';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import PageTitle from '../../../components/Header/PageTitle';



const useStyles = makeStyles((theme) => ({
  grid: {
    padding: '0 15px !important',
    marginBottom: 10
  },
  gridContainer: {
    margin: '0 -15px !important',
    width: 'unset'
  }
}));

function MarketPlacePage(props) {
  let paths = props.location.pathname.split('/');
  const [marketPlaceId, setMarketPlaceId] = useState(paths.length > 2 && paths[2] ? paths[2] : undefined);

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths && paths != marketPlaceId) setMarketPlaceId(paths);

  let tg = props.location.search && props.location.search.replace('?code=', '');

  if (!paths && tg != marketPlaceId) {
    setMarketPlaceId(props.location.search.replace('?code=', ''));
  }

  const classes = useStyles();
  const title = `Contas - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const history = useHistory();
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [plataformSelectList, setPlatformSelectList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();



  const handleDetail = (value) => {
    if (value)
      history.push(`${props.location.pathname}/${value._id}`)
    else setOpen(true);
  };

  const handleRefreshClick = () => {
    getGridData();
  };

  const getGridData = () => {
    promisseApi(
      'get',
      '/marketplace',
      setData,
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );
  };

  const getPlataforms = () => {
    promisseApi(
      'get',
      `/selectlist/platformid`,
      (data) => {
        setPlatformSelectList(data);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )
  }

  useEffect(() => {
    getPlataforms();
    getGridData();
  }, []);

  const submit = () => {
    window.location.href = `https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=3622855487528749&redirect_uri=https://app.digigrow.com.br/marketplace`;
  }

  const [dialogFormData] = useState({})

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(dialogFormData, true, submit, []);



  const tableColumns = [
    {
      name: '_id',
      label: intl.formatMessage(messages.gridId),
      options: {
        filter: true,
        display: false,

      }
    },
    {
      name: 'name',
      label: intl.formatMessage(messages.gridName),
      options: {
        filter: true,
      }
    },
    {
      name: 'sellerName',
      label: intl.formatMessage(messages.gridSellerName),
      options: {
        filter: true,
      }
    },
    {
      name: 'platformName',
      label: intl.formatMessage(messages.gridPlatformaName),
      options: {
        filter: true,
      },

    },
    {
      name: 'active',
      label: intl.formatMessage(messages.gridActive),
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => (
          <Switch
            name="switchActiveGrid"
            color="primary"
            checked={data[dataIndex].active || false}
          />
        )
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
              <Tooltip title="Editar detalhes">
                <IconButton onClick={() => handleDetail(data[dataIndex], props)}>
                  <Icon style={{
                    opacity: 0.5,
                  }}>
                    edit
                  </Icon>
                </IconButton>
              </Tooltip>
            </>
          );
        }

      }
    },
  ];

  const tableOptions = {
    setTableProps: () => ({
      size: 'small'
    }),
    filterType: 'multiselect',
    textLabels: dataGridTexts(intl),
    viewColumns: false,
    // onRowClick: (rowData, rowState) => {
    //   handleDetail(data[rowState.dataIndex]);
    // },
    responsive: 'simple',
    customToolbar: () => (
      <>
        <AddButtonToolbar handleClick={handleRefreshClick} icon="refresh" title="Atualizar" />
        <AddButtonToolbar handleClick={() => handleDetail()} icon="add" title="Adicionar" />
      </>
    ),
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true
      }
    }
  };

  return (
    <>


      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PageTitle label={'Contas'} icon='storefront' />
      {marketPlaceId ? (
        <MarketPlaceDetail
          marketPlaceId={marketPlaceId}
          intl={intl}
          gridData={data}
          paths={paths}

        />
      ) : (<Paper>
        <Grid container className={classes.gridContainer}>

          <Grid item xs={12} className={classes.grid}>
            <MarketPlaceOficial intl={intl} />
          </Grid>

          <Grid item xs={12} className={classes.grid}>


            <MUIDataTable
              title={''
              }
              data={data}
              columns={tableColumns}
              options={tableOptions}
            />


          </Grid>

        </Grid>
      </Paper>
      )}

      <Form onSubmit={handleSubmit}>
        <FormDialog
          isOpen={open}
          setIsOpen={setOpen}
          title="Empresa"
        >
          <Grid container>
            <Grid item lg={12} sm={12} xs={12} style={{
              padding: 10,
              paddingTop: 0,
              width: '300px',
            }}>
              {/* <Controls.Select
                name="platformId"
                label="Plataforma"
                value={values.platformId}
                onChange={handleInputChange}
                options={plataformSelectList}
                error={errors.platformId}
              /> */}
            </Grid>
          </Grid>
        </FormDialog>
      </Form>

    </>

  );
}
MarketPlacePage.propTypes = {
  intl: intlShape.isRequired
};


export default injectIntl(MarketPlacePage);
