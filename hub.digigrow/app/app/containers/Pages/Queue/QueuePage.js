import React, { useEffect, useState, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import { injectIntl, intlShape } from 'react-intl';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import IconButton from '@material-ui/core/IconButton';
import VisiIcon from '@material-ui/icons/Visibility';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  CircularProgress, Grid, Icon, Paper, Typography
} from '@material-ui/core';
import { dataGridTexts } from '../../../components/DataGrid/gridTexts';
import QueueTypeToolbar from './QueueTypeToolbar';
import { promisseApi } from '../../../api/api';
import AddButtonToolbar from '../../../components/DataGrid/addButtonToolbar';
import Notification from '../../../components/Notification';
import QueueCards from './QueueCards';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: '0 15px !important',
  },
  gridContainer: {
    margin: '0 -15px !important',
    width: 'unset',
  },
}));


function QueuePage(props) {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();



  const title = `Fila - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const descriptionElementRef = useRef(null);

  const [dataGrid, setDataGrid] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [queueType, setQueueType] = useState('queue');
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [handleShowContent, setHandleShowContent] = useState(false);





  const handleDetailOpen = (dataGridIndex) => {
    promisseApi(
      'get',
      `/queue/${dataGrid[dataGridIndex].queueId}`,
      (data) => {
        setDetailData(data);
        setOpenDetail(true);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        headers: {
          queueType
        }
      }
    );
  };

  const handleRefreshClick = () => {
    getGridData();
  };

  const handleDetailClose = () => {
    setOpenDetail(false);
  };


  const getGridData = () => {

    setIsLoading(true);

    promisseApi(
      'get',
      `/queue`,
      (data) => {
        setDataGrid(data.map(m => ({
          ...m,
          updatedAt: new Date(m.updatedAt).toLocaleDateString(),
        })));
        setIsLoading(false);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        headers: {
          queueType
        }
      }
    );
  };

  useEffect(() => {
    getGridData();
  }, [queueType]);

  const gridColumns = [
    {
      name: 'queueId',
      label: 'Id',
      options: {
        filter: true,
        display: false
      }
    },
    {
      name: 'external',
      label: 'Código',
      options: {
        filter: true,
      }
    },
    {
      name: 'type',
      label: 'Tipo',
      options: {
        filter: true,
      }
    },
    {
      name: 'operation',
      label: 'Operação',
      options: {
        filter: true,
      }
    },
    {
      name: 'platformName',
      label: 'Plataforma',
      options: {
        filter: true,
      }
    },
    {
      name: 'sellerName',
      label: 'Empresa',
      options: {
        filter: true,
      }
    },
    {
      name: 'updatedAt',
      label: 'Atualizado',
      options: {
        filter: true,
      }
    },
    {
      name: 'errorMsg',
      label: 'Erro',
      options: {
        filter: true,
        display: queueType == 'queueError',
        customBodyRenderLite: (dataIndex) => (
          <Tooltip title="Visualizar detalhes">
            <p>{dataGrid[dataIndex].errorMsg === [] ? dataGrid[dataIndex].errorMsg.map(r => <p>{r}</p>) : dataGrid[dataIndex].errorMsg}</p>
          </Tooltip>

        )

      }
    },
    {
      name: '',
      label: '',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => (
          <Tooltip title="Visualizar detalhes">
            <IconButton size="small" onClick={() => handleDetailOpen(dataIndex)}>
              {queueType === 'queueSuccess' ? '' : <VisiIcon fontSize="small" />}

            </IconButton>
          </Tooltip>

        )
      }
    },

  ];

  const gridOptions = {
    setTableProps: () => ({
      size: 'small'
    }),
    filterType: 'multiselect',
    textLabels: dataGridTexts(intl),
    selectableRowsHideCheckboxes: true,
    responsive: 'simple',
    sort: false,
    viewColumns: false,
    customToolbar: () => (
      <>
        <AddButtonToolbar handleClick={handleRefreshClick} icon="refresh" title="Atualizar" />
        <QueueTypeToolbar onChange={setQueueType} queueType={queueType} />
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
    <div>

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>



      <Grid container className={classes.gridContainer}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} className={classes.grid}>
              <QueueCards filterData={dataGrid} />
            </Grid>


            <Grid xs={12} className={classes.grid}>
              <MUIDataTable
                title={(
                  <Typography variant="h6">
                    <Icon color="primary" style={{ position: 'relative', top: 4, marginRight: 8, marginLeft:20 }}>queue_play_next</Icon>
                    Fila de Integração
                    {isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
                  </Typography>
                )}
                data={dataGrid}
                columns={gridColumns}
                options={gridOptions}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        open={openDetail}
        onClose={handleDetailClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="scroll-dialog-title">Conteúdo</DialogTitle>
        <DialogContent dividers="true">
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <pre>
              {
                queueType !== 'queueError' ?
                  <>
                    <p>{JSON.stringify(detailData.content)}</p>

                    <Button
                      variant='text'
                      color='secondary'
                      onClick={() => setHandleShowContent(handleShowContent ? false : true)}
                    >
                      Mais informações
                    </Button>
                    {handleShowContent && (
                      <ul>
                        <li>{'operation :' + ' ' + detailData.operation}</li>
                        <li>{'platformId :' + ' ' + detailData.platformId}</li>
                        <li>{'sellerId :' + ' ' + detailData.sellerId}</li>
                        <li>{'type :' + ' ' + detailData.type}</li>
                        <li>{'userId :' + ' ' + detailData.userId}</li>
                        <li>{'updatedAt :' + detailData.updatedAt}</li>
                        <li>{'lockId :' + detailData.lockId}</li>
                      </ul>
                    )}
                  </>
                  :
                  <p>{JSON.stringify(detailData.content)}</p>

              }



            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

QueuePage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(QueuePage);
