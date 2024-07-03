import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import MailDialog from 'digi-components/Dialog/MailDialog';
import Notification from 'digi-components/Notification';
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

  const { displayData, selectedRows, getGridData } = props;

  const handleDelete = (confirm) => {
    if (confirm) {
      const selected = selectedRows.data.map(m => displayData[m.dataIndex].data[0]);

      api.delete(
        `/seller/${selected.join(',')}`
      ).then(
        data => {
          enqueueSnackbar('Registro(s) deletado(s) com sucesso!',{variant: 'success' });
          getGridData();
          setDeleteOpen(false);
        }
      ).catch(
        (err)=> enqueueSnackbar(err, { variant: 'error' })
      );
    } else setDeleteOpen(false);
  };

  const handleAddUser = (confirm, inputValue) => {
    if (confirm) {
      const selected = selectedRows.data.map(m => displayData[m.dataIndex].data[0]);

      api.post(
        '/seller/user',
        {
          sellerIds: selected,
          userMail: inputValue
        }
      ).then(
        data => {
          enqueueSnackbar('Registro(s) deletado(s) com sucesso!', {variant: 'success' });
          setAddUserOpen(false);
        }
      ).catch(
        (err)=> enqueueSnackbar(err, { variant: 'error' })
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
        description="Digite o email do usuário que deseja adionar às empresas selecionadas"
        handleClose={handleAddUser}
        fieldLabel="Email"
        fieldType="email"
      />
    </>
  );
}
