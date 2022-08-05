import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Divider, Grid, Hidden, ListItemText, Paper, Tooltip, } from '@material-ui/core';

import { promisseApi } from '../../../api/api';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { Chip } from '@material-ui/core';
import SaleTracking from './SaleTracking';
import { capitalizeFirst, cep, cpfMasks } from '../../../utils/dynamicMasks';
import SaleActions from './SaleActions';
import SaleUpXml from './SaleUpXml';
import Controls from '../../../components/Forms/controls';
import { useForm, Form } from '../../../components/Forms/useForm';
import List from '@material-ui/core/List';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import GoBackHeader from '../../../components/GoBackHeader';


export default function SaleDetail(props) {
  const { orderId } = props;
  const [saleData, setSaleData] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    promisseApi(
      'get',
      `/order/${orderId}`,
      (data) => setSaleData(data)
      ,
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )


  }, [orderId]);

  const orderDate = (a, b) => {
    return new Date(b.date) - new Date(a.date);
  }

  const submit = () => {

    promisseApi(
      'put',
      `/order/note/${orderId}`,
      () => {

        promisseApi(
          'get',
          `/order/${orderId}`,
          (data) => setSaleData(data)
          ,
          (err) => enqueueSnackbar(err, { variant: 'error' })
        )
        enqueueSnackbar('Observação gravada com sucesso', { variant: 'success' });
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),

      {
        note: values.newNote
      }
    )
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
  } = useForm(saleData, true, submit, []);

  const handleDeleteNote = (message, userId, date) => {
    promisseApi(
      'delete',
      `/order/note/${orderId}`,
      (r) => {

        promisseApi(
          'get',
          `/order/${orderId}`,
          (data) => setSaleData(data)
          ,
          (err) => enqueueSnackbar(err, { variant: 'error' })
        )

        enqueueSnackbar('Mensagem Deletada com sucesso', { variant: 'success' });

      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        message,
        userId,
        date
      }
    )
  }


  return (<>
    <GoBackHeader label={'Vendas'} />
    <Grid container spacing={1}>
      {/* Ações */}

      {/* Cabeçalho */}
      <Grid item xs={12}>
        <Paper style={{ padding: 35 }} elevation={2} >

          <Grid container spacing={2}>
            <Grid item xs={12} lg={4} style={{ padding: 7 }}>
              <b style={{}}>Pedido: {saleData.packId ? saleData.packId : saleData.externalId} </b> | Tracking: {saleData.shipping ? saleData.shipping.shippingId : saleData.shippingId}

            </Grid>

            <Grid item xs={12} lg={4}>
              <Paper style={{ borderRadius: '20px', overflow: 'hidden' }} elevation={0}>
                <SaleTracking sale={saleData} />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <SaleActions orderDetail={saleData} setSaleData={setSaleData} />
            </Grid>
          </Grid>
          <hr />
          <Grid container  >
            {/* Dados venda */}
            <Grid item xs={12} style={{ padding: 10 }}>
              <Grid container spacing={9}>
                <Grid item lg={3} xs={12}>
                  <b>Pedido</b>
                  <hr style={{ marginTop: 3, marginBottom: 3 }} />
                  <p style={{ padding: 0, margin: 0 }}>Numero do Pedido: <b>{saleData.packId ? saleData.packId : saleData.externalId}</b></p>
                  {/* <p style={{ margin: 0 }}>E-mail: <b>{saleData.buyer ? saleData.buyer.email : ''}</b></p> */}
                  {/* <p style={{ margin: 0 }}>Plataforma: {saleData.platformName}</p> */}
                  {/* <p style={{ margin: 0 }}>Conta: {saleData.marketPlaceName}</p> */}
                  <p style={{ margin: 0 }}>Data do Pedido <b>{saleData.dateClosed && new Date(saleData.dateClosed).toLocaleString()}</b></p>
                </Grid>
                <Grid item lg={3} xs={12}>
                  <b>Pagamento</b>
                  <hr style={{ marginTop: 3, marginBottom: 3 }} />
                  <p style={{ margin: 0 }}>Total Pago: <b>{saleData && saleData.gross >= 0 && saleData.gross.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}</b></p>
                  <p style={{ margin: 0 }}>Frete: <b>{saleData.freightSeller ? (saleData.freightSeller).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }) : 'R$ 0'}</b></p>
                </Grid>
                <Grid item lg={3} xs={12}>
                  <b>Comprador</b>
                  <hr style={{ marginTop: 3, marginBottom: 3 }} />
                  <p style={{ margin: 0 }}>Nome: <b>{saleData.buyer ? capitalizeFirst(saleData.buyer.name) : ''}</b></p>
                  <p style={{ margin: 0 }}> Endereço: <b>{saleData.shipping && (saleData.shipping.street.substring(0, 100))}, {saleData.shipping && (saleData.shipping.number)}</b></p>
                  <p style={{ margin: 0 }}><b>{saleData.shipping && (capitalizeFirst(saleData.shipping.neighborhood))}, {saleData.shipping && (capitalizeFirst(saleData.shipping.city))} - {saleData.shipping && (saleData.shipping.state)}</b></p>
                  <p style={{ margin: 0 }}>CEP: <b>{saleData.shipping && (cep(saleData.shipping.zipCode))}</b></p>
                  <p style={{ margin: 0 }}>{saleData.buyer ? saleData.buyer.documentType : ''}<b>: {saleData.buyer ? cpfMasks(saleData.buyer.document) : ''}</b></p>
                </Grid>
                <Grid item lg={3} xs={12}>
                  <b >XML</b>
                  <hr style={{ marginTop: 3, marginBottom: 3 }} />
                  <SaleUpXml orderId={orderId} />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Grid>

      {/* Ítens do pedido */}
      <Grid item xs={12} >
        <Paper style={{ padding: 30 }} elevation={2} >
          <p style={{ padding: 0, margin: 0 }}> <b> Itens |</b> Carrinho</p>
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
                    <b>Anúncio</b>
                  </Grid>
                  <Grid item lg={2} xs={12}>
                    <b>Tipo</b>
                  </Grid>
                  <Grid item lg={2} xs={12}>
                    <b>Valor</b>
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
                      <p style={{ color: 'grey' }}>
                        {m.title}
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>
                      <p style={{ color: 'grey' }}>
                        {m.sku}
                      </p>
                    </Grid>
                    <Grid item lg={1} xs={12}>
                      <p style={{ color: 'grey' }}>
                        {m.amount}
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>

                      <p style={{ color: 'grey' }}>
                        {m.publishId}
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>

                      <p>
                        <Chip
                          label={listingType}
                          variant="outlined"
                          size="small"
                          style={{
                            borderColor: 'orange'
                          }}
                        />
                      </p>
                    </Grid>
                    <Grid item lg={2} xs={12}>

                      <p style={{ color: 'grey' }}>
                        {m.gross.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </Grid>


                    <Grid item xs={12}><Divider /></Grid>

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
        <Paper
          style={{ padding: 30 }}
          elevation={2}
        >
          <p style={{ margin: 0 }}> <b> Observação</b></p>
          <hr style={{ margin: 0 }} />
          <Form onSubmit={handleSubmit}>
            <List style={{ height: (values.note ? 100 * values.note.length : 0), display: 'flex', flexFlow: 'column' }}>
              {values.note && Array.isArray(values.note) && values.note.sort(orderDate).map((m, index) => {

                return (
                  <>
                    <div>
                      <div>
                        <p style={{ marginTop: 5 }}>
                          {(m.userName) + ' | ' + new Date(m.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) + ' ' + new Date(m.date).toLocaleTimeString('pt-BR')}
                        </p>
                        <p style={{ marginBottom: 5, paddingLeft: 5 }}>{m.message}</p>
                      </div>

                      <div
                        style={{
                          width: '100px',
                          padding: '10px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          color: '#9370DB',
                        }}
                        onClick={() => handleDeleteNote(m.message, m.userId, m.date)}>
                        Deletar
                      </div>


                    </div>
                  </>
                )
              })}
            </List>

            <Controls.Input
              label="Digite aqui..."
              name="newNote"
              value={values.newNote}
              onChange={handleInputChange}
              error={errors.newNote}
              fullWidth
              multiline
            />

            <Button
              size="small"
              color="primary"
              type="submit"

            >
              Salvar
            </Button>
          </Form>
        </Paper>
      </Grid>
    </Grid >
  </>)
}

