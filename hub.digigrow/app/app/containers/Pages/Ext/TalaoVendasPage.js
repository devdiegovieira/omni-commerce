import Icon from "@material-ui/core/Icon";
import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Grid, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Form, useForm } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import { PaperBlock } from 'digi-components';
import { promisseApi } from "../../../api/api";
import { handleError } from "../../../utils/error";
import { useSnackbar } from 'notistack';

let password = 'Zeene@2022';

export default function TalaoVendasPage() {
  const [formData, setFormData] = useState({ password: sessionStorage.getItem('loggedExt') ? password : undefined });
  const [talaoVendas, setTalaoVendas] = useState([]);
  const [showPassword, setShowPassword] = useState(!(sessionStorage.getItem('loggedExt') == 'true'));
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    document.body.style.zoom = "80%";
  }, [])

  const submit = () => {
    promisseApi(
      'get',
      `/dashboard/invento/salesslip/${values.orderNumber}`,
      (data) => {setTalaoVendas(data)},
      (err)=> enqueueSnackbar(err, { variant: 'error' })
    )
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(formData, true, submit, [
    {
      field: 'orderNumber',
      message: 'O Campo Número do Pedido de Venda é obrigatório'
    },
    {
      field: 'password',
      message: 'Senha inválida',
      rule: (fieldValue) => {
        return fieldValue.password != password;
      }
    }
  ]);

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.setItem('loggedExt', values.password != password ? 'false' : 'true')
    setShowPassword(values.password != password)
  }


  let dividerStyle = { padding: 0, marginTop: 0, marginBottom: 0 };


  let tableHeader = (
    <Grid item xs={12}>
      <Grid container >
        <Grid item xs={2}>
          <Grid container justifyContent="center">
            <b>Código</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <b>Descricao</b>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>Qtd.</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>Vl. Unit.</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>Vl. Negoc.</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>Dif. em %</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>X18</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>CC 1</b>
          </Grid>
        </Grid>

        <Grid item xs={1}>
          <Grid container justifyContent="center">
            <b>CC 2</b>
          </Grid>
        </Grid>

        <Grid item xs={2}>
          <Grid container justifyContent="center">
            <b>Total</b>
          </Grid>
        </Grid>

        <Grid item xs={12} style={{ marginTop: 5, marginBottom: 5 }}>
          <hr style={dividerStyle} />
        </Grid>
      </Grid>



    </Grid>
  )

  return (
    <div style={{backgroundColor:'white'}}>
      <Grid container >

        {/* filter */}
        <Grid item xs={12}>
          <Box component="span" displayPrint="none">
            <Form onSubmit={handleSubmit}>
              {/* Senha */}
              <Dialog
                open={showPassword}
              // onClose={() => setOpen({ open: false })}
              >
                <Form onSubmit={handleLogin}>
                  <DialogContent>
                    <Grid container >
                      <Grid item xs={12} >
                        Preencha a Senha para Continuar
                      </Grid>
                      <Grid item xs={12} >
                        <Controls.Input
                          autoFocus
                          name="password"
                          label="Senha"
                          value={values.password}
                          type="password"
                          onChange={handleInputChange}
                          error={errors.password}
                        />
                      </Grid>

                    </Grid>

                  </DialogContent>
                  <DialogActions>

                    <Button
                      color="primary"
                      type="submit"
                    >
                      Logar
                    </Button>
                  </DialogActions>
                </Form>
              </Dialog>


              {/* Página */}
              <PaperBlock
                icon='receipt'
                title='Talão de Vendas'
                style={{ margin: 10 }}
              >

                <Grid container>

                  <Grid item xl={10} lg={10} md={10} sm={12} xs={12} style={{ marginTop: -10 }}>
                    <Controls.Input
                      name="orderNumber"
                      label="Número do Pedido de Venda"
                      value={values.orderNumber}
                      onChange={handleInputChange}
                      error={errors.orderNumber}
                    />
                  </Grid>

                  <Grid item xl={2} lg={2} md={2} sm={12} xs={12} style={{ marginTop: 5 }}>
                    <Grid container justifyContent="center">
                      <Button
                        type="submit"
                        style={{ height: 48 }}
                        fullWidth
                      >
                        <Icon style={{ marginRight: 5 }}>visibility</Icon>
                        Processar
                      </Button>
                    </Grid>
                  </Grid>


                </Grid>


              </PaperBlock>

              {talaoVendas.length > 0 && (
                <Grid item xs={12}>
                  <Button
                    style={{ height: 48 }}
                    fullWidth
                    onClick={() => { window.print() }}
                  >
                    <Icon style={{ marginRight: 5 }}>print</Icon>
                    Imprimir
                  </Button>
                </Grid>
              )}


            </Form>
          </Box>
        </Grid>
        {/* filter */}


        {/* report */}
        {
          talaoVendas.length > 0 && (
            <>
              <Grid item xs={12} >
                {/* <Paper style={{ margin: 20, padding: 10 }}> */}
                <Grid container>
                  <Grid item xs={12} style={{ marginTop: 5, marginBottom: 15 }}>
                    <hr style={dividerStyle} />
                  </Grid>

                  <Grid item xs={2}>
                    <Grid container justifyContent="center">
                      <img src="https://s3-sa-east-1.amazonaws.com/fabiani-ecommerce/brands/logos/000/000/174/medium/Automotive_Imports.jpg?1459384022" style={{ height: 60, marginLeft: 15}} />
                      {/* <img src="https://www.zeene.com.br/wp-content/uploads/2021/02/sk.png" style={{ height: 60 }} /> */}
                    </Grid>
                  </Grid>

                  <Grid item xs={6} style={{ paddingTop: 15 }}>
                    <Grid container justifyContent="center">
                      <b style={{ fontSize: 18 }}>Talão de Vendas</b>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid container justifyContent="center">

                      <Grid item xs={4}>
                        <p style={{ fontSize: 15 }}>Pedido de Venda</p>
                      </Grid>
                      <Grid item xs={8}>
                        <b style={{ fontSize: 15 }}>{talaoVendas[0].numero}</b>
                      </Grid>
                      <Grid item xs={4}>
                        <p style={{ fontSize: 15 }}>Data do Talão</p>
                      </Grid>
                      <Grid item xs={8}>
                        <b style={{ fontSize: 15 }}>{new Date(talaoVendas[0].dataTalao).toLocaleString()}</b>
                      </Grid>

                    </Grid>
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: 5, marginBottom: 55 }}>
                    <hr style={dividerStyle} />
                  </Grid>

                  <Grid item xs={4} style={{ paddingLeft: 10 }}>
                    Nome: <b>{talaoVendas[0].nomeComprador}</b>
                  </Grid>
                  <Grid item xs={4} >
                    CNPJ: <b>{talaoVendas[0].documento}</b>
                  </Grid>
                  <Grid item xs={1}>
                    UF: <b>{talaoVendas[0].uf}</b>
                  </Grid>
                  <Grid item xs={2}>
                    Prazo: <b>{talaoVendas[0].prazo}</b>
                  </Grid>

                  <Grid item xs={6} style={{ paddingLeft: 10 }}>
                    Transportadora: <b>{talaoVendas[0].transportadora}</b>
                  </Grid>
                  <Grid item xs={6}>
                    Vendedor: <b>{talaoVendas[0].vendedor}</b>
                  </Grid>
                  <Grid item xs={6} style={{ paddingLeft: 10 }}>
                    Unidade de Negócio: <b>{talaoVendas[0].unidadeNegocio}</b>
                  </Grid>
                  <Grid item xs={6}>
                    Representante: <b>{talaoVendas[0].representante}</b>
                  </Grid>

                  <Grid item xs={12} style={{ paddingLeft: 10 }}>
                    Observação: <b>{talaoVendas[0].mensagem}</b>
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: 30 }}>
                    <hr style={dividerStyle} />
                  </Grid>

                  {/* -------------------------------------- */}


                </Grid>
                {/* </Paper> */}
              </Grid>


              {
                talaoVendas.map((m, i) => {
                  let diff = ( (m.valorUnitarioNegociado * m.quantidade) / (m.valorUnitario * m.quantidade) ) - 1;

                  return (
                    <>
                      {(i == 0 || i == 10) && tableHeader}

                      {(i > 20 && (i - 10) % 14 == 0) && (<Grid item xs={12} style={{ marginTop: (i - 14) + 8 }}>{tableHeader}</Grid>)}
                      
                      <Grid item xs={12} style={{backgroundColor: diff > -1 && diff < 0 ? '#EEEEEE' : 'inherit', }}>
                        <Grid container>
                          <Grid item xs={2}>
                            <Grid container justifyContent="center">
                              {m.sku}
                            </Grid>
                          </Grid>

                          <Grid item xs={10}>
                            {m.skuDescricao}  
                          </Grid>

                          <Grid item xs={3}></Grid>

                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                              {m.quantidade}
                            </Grid>
                          </Grid>

                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                            {m.valorUnitario.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })} {m.promo? (<b>[P]</b>) : ''}
                            </Grid>
                          </Grid>


                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                              {m.valorUnitarioNegociado != m.valorUnitario && m.valorUnitarioNegociado.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={1} >
                            <Grid container justifyContent="center">
                              {((m.valorUnitarioNegociado / m.valorUnitario) - 1).toLocaleString('pt-BR', {
                                style: 'percent',
                                minimumFractionDigits: 2
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                              {m.custo.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                              {m.precoC.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={1}>
                            <Grid container justifyContent="center">
                              {m.precoR.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={2}>
                            <Grid container justifyContent="center">
                              {m.valorBruto.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </Grid>
                          </Grid>

                          <Grid item xs={12} style={{ marginTop: 5, marginBottom: 5 }}>
                            <hr style={dividerStyle} />
                          </Grid>


                        </Grid>
                      </Grid>

                    </>
                  )
                })
              }

              <Grid item xs={12} style={{ paddingRight: 15 }}>
                <Grid container justifyContent="flex-end">
                  Total Pedido: <b>{talaoVendas.reduce((n, row) => n + (row.valorUnitario * row.quantidade), 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}</b>
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ paddingRight: 15 }}>
                <Grid container justifyContent="flex-end">
                  Total Negociado: <b>{talaoVendas.reduce((n, row) => n + (row.valorUnitarioNegociado * row.quantidade), 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}</b>
                </Grid>
              </Grid>


              <Grid item xs={12} style={{ paddingRight: 15 }}>
                <Grid container justifyContent="flex-end">
                  Dif. em %: <b>{((
                    talaoVendas.reduce((n, row) => n + (row.valorUnitarioNegociado * row.quantidade), 0) /
                    talaoVendas.reduce((n, row) => n + (row.valorUnitario * row.quantidade), 0)) - 1
                  ).toLocaleString('pt-BR',
                    {
                      style: 'percent',
                      minimumFractionDigits: 2
                    }
                  )}</b>
                </Grid>
              </Grid>


              <Grid item xs={12} style={{ marginTop: 5, marginBottom: 5 }}>
                <hr style={dividerStyle} />
              </Grid>

            </>
          )
        }


      </Grid>


    </div>
  )

};