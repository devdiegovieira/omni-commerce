import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import MailDialog from 'digi-components/Dialog/MailDialog';
import { api } from '../../../api/api';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  iconButton: {
  },
  iconContainer: {
    marginRight: '24px',
  },
}));


export default function SellerSelectToolbar(props) {
  const classes = useStyles();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { sellerIds, getGridData } = props;

  const handleDelete = (confirm) => {
    if (confirm) {

      api.delete(
        `/seller/${sellerIds.map(m => m._id).join(',')}`
      ).then(
        data => {
          enqueueSnackbar('Registro(s) deletado(s) com sucesso!', { variant: 'success' });
          setDeleteOpen(false);
          handleRefreshClick();

        }
      ).catch(
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );
    } else setDeleteOpen(false);
  };


  const handleRefreshClick = () => {
    getGridData();
  }

  const handleAddUser = (confirm, inputValue) => {
    if (confirm) {

      const selectedIds = [];
      sellerIds.map((r) => {
        selectedIds.push(r._id)
      })

      api.post(
        '/seller/user',
        {
          sellerIds: selectedIds,
          userMail: inputValue
        }
      ).then(
        data => {
          enqueueSnackbar('Registro(s) atribuído(s) com sucesso!', { variant: 'success' });
          setAddUserOpen(false);
          handleRefreshClick();
        }
      ).catch(
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );
    } else setAddUserOpen(false);
  };



  return (
    <>

      <AlertDialog
        isOpen={deleteOpen}
        title="Deletar Registro(s)"
        description="Deseja mesmo deletar o(s) registro(s) selecionado(s)?"
        handleClose={handleDelete}
      />

      <MailDialog
        isOpen={addUserOpen}
        title="Adicionar Usuário"
        description="Digite o email do usuário que deseja adicionar às empresas selecionadas"
        handleClose={handleAddUser}
        fieldLabel="Email"
        fieldType="email"
      />

      <div className={classes.iconContainer}>
        <Tooltip title="Adicionar Usuário">
          <IconButton className={classes.iconButton} onClick={() => { setAddUserOpen(true); }}>
            <Icon className={classes.icon}>person_add</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Apagar">
          <IconButton className={classes.iconButton} onClick={() => { setDeleteOpen(true); }}>
            <Icon className={classes.icon}>delete</Icon>
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}
