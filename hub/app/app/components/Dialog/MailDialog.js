import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { validateEmail } from '../../utils/formValidation';
import { useEffect } from 'react';
import { promisseApi } from '../../api/api';
import { useSnackbar } from 'notistack';

export default function MailDialog(props) {



  let { isOpen, title, description, handleClose, fieldLabel, fieldType } = props;
  const [value, setValue] = useState('');
  const [error, setError] = useState(true);
  const [helperText, setHelperText] = useState('Email inválido');
  const { enqueueSnackbar } = useSnackbar();


  const handleError = (error) => {
    setIsLoading(false);
    let message =
      error.cause ? error.cause[0].message :
        error.response ?
          error.response.data :
          error.message ? error.message : JSON.stringify(error)
            enqueueSnackbar(handleError(error), { variant: 'error' });
}


fieldType = fieldType ? fieldType : 'email';



const handleChange = (event) => {
  setValue(event.target.value);

  if (fieldType == 'email') {
    if (!validateEmail(value)) {
      setError(true);
      setHelperText('Email inválido');
    }
    else {
      setError(false);
      setHelperText('');
    }
  }
};

return (
  <div>


    <Dialog open={isOpen} onClose={() => { handleClose(false) }} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
        <TextField
          autoFocus
          id="name"
          value={value}
          onChange={handleChange}
          label={fieldLabel ? fieldLabel : 'Valor'}
          type={fieldType}
          fullWidth
          error={error}
          helperText={helperText}
        />


      </DialogContent>
      <DialogActions>
        <Button onClick={() => { handleClose(false) }} color="primary">
          Cancelar
        </Button>
        <Button
          disabled={error}
          onClick={() => { handleClose(true, value) }}
          color="primary"
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);
}