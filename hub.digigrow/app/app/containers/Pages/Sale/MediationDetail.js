import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Chip, Dialog, DialogActions, DialogContent, Divider, Grid, Hidden, Icon, ListItem, ListItemAvatar, ListItemText, Paper, Toolbar, Tooltip, Typography } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import { cep, cpfMasks } from '../../../utils/dynamicMasks';
import { useForm, Form } from '../../../components/Forms/useForm';
import List from '@material-ui/core/List';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import GoBackHeader from '../../../components/GoBackHeader';
import { MessageMediate } from './MessageMediate';
import Controls from '../../../components/Forms/controls';


export default function MediationDetail(props) {
  const { orderId } = props;
  const [saleData, setSaleData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  const [dialog, setDialog] = useState(false);


  useEffect(() => {
    promisseApi(
      'get',
      '/user/superuser',
      (data) => setUser(data),
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' })
    );
    getOrderDetail();

  }, []);

  const getOrderDetail = () => {
    promisseApi(
      'get',
      `/order/${orderId}`,
      (data) => setSaleData(data)
      ,
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' })
    );
  };

  const submit = () => {
    try {

       let form = new FormData();
       for (let newImg of values.picture) {
         form.append("image", newImg.file, newImg.file.name);
      }

      promisseApi(
        'put',
        '/order/mediate',
        (data) => {
          enqueueSnackbar('Mensagem enviada com sucesso!', { variant: 'success' });
          getOrderDetail();
        },
        (err) => enqueueSnackbar(handleError(err), { variant: 'error' }),
        form,
        {
          headers: {
            'content-type': 'multipart/form-data'
          },
          params: { externalId: orderId, allowReplace: true, message: values.message, _id: values._id, message: values.message }
        }
      )

    } catch (error) {
      console.log(error)
    }
  };

  const fileChange = (images, field) => {
    values[field] = images;
    setSaleData({ ...values })
  }

  const closeMed = (e) => {
    promisseApi(
      'post',
      '/order/mediate',
      () => {
        getOrderDetail()
        enqueueSnackbar('Mediação Encerrada!', { variant: 'success' })
        window.location.href = `/sale/mediation`
      },
      {},
      {},
      {
        params: { externalId: orderId, status: 'closed', situation: values.operation }
      }
    )
  }


  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
  } = useForm(saleData, true, submit, []);


  return (<>
    <GoBackHeader label={'Mediação'} />
    <Grid container spacing={1}>
      {/* Ações */}

      {/* Cabeçalho */}
      <Grid item xs={12}>
        <Paper style={{ padding: 25 }} elevation={2} >

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                  <Grid container>

                    <Grid item style={{ paddingRight: 7, marginTop: 12, fontSize: 15 }} >

                      <Icon>compare_arrows</Icon>

                    </Grid>

                    <Grid item style={{ marginTop: 4 }}>
                      <Chip
                        label='Pedido'
                        // variant="contained"
                        size="small"
                        style={{ marginTop: 7, paddingLeft: 5, marginBottom: 4, fontSize: 10, fontWeight: 600 }}
                      />
                    </Grid>

                    <Grid item style={{ marginTop: 5 }}>
                      <Typography style={{ paddingLeft: 7, fontWeight: 600, paddingTop: 7 }} >
                        {saleData.packId ? saleData.packId : saleData.externalId}
                      </Typography>
                    </Grid>

                  </Grid>
                </Grid>


                {user &&
                  <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                    <Grid container justifyContent='flex-end'>



                      <Grid item style={{ marginTop: 5 }}>
                        <Tooltip
                          title={'Salvar'}
                          arrow

                        >

                          <Button
                            // onClick={() => closeMed('closed')}
                            onClick={() => setDialog(true)}
                            type="submit"
                            startIcon={<Icon>do_disturb_on_icon</Icon>}
                            variant='contained'
                            color='primary'
                            size="small"
                            style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }}
                          >
                            Encerrar mediação
                          </Button>

                        </ Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>
                }


              </Grid>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper style={{ borderRadius: '20px', overflow: 'hidden' }} elevation={0}>

              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              {/* <SaleActions orderDetail={saleData} /> */}
            </Grid>
          </Grid>

          <Grid container  >

            <Grid item xs={12} style={{ padding: 10 }}>
              <Grid container spacing={2}>
                <Grid item xl={3} lg={3} md={12} xs={12}>
                  <b>Pedido</b>
                  <hr style={{ marginTop: 3, marginBottom: 3 }} />
                  <p style={{ fontSize: 14, padding: 0, margin: 0 }}>Numero do Pedido: <b>{saleData.packId ? saleData.packId : saleData.externalId}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}>E-mail: <b>{saleData.buyer ? saleData.buyer.email.substring(0, 25) : ''}</b></p>

                  <p style={{ fontSize: 14, margin: 0 }}>Data do Pedido <b>{saleData.dateClosed && new Date(saleData.dateClosed).toLocaleString()}</b></p>
                </Grid>
                <Grid item xl={3} lg={3} md={12} xs={12}>
                  <b>Pagamento</b>
                  <hr style={{ fontSize: 14, marginTop: 3, marginBottom: 3 }} />
                  <p style={{ fontSize: 14, margin: 0 }}>Total Pago: <b>{saleData && saleData.gross >= 0 && saleData.gross.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}>Frete: {saleData.freightSeller ? (-saleData.freightSeller).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }) : 0} </p>
                </Grid>
                <Grid item xl={3} lg={3} md={12} xs={12}>
                  <b>Comprador</b>
                  <hr style={{ marginTop: 3, marginBottom: 3, paddingRight: 5 }} />
                  <p style={{ fontSize: 14, margin: 0 }}>Nome: <b>{saleData.buyer ? saleData.buyer.name : ''}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}> Endereço: <b>{saleData.shipping && (saleData.shipping.street.substring(0, 100))}, {saleData.shipping && (saleData.shipping.number)}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}><b>{saleData.shipping && (saleData.shipping.neighborhood)}, {saleData.shipping && (saleData.shipping.city)} - {saleData.shipping && (saleData.shipping.state)}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}>CEP: <b>{saleData.shipping && (cep(saleData.shipping.zipCode))}</b></p>
                  <p style={{ fontSize: 14, margin: 0 }}>{saleData.buyer ? saleData.buyer.documentType : ''}<b>: {saleData.buyer ? cpfMasks(saleData.buyer.document) : ''}</b></p>
                </Grid>

                <Grid item xl={3} lg={12} md={12} xs={12}> </Grid>


              </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Grid>

      {/* Ítens do pedido */}
      <Grid item xs={12} >
        <Paper style={{ padding: 30 }} elevation={2} >
          <p style={{ fontSize: 12, padding: 0, margin: 0 }}> <b> Itens |</b> Carrinho</p>
          <Divider sytle={{ margin: 0 }} />

          <List>
            <ListItem>
              <ListItemAvatar>
              </ListItemAvatar>
              <Grid container>
                <Hidden mdDown>
                  <Grid item lg={3} xs={12}>
                    <b>Produto</b>
                  </Grid>
                  <Grid item lg={2} xs={12}>
                    <b>SKU</b>
                  </Grid>
                  <Grid item lg={1} xs={12}>
                    <b> Qtde.</b>
                  </Grid>

                  <Grid item lg={2} xs={12}>
                    <b>Valor</b>
                  </Grid>
                  <Grid item lg={2} xs={12}>
                    <b></b>
                  </Grid>
                  <Grid item lg={2} xs={12}>

                  </Grid>
                </Hidden>
              </Grid>
            </ListItem>


            {saleData.items && saleData.items.map(m => {
              let listingType;
              switch (m.listingType) {
                case 'gold_pro':
                  listingType = 'Premuim'
                  break;
                case 'gold_special':
                  listingType = 'Clássico'
                  break;
              }
              return (
                <ListItem >
                  <ListItemAvatar xs={12} style={{ marginBottom: 10 }}>
                    <Avatar src={m.skuImage}>{m.sku.substring(0, 1)} </Avatar>
                  </ListItemAvatar>

                  <Grid container>
                    <Grid item lg={3} xs={12}>
                      <p style={{ fontSize: 14, color: 'grey' }}>
                        {m.title}
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>
                      <p style={{ fontSize: 14, color: 'grey' }}>
                        {m.sku}
                      </p>
                    </Grid>
                    <Grid item lg={1} xs={12}>
                      <p style={{ fontSize: 14, color: 'grey' }}>
                        {m.amount}
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>

                      <p style={{ fontSize: 14, color: 'grey' }}>
                        {m.gross.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </Grid>

                    <Grid item lg={2} xs={12}>

                    </Grid>
                    <Grid item lg={2} xs={12}>

                      <p style={{ fontSize: 14, color: 'grey' }}>

                      </p>
                    </Grid>




                  </Grid>
                  <Divider />
                </ListItem>

              )
            })}
          </List>

        </Paper>
      </Grid >
      {/* Observações do pedido */}
      <Grid item xs={12}>
        <MessageMediate handleSubmit={handleSubmit} values={values} saleData={saleData} handleInputChange={handleInputChange} fileChange={fileChange}/>
      </Grid>

      <Dialog
        open={dialog}
        onClose={() => handleClose(false)}
      >
        <AppBar style={{ position: 'relative' }}>

          <Toolbar style={{ minWidth: 400 }} >
            <Grid item xs={12}>
              <Typography>Encerrar Mediação</Typography>
            </Grid>

          </Toolbar>

        </AppBar>

        <DialogContent style={{ padding: 20 }} >
          <Form onSubmit={closeMed}>
            <Grid container>
              <Grid item xs={12}  >
                <Controls.Select
                  label="Situação de encerramento"
                  name="operation"
                  value={values.operation}
                  onChange={(e) => handleInputChange(e)}
                  error={errors.operation}
                  options={[{ id: 'change', title: 'Troca' },
                  { id: 'devolution', title: ' Produto Devolvido' },
                  { id: 'remained', title: ' Cliente preferiu permanecer com o produto' }]}
                />
              </Grid>

              <Grid container >
                <Grid item={12}>
                  <Typography>

                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </DialogContent>



        <DialogActions>
          <Button onClick={() => { setDialog(false); clean() }} variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} startIcon={<Icon>close</Icon>} color="primary">
            Cancelar
          </Button>
          <Button disabled={!find} type='submit' variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} startIcon={<Icon>do_disturb_on_icon</Icon>} onClick={(e) => closeMed(e)} color="primary" autoFocus>
            Encerrar
          </Button>

        </DialogActions>
      </Dialog>

    </Grid >
  </>)
}
