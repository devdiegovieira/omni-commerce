import React, { useEffect, useState } from 'react';
import { Avatar, Grid, Paper, Switch } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { injectIntl } from "react-intl";
import PageTitle from '../../../components/Header/PageTitle';
import UsersFilter from './UsersFilter';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import { promisseApi } from '../../../api/api';
import Controls from '../../../components/Forms/controls';
import UsersActions from './UsersAction';
import { useSnackbar } from 'notistack';
import { useForm } from '../../../components/Forms/useForm';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import UserResetPassword from './UserResetPassword';
import { setHours } from 'date-fns';

function UsersPage(props) {
  // const classes = useStyles();
  const { intl } = props;



  const [gridFilter, setGridFilter] = useState({
    limit: 25,
    offset: 0
  });


  const { enqueueSnackbar } = useSnackbar();

  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const [rowsSelected, setRowsSelected] = useState([]);

  const [gridData, setGridData] = useState([]);

  const [gridState, setGridState] = useState([]);

  const [valueReset, setValueReset] = useState([])






  const getGridData = () => {

    promisseApi(
      'get',
      '/user/usersPage',
      (data) => {
        setGridData(data.retFiltered);
        setGridState({ ...gridState, total: data.total })
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: gridFilter
      }
    )



  };

  useEffect(() => {
    getGridData();
  }, [gridFilter])



  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage });
      // sessionStorage.setItem('usersFilter', JSON.stringify({ ...gridFilter, offset: tableState.page * tableState.rowsPerPage }));
      // sessionStorage.setItem('usersState', JSON.stringify({ page: tableState.page, rowsPerPage: tableState.rowsPerPage }));
    }

    if (action == 'rowSelectionChange') {

      let selected = [];
      for (let row of tableState.selectedRows.data) {
        let data = gridData[row.dataIndex];
        if (data) {
          selected.push({
            _id: data._id,
          })

        }
      }
      setRowsSelected(selected);
    }
  };


  const handleRefreshClick = () => {
    getGridData();
  };

  const activeSuperUser = (value) => {
    promisseApi(
      'post',
      `/user/removeOrActiveSuperUser`,
      () => {
        enqueueSnackbar('Alterado com sucesso!', { variant: 'success' });
        handleRefreshClick();
        getGridData();
        
      },

      (err) => enqueueSnackbar(err.code, { variant: 'error' }),
      { _id: value._id ? [value._id] : rowsSelected.map(m => m._id), su: true },

    ) 
    setRowsSelected([]);
  };

  const inactiveSuperUser = (value) => {
    promisseApi(
      'post',
      `/user/removeOrActiveSuperUser`,
      () => {
        enqueueSnackbar('Alterado com sucesso!', { variant: 'success' });
        handleRefreshClick();
      },

      (err) => enqueueSnackbar(err.code, { variant: 'error' }),
      { _id: value._id ? [value._id] : rowsSelected.map(m => m._id), su: false },

    )
    setRowsSelected([]);
  };



  const blockUser = (value) => {
    promisseApi(
      'post',
      `/user/blockAccess`,
      () => {
        enqueueSnackbar('Usuário(s) bloqueado(s) com sucesso!', { variant: 'success' });
        handleRefreshClick();
      },

      (err) => enqueueSnackbar(err.code, { variant: 'error' }),
      { userIds: value._id ? [value._id] : rowsSelected.map(m => m._id), active: false },

    )
    setRowsSelected([]);
  };
  const unlockUser = (value) => {

    promisseApi(
      'post',
      `/user/blockAccess`,
      () => {
        enqueueSnackbar('Usuário(s) desbloqueado(s) com sucesso!', { variant: 'success' });
        handleRefreshClick();
      },
      (err) => enqueueSnackbar(err.code, { variant: 'error' }),
      { userIds: value._id ? [value._id] : rowsSelected.map(m => m._id), active: true }
    )
    setRowsSelected([]);
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
                variant="circular"
                alt={value.name}
                src={value.picture}
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
      name: 'name',
      label: 'Nome',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <>
              <p style={{ marginTop: 10 }}>{value.name}</p>
            </>
          )
        }

      }
    },
    {
      name: 'mail',
      label: 'Email',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex]
          return (
            <>
              <p>
                {value.mail ? value.mail.toString().substring(0, 40) : 'Sem título'}
              </p>

            </>
          )
        }
      }
    },
    {
      name: 'active',
      label: "Usuário Desbloqueado",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <Switch
              name="active"
              checked={value.active}
              onChange={() => {
                value.active = !value.active;
                value.active ? unlockUser(value) : blockUser(value);
                setGridData([...gridData])
              }}
            />
          )
        }
      }
    },
    {
      name: 'sellerNames',
      label: 'Empresas Vinculadas',
    },
    {
      name: 'document',
      label: 'Documento',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex]
          return (
            <>
              <p>
                {value.document ? value.document.toString().substring(0, 40) : 'Sem título'}
              </p>

            </>
          )
        }
      }
    },
    {
      name: 'su',
      label: "Super User",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];
          return (
            <Controls.Switch
              name="su"
              checked={value.su}
              onChange={() => {
                value.su = !value.su;
                value.su ? activeSuperUser(value) : inactiveSuperUser(value);
                setGridData([...gridData])
              }}
            />
          )
        }
      }
    },

    {
      name: 'reset_password',
      label: 'Resetar Senha',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex]
          return (
            <ButtonDefault
              name="reset_password"
              label="Resetar Senha"
              icon="key"
              onClick={() => { setResetPasswordOpen(true); setValueReset(value); }}
            />
          )
        }
      }
    },


  ];


  const options = {
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    rowsPerPageOptions: [25, 50, 100],
    filter: false,
    search: false,
    print: false,
    count: gridState.total,
    sort: false,
    selectableRows: true,
    download: false,
    jumpToPage: true,
    responsive: "scrollMaxHeight",
    viewColumns: false,
    page: gridState.page,
    setTableProps: () => ({
      size: 'small'
    }),
    filterType: 'multiselect',
    textLabels: dataGridTexts(intl),
    responsive: 'simple',
    onTableChange: handleGridState,
    customToolbar: () => (
      <>
        <Grid container  >
          <Grid item xs={12} style={{ display: 'flex' }}  >
            <UsersActions
              activeSuperUser={activeSuperUser}
              inactiveSuperUser={inactiveSuperUser}
              blockUser={blockUser}
              unlockUser={unlockUser}
              rowsSelected={rowsSelected}
              gridFilter={gridFilter}
            />

          </Grid>

          <UserResetPassword valueReset={valueReset} setResetPasswordOpen={setResetPasswordOpen} open={resetPasswordOpen} />

        </Grid>
      </>
    ),
    downloadOptions: {
      filterOptions: {
        useDisplayedColumnsOnly: true,
        useDisplayedRowsOnly: true
      }
    },

    selectToolbarPlacement: 'none'
  };

  const filterSubmit = (filter) => {
    sessionStorage.setItem('UsersFilter', JSON.stringify({ ...filter, limit: 25, offset: 0 }));
    sessionStorage.setItem('usersState', JSON.stringify({ limit: 25, offset: 0 }));
    setGridFilter({ ...filter, limit: 25, offset: 0 })
  }

  return (
    <div>
      <Helmet>
        <title>Usuários</title>
        <meta name="description" content={'Gerenciamento de Usuários do Sistema'} />
        <meta property="og:title" />
        <meta property="og:description" />
        <meta property="twitter:title" />
        <meta property="twitter:description" />
      </Helmet>
      <Grid item style={{ marginBottom: 18 }} xs={12}>
        <PageTitle icon={'account_circle'} label={'Usuários'} />
      </Grid>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <UsersFilter
              filter={gridFilter}
              setGridFilter={setGridFilter}
              filterSubmit={filterSubmit}
            />
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
    </div>
  )
};
export default injectIntl(UsersPage);