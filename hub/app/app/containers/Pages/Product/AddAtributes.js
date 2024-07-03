import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Icon, IconButton, InputAdornment, List, ListItem, TextField, useTheme } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

export default function AddAttributes(props) {

  let { open, setOpen, skuCode, onSubmit } = props;


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [att, setAtt] = useState({});

  const [attIds, setAttIds] = useState([]);
  const [attValues, setAttValues] = useState([]);
  const [attSelected, setAttSelected] = useState();
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (open) {
      setAtt({});
      setAttSelected();
      setAttValues([]);

      promisseApi(
        'get',
        `/selectlist/skuatt`,
        (data) => setAttIds(data),
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );

    }
  }, [open])

  useEffect(() => {
    if (attSelected && typeof attSelected == 'string') {


      promisseApi(
        'get',
        `/selectlist/skuatt/${attSelected}/value`,
        setAttValues,
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );
    } else {
      setAttValues([])
    }

  }, [attSelected])


  const submit = () => {

    let validation = skuCode.attributes.find(f => f.id.toLowerCase() == values.attId.toLowerCase())

    values.sku = skuCode.sku;

    if (!validation) {
      onSubmit(values);
      setOpen({ open: false });
    }
    else {
      enqueueSnackbar(`O atributo ${values.attId} já existe na variação`, { variant: 'error' })
    }



  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(att, true, submit, [
    {
      field: 'attId',
      message: 'O Campo Atributo é obrigatório'
    },
    {
      field: 'attValue',
      message: 'O Campo Valor é obrigatório'
    }
  ]);

  return (

    <Dialog
      open={open}
      IconButton
      disabled onClose={() => setOpen([])}
      fullScreen={fullScreen}
    >
      <Form onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title">{`Novo atributo no: ${skuCode.sku}`}</DialogTitle>
        <DialogContent>
          <Grid container >
            <Grid item xs={12} >
              <Controls.AutoComplete
                autoFocus
                name="attId"
                label="Atributo"
                value={values.attId}
                onChange={e => {
                  handleInputChange(e)
                  setAttSelected(e.target.value)
                }}
                onInputChange={handleInputChange}
                options={attIds}
                inputProps={{ maxLength: 20 }}
                error={errors.attId}
                freeSolo
              />
            </Grid>
            <Grid item xs={12} >
              <Controls.AutoComplete
                name="attValue"
                label="Valor"
                value={values.attValue}
                onChange={e => {
                  handleInputChange(e)
                }}
                onInputChange={handleInputChange}
                inputProps={{ maxLength: 20 }}
                options={attValues}
                error={errors.attValue}
                freeSolo
              />

            </Grid>

          </Grid>

        </DialogContent>
        <DialogActions>

          <Button onClick={() => setOpen({ open: false })} color="primary">
            Cancelar
          </Button>

          <Button
            type="submit"
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  )
}