import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Avatar, Grid, Icon } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { api, promisseApi } from '../../../api/api';
import { dataGridTexts } from '../../../components/DataGrid/gridTexts';
import AddButtonToolbar from '../../../components/DataGrid/addButtonToolbar';
import MailDialog from 'digi-components/Dialog/MailDialog';
import { useSnackbar } from 'notistack';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

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

}));

export default function LogisticaDetail(props) {
  const theme = useTheme();
  const classes = useStyles();

  const {
    handleClose, sellerId, intl, isOpen, handleRefreshClick
  } = props;
  
  const [seller, setSeller] = useState({});
  const [isNew, setIsNew] = useState(false);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [userData, setUserData] = useState([]);

  const [deleteRow, setDeleteRow] = useState({ open: false, rows: [] });

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

 

  const getFormData = () => {
    if (sellerId) {

      promisseApi(
        'get',
        `/seller/${sellerId}`,
        (data) => {
          setIsNew(false)
          setSeller(data)
        },
        (err)=> enqueueSnackbar(err, { variant: 'error' })
      )

      promisseApi(
        'get',
        `/seller/${sellerId}/user`,
        setUserData,
        (err)=> enqueueSnackbar(err, { variant: 'error' })
      )


    } else setIsNew(true);
  };

  const handleAddUser = (confirm, inputValue) => {
    if (confirm) {

      promisseApi(
        'post',
        '/seller/user',
        (data) => {
          enqueueSnackbar({ message: 'Usuário Adicionado com sucesso !', variant: 'success' });
          setAddUserOpen(false);
          handleClose(false);
          handleRefreshClick();
          
        },
        (err)=> enqueueSnackbar(err, { variant: 'error' }),
        {
          sellerIds: [sellerId],
          userMail: inputValue
        }
      )


    } else setAddUserOpen(false);
  };

  useEffect(() => {
    if (sellerId) getFormData();
    else {
      setIsNew(true);
      setSeller({});
    }
  }, [sellerId]);

  const submit = () => {
    setButtonSaveLoading(true);
    const { code, document, name } = values;
    const axios = isNew ? api.post : api.put;
    const endPoint = isNew ? '/seller/' : `/seller/${sellerId}`;
    axios(
      endPoint,
      { code, document, name }
    ).then((data) => {
  
      setButtonSaveLoading(false);
      handleClose(true);
    }).catch(error => {

      setButtonSaveLoading(false);
      (err)=> enqueueSnackbar(err, { variant: 'error' })
    });
  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(seller, true, submit, [
    {
      field: 'code',
      message: 'O Campo Código é obrigatório'
    },
    {
      field: 'name',
      message: 'O Campo Nome é obrigatório'
    },
    {
      field: 'document',
      message: 'O Campo Documento é obrigatório'
    }
  ]);


  const handleAdm = (selected, admin = false) => {
    let selectedUSers = selected.data.map(m=> {
      return userData[m.index];
    });

    promisseApi(
      'put',
      `/access/admin`,
      ()=>{
        enqueueSnackbar('Usuário(s) designado(s) com sucesso!', {variant: 'success' });
        getFormData();
      },
      (err)=> enqueueSnackbar(err, { variant: 'error' }),
      selectedUSers.map(m => {return m.userId}),    
      {
        headers: {
          sellerId: seller._id,
          admin
        }
      }
    )

  };

  const handleDeleteClose = (selected) => {
    let selectedUSers = selected.data.map(m=> {
      return userData[m.index];
    });

    if (selectedUSers) {
      promisseApi(
        'delete',
        `/seller/${sellerId}/users/${selectedUSers.map(m=>m._id).join(',')}`,
        () => {
          enqueueSnackbar('Usuário(s) deletado(s) com sucesso!', {variant: 'success' });
          setAddUserOpen(false);
          handleClose(false);
          handleRefreshClick();
        },
        (err)=> enqueueSnackbar(err, { variant: 'error' })
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
      name: 'userMail',
      label: 'E-mail',
    },
    {
      name: 'userImage',
      label: ' ',
      options: {
        customBodyRenderLite: (dataIndex) => {
          let userSelected = userData[dataIndex];

          return (
            <>
              <Avatar alt={dataIndex} src={userSelected.userImage}>
                {userSelected.userName && userSelected.userName.charAt(0)}
              </Avatar>
              {userSelected.admin && (<Tooltip title="Administrador"><Icon style={{display:'flex', marginLeft: -30, marginTop:-33, marginBottom: 10}}>verified_user</Icon></Tooltip>)}
            </>
          )
        },
      }
    }
  ];

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
    responsive: 'simple',
    tableBodyHeight: 170,
    tableBodyMaxHeight: 170,
    textLabels: dataGridTexts(intl),
    customToolbar: () => (
      <>
        <AddButtonToolbar handleClick={setAddUserOpen} icon="add" title="Adicionar" />
      </>
    ),
    onRowsDelete: (rowData) => {
      setDeleteRow({ open: true, rows: rowData.data.map(m => m.data[0]) });
    },
    customToolbarSelect: (selectedRows) => (
      <div className={classes.iconContainer}>
        <AddButtonToolbar handleClick={() => {handleDeleteClose(selectedRows)}}  icon="delete" title="Apagar Usuário" />
        <AddButtonToolbar handleClick={() => {handleAdm(selectedRows, true)}} icon="add_moderator" title="Adicionar Admin" />
        <AddButtonToolbar handleClick={() => {handleAdm(selectedRows, false)}} icon="remove_moderator" title="Remover Admin" />

      </div>
    ),
  };


  return (
    <>
      <AlertDialog
        isOpen={deleteRow.open}
        title="Deletar Usuário(s)"
        description="Deseja mesmo deletar o(s) usuários(s) selecionado(s)?"
        handleClose={handleDeleteClose}
      />

      <Dialog
        fullScreen={fullScreen}
        open={isOpen}
        onClose={() => handleClose(false)}
        TransitionComponent={Transition}
        maxWidth="md"
      >

        <Form onSubmit={handleSubmit}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={() => handleClose(false)} aria-label="Sair">
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                {seller.name}
              </Typography>
              <div className={classes.wrapper}>
                <IconButton
                  edge="start"
                  aria-label="Salvar"
                  color="inherit"
                  disabled={buttonSaveLoading}
                  type="submit"
                  className={classes.saveButton}
                >
                  <SaveIcon />
                </IconButton>

                {buttonSaveLoading && <CircularProgress size={50} className={classes.saveProgress} />}

              </div>
            </Toolbar>
          </AppBar>


          <Grid container className={classes.gridContainer}>
            <Grid item lg={6} sm={6} xs={12} className={classes.grid}>
              <Grid container justifyContent="center">
                <Controls.Input
                  disabled
                  label="Id"
                  name="_id"
                  value={values._id}
                  onChange={handleInputChange}
                  error={errors._id}
                />
                <Controls.Input
                  autoFocus
                  label="Código"
                  name="code"
                  value={values.code}
                  onChange={handleInputChange}
                  error={errors.code}
                />
                <Controls.Input
                  name="name"
                  label="Nome"
                  value={values.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
                <Controls.Input
                  label="CNPJ"
                  name="document"
                  value={values.document}
                  onChange={handleInputChange}
                  error={errors.document}
                  mask="99.999.999/9999-99"
                />
              </Grid>

            </Grid>
            <Grid item lg={6} sm={6} xs={12} className={classes.grid2}>
              <MUIDataTable
                title="Usuários"
                data={userData}
                columns={columns}
                options={options}
              // onChange={handleAddClick}
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
        </Form>
        
      </Dialog>

    </>
  );
}
