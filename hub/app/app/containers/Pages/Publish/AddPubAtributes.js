import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Icon, IconButton, InputAdornment, List, ListItem, TextField, useTheme } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import { capitalizeFirst } from '../../../utils/dynamicMasks';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

export default function AddPubAttributes(props) {

  let { open, setOpen, onSubmit, publishData } = props;


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
        `/selectlist/pubatt`,
        (data) => setAttIds(data),
        (err)=> enqueueSnackbar(err, { variant: 'error' }),
        {

        },
        {
          params: {
            category: publishData.category
          }
        }
      );
    }
  }, [open])

  useEffect(() => {
    if (attSelected && typeof attSelected == 'string') {


      promisseApi(
        'get',
        `/selectlist/pubatt/${attSelected}/value`,
        (data) => setAttValues(data),
        (err)=> enqueueSnackbar(err, { variant: 'error' })
      );
    } else {
      setAttValues([])
    }

  }, [attSelected])


  const submit = () => {
    let validação = publishData.attributes.find(f => f.name.toLowerCase()  == values.attId.toLowerCase() && (f.custom || f.combination))

    if (!validação) {
      onSubmit({ ...values, ...publishData });
      setOpen({open:false});
    }
    else {
    
      enqueueSnackbar(`O atributo ${values.attId} já existe na variação`, { variant: 'error' })
    }
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
  } = useForm(att, true, submit, [
    {
      field: 'attId',
      message: 'O Campo Atributo é obrigatório'
    },
    {
      field: 'attValues',
      message: 'O Campo Valor é obrigatório'
    }
  ]);

  return (

    <Dialog
      open={open}
      onClose={() => setOpen({ open: false })}
      fullScreen={fullScreen}
    >
      <Form onSubmit={handleSubmit}>
        <DialogTitle id="alert-dialog-title">{`Novo atributo no: ${publishData.sku}`}</DialogTitle>
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
                  setAttSelected(e.target.value),
                  capitalizeFirst
                }}
                onInputChange={handleInputChange}
                options={attIds}
                error={errors.attId}
                freeSolo
              />
            </Grid>
            <Grid item xs={12} >
              <Controls.AutoComplete
                name="attValues"
                label="Valor"
                value={values.attValues}
                onChange={e => {
                  handleInputChange(e)
                }}
                onInputChange={handleInputChange}
                options={attValues}
                error={errors.attValues}
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