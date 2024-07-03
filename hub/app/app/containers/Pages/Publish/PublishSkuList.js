import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Dialog, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar } from '@material-ui/core';
import { useForm, Form } from '../../../components/Forms/useForm';

import { promisseApi } from '../../../api/api';

import PaginatePublish from './PaginatePublish';
import SearchIcon from '@material-ui/icons/Search';

import { handleError } from '../../../utils/error';

import CloseIcon from '@material-ui/icons/Close';
import Controls from '../../../components/Forms/controls';


function PublishSkuList(props) {

  let { publish, handleSelectSku } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [skuFilter, setSkuFilter] = useState({ limit: 25, offset: 0, onlyVar: true });
  const [sku, setSku] = useState({});

  const [form, setForm] = useState({});

  useEffect(() => {
    if (publish) {
      setIsOpen(true);
      setSkuFilter({ ...skuFilter, sellerId: [publish.sellerId], offset: 0 })
    }

  }, [publish])


  useEffect(() => {
    promisseApi(
      'get',
      '/sku',
      (data) => {
        setSku(data)
      },
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' }),
      {},
      {
        params: skuFilter
      }
    )
  }, [skuFilter])

  const submit = () => {
    setSkuFilter({ ...skuFilter, ...values, offset: 0 });
  }

  const {
    values,
    handleInputChange,
    handleSubmit,
  } = useForm(form, true, submit, []);


  const pageChange = (page) => {
    setSkuFilter({ ...skuFilter, offset: page.page * page.rowsPerPage, limit: page.rowsPerPage });
  }

  const handleSku = (sku) => {
    handleSelectSku(sku);
    setIsOpen(false);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => { setIsOpen(false) }}
    >

      <Form onSubmit={handleSubmit}>
        <AppBar style={{
          position: 'relative',
          paddingRight: 0
        }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setIsOpen(false);
              }}
              aria-label="Sair"
            >
              <CloseIcon />
            </IconButton>

          </Toolbar>

        </AppBar>

        <Grid container style={{
          flexGrow: 1,
          padding: 10,
        }}>

          <Grid item xs={12} >

            <Controls.Input
              autoFocus
              style={{ marginTop: 0 }}
              name="code"
              label='Pesquisar Variação'
              onChange={handleInputChange}
              value={values.code}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Buscar"
                      type="submit"
                      edge="end"
                      style={{ marginRight: 1 }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />


          </Grid>

          <Grid item xs={12}  >
            {/* <Paper> */}

            <List style={{

              height: 290,
              width: '200',
              overflow: 'auto'
            }} >
              {Array.isArray(sku.list) && sku.list.length > 0 && sku.list.map(m => (

                <ListItem
                  button
                  onClick={() => handleSku(m)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <img src={Array.isArray(m.images) && m.images[0]} />
                      {m.sku ? m.sku.charAt(0) : ''}
                    </Avatar>

                  </ListItemAvatar>
                  <ListItemText primary={m.sku + ' - ' + (m.title ? m.title : 'Sem título')} secondary={m.sellerName} />
                </ListItem>
              )
              )}
              {
                (!Array.isArray(sku.list) || sku.list.length == 0) &&
                <ListItem>
                  <ListItemText primary='Nenhuma variação encontrada' secondary='para esta empresa' />
                </ListItem>
              }
            </List>

            {/* </Paper> */}
          </Grid>

          <Grid item xs={12} >
            <Grid container justifyContent='center'>
              <PaginatePublish total={sku.total} page={sku.offset ? sku.offset / sku.limit : 0} rowsPerPage={sku.limit} pageChange={pageChange} />
            </Grid>
          </Grid>
        </Grid>

      </Form>
    </Dialog>
  )

}

export default PublishSkuList;
