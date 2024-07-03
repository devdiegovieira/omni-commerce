import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Avatar, Chip, Grid, Icon } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import { green } from '@material-ui/core/colors';
import { promisseApi } from '../../../api/api';
import { dataGridTexts } from '../../../components/DataGrid/gridTexts';
import AddButtonToolbar from '../../../components/DataGrid/addButtonToolbar';
import MailDialog from 'digi-components/Dialog/MailDialog';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1,
    padding: 10,
  },
  appBar: {
    position: 'relative',
    paddingRight: 0
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  grid: {
    padding: 10,
    paddingTop: 0
  },
  grid2: {
    padding: 10,
    paddingTop: 15
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
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#58F808'
  },


}));

export default function SellerDetail(props) {
  const theme = useTheme();
  const classes = useStyles();

  const {
    sellerId, intl, handleRefreshClick
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [deleteRow, setDeleteRow] = useState({ open: false, rows: [] });

  const getUserXSeller = () => {

    promisseApi(
      'get',
      `/seller/${sellerId}/user`,
      (data) => {
        setRowsSelected();
        setUserData(data);
      },
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' })
    )

  };

  const handleAddUser = (confirm, inputValue) => {
    if (confirm) {
      promisseApi(
        'post',
        '/seller/user',
        (data) => {
          enqueueSnackbar('Usuário Adicionado !', { variant: 'success' });
          setAddUserOpen(false);
          getUserXSeller();
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        {
          sellerIds: [sellerId],
          userMail: inputValue
        }
      );
    } else setAddUserOpen(false);
  };

  useEffect(() => {
    if (sellerId)
      getUserXSeller();
  }, [sellerId]);

  const handleAdm = (selected, admin = false) => {
    let selectedUSers = selected.data.map(m => {
      return userData[m.index];
    });

    promisseApi(
      'put',
      `/access/admin`,
      () => {
        enqueueSnackbar('Status de administrador alterado com sucesso!', { variant: 'success' });
        getUserXSeller();
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      selectedUSers.map(m => { return m.userId }),
      {
        headers: {
          sellerId,
          admin
        }
      }
    )

  };

  const handleDeleteClose = (selected) => {
    let selectedUSers = selected.data.map(m => {
      return userData[m.index];
    });

    if (selectedUSers) {
      promisseApi(
        'delete',
        `/seller/${sellerId}/users/${selectedUSers.map(m => m._id).join(',')}`,
        () => {
          enqueueSnackbar('Usuário(s) deletado(s) com sucesso!', { variant: 'success' });
          setAddUserOpen(false);
          handleRefreshClick();
          getUserXSeller();
        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );
    }

    setDeleteRow({ open: false, rows: [] });



  };


  const columns = [
    {
      name: '_id',
      label: 'Id',
      options: {
        display: false
      }
    },
    {
      name: 'userImage',
      label: ' ',
      options: {
        customBodyRenderLite: (dataIndex) => {
          let userSelected = userData[dataIndex];

          return (
            <>
              {userSelected && !userSelected.pending && (
                <Grid item >
                  <Grid container justifyContent='flex-start'>
                    <Avatar alt={dataIndex} src={userSelected.userImage} style={{ marginLeft: 43 }}>
                      {userSelected.userName && userSelected.userName.charAt(0)}
                    </Avatar>
                  </Grid>
                </Grid>
              )}

              {userSelected && userSelected.pending && (
                <Grid item >
                  <Grid container justifyContent='flex-start'>
                    <Chip
                      style={{ width: 120 }}
                      label='Pendente'
                      variant="outlined"

                    />
                  </Grid>
                </Grid>

              )}
            </>

          )
        },
      }
    },
    {
      name: 'userMail',
      label: 'E-mail',
    },
    {
      name: 'Admnistrador',
      label: 'Administrador ',
      options: {
        customBodyRenderLite: (dataIndex) => {
          let userSelected = userData[dataIndex];

          return (
            <>
              <Grid item>
                <Grid container justifyContent='flex-start'>
                  {userSelected.admin && (<Tooltip title="Administrador"><Icon style={{ marginLeft: 35 }}>verified_user</Icon></Tooltip>)}
                  {!userSelected.admin && (<Tooltip title="Administrador"><Icon style={{ marginLeft: 35, color: 'lightgray' }}>verified_user</Icon></Tooltip>)}

                </Grid>
              </Grid>
            </>
          )
        }
      }
    },


  ];

  const [rowsSelected, setRowsSelected] = useState();

  const options = {
    setTableProps: () => ({
      // padding: 'none',
      size: 'small'
    }),
    filter: false,
    search: false,
    print: false,
    download: false,
    viewColumns: false,
    pagination: false,
    sort: false,
    responsive: 'simple',
    tableBodyHeight: 320,
    tableBodyMaxHeight: 320,
    textLabels: dataGridTexts(intl),
    rowsSelected,
    customToolbar: () => (
      <>
        <AddButtonToolbar handleClick={setAddUserOpen} icon="add" title="Adicionar" />
      </>
    ),
    onRowsDelete: (rowData) => {
      setDeleteRow({ open: true, rows: rowData.data.map(m => m.data[0]) });
    },
    customToolbarSelect: (selectedRows) => (
      <div >
        <AddButtonToolbar handleClick={() => { handleDeleteClose(selectedRows) }} icon="delete" title="Apagar Usuário" />
        <AddButtonToolbar handleClick={() => { handleAdm(selectedRows, true) }} icon="add_moderator" title="Adicionar Admin" />
        <AddButtonToolbar handleClick={() => { handleAdm(selectedRows, false) }} icon="remove_moderator" title="Remover Admin" />

      </div>
    ),
  };

  return (
    <>
      <Grid container className={classes.gridContainer}>
        <Grid item lg={12} sm={12} xs={12} className={classes.grid2}>
          <MUIDataTable
            title="Usuários"
            data={userData}
            columns={columns}
            options={options}

          />
        </Grid>

      </Grid>
      <MailDialog
        isOpen={addUserOpen}
        title="Adicionar Usuário"
        description="Digite o email do usuário que deseja adionar às empresas selecionadas"
        handleClose={handleAddUser}
        fieldLabel="Email"
        fieldType="email"
      />


    </>
  );
}
