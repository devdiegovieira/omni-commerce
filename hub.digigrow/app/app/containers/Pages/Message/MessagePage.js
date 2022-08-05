import { Avatar, Grid, List, ListItem, Paper, IconButton, Icon, Collapse, Typography, Chip, Divider, Button } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { injectIntl } from 'react-intl';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import { capitalizeFirst } from '../../../utils/dynamicMasks';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import SendIcon from '@material-ui/icons/Send';
import ButtonDefault from '../../../components/Button/ButtonDefault';

export function MessagePage(props) {

  let { setCountQuestion } = props;

  const [meliMessages, setMeliMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [clearIsLoading, setClearIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    />
  ));


  const [anchorEl, setAnchorEl] = useState(null);
  const [response, setResponse] = useState([]);
  const [sellerSelectList, setSellerSelectList] = useState([]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
  } = useForm(response, true, submit, []);

  const sendMessage = (meliMessage) => {

    promisseApi(
      'post',
      '/messages/responsequestions',
      () => {
        enqueueSnackbar('Mensagem enviada!', { variant: 'success' });
        getQuestions();
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        sellerInfos: meliMessage,
        message: meliMessage.answser,
      }
    );

  }

  const submit = () => {
    getQuestions()
    setIsLoading(true)
  }



  useEffect(() => {
    getQuestions();
  }, [])

  const loadFilter = () => { 
    setIsLoading(true)}

  const getQuestions = () => {
   
    promisseApi(
      'get',
      `/selectlist/sellerId`,
      (data) => {
        setSellerSelectList(data)
        setIsLoading(false);
        setClearIsLoading(false);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

    promisseApi(
      'get',
      '/messages/list',
      (data) => {
        setMeliMessages(data)
        setCountQuestion(data.length)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      { params: { sellerId: values.sellerId } }
    );
  }

  const checkMessageRead = (row) => {
    promisseApi(
      'post',
      '/messages/checkReadMessages',
      (data) => {
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        externalId: row.externalId
      },
      {},
    );
  }

  const deleteQuestions = (meliMessage) => {
    promisseApi(
      'delete',
      '/messages/deletequestion',
      (data) => {
        enqueueSnackbar('Pergunta eliminada!', { variant: 'error' });
      },
      handleError,
      {
        sellerInfos: meliMessage,
      },
      {},
    );
  }

  const handleResetFilter = () => {
    values.sellerId = undefined;
    getQuestions();
    setClearIsLoading(true)
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Grid container style={{ paddingLeft: 10 }} spacing={1} >

            <Grid container>
              <Grid item xs={12} lg={4}>
                <Form onSubmit={handleSubmit}>
                  <Controls.MultiSelect
                    label="Empresa"
                    name="sellerId"
                    fullwidth
                    onChange={e => {
                      handleInputChange(e)
                    }}
                    op
                    options={sellerSelectList}
                    value={values.sellerId}
                  />

                </Form>
              </Grid>

              <Grid item lg={4} xs={12} style={{marginTop:25}}>
                <Grid container spacing={2}>
                  <Grid item lg={4} xs={6}>
                    <ButtonDefault
                      onClick={() => {getQuestions(); loadFilter()}}
                      type='submit' 
                      label={'Filtrar'}
                      isLoading={isLoading}
                      disabled={isLoading}
                      icon={'filter_list'} />
                  </Grid>
                  <Grid item lg={4} xs={6}>
                    <ButtonDefault
                      onClick={() => {
                        handleResetFilter()
                      }}
                      isLoading={clearIsLoading}
                       disabled={clearIsLoading}
                      label={'Limpar Filtros'}
                      icon={'clear'}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: 10 }} />
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <List style={{ overflow: 'auto', height: window.innerHeight - 250 }}>
              {Array.isArray(meliMessages) && meliMessages.length == 0 &&
                <ListItem>
                  <Grid container justifyContent='center'>
                    Sem mensagens para mostrar
                  </Grid>
                </ListItem>
              }

              {Array.isArray(meliMessages) && meliMessages.map((meliMessage) => {
                return (
                  <ListItem
                    button
                    onClick={() => { meliMessages.map(m => { if (m._id != meliMessage._id) m.open = false }); meliMessage.open = !meliMessage.open; setMeliMessages([...meliMessages]); }}
                    selected={meliMessage.sell == true}
                  >
                    <Grid container >
                      <Grid item xs={11}>
                        {`Conta: ${capitalizeFirst(meliMessage.sellerName)} | ${capitalizeFirst(meliMessage.name)}`}
                      </Grid>
                      <p style={{ marginTop: 5 }}> {new Date(meliMessage.createdAt).toLocaleDateString()} </p>

                      <p>
                        <IconButton
                          aria-controls="customized-menu"
                          aria-haspopup="true"
                          variant="contained"
                        >
                          <Icon>{!meliMessage.open ? 'expand_more' : 'expand_less'}</Icon>
                        </IconButton>

                      </p>
                      <Grid item xs={12}>
                        <Collapse in={meliMessage.open} timeout="auto" unmountOnExit >
                          <Paper>
                            <Grid container>

                              <Grid item style={{ padding: 10 }} >
                                <Avatar style={{ width: 100, height: 100 }} src={meliMessage.publishPictures}>
                                  {!meliMessage.publishPictures && meliMessage.name ? meliMessage.name.substring(0, 1).toUpperCase() : ''}
                                </Avatar>
                              </Grid>

                              <Grid item style={{ paddingTop: 32 }} >
                                <Typography style={{ fontSize: 25, opacity: 0.7 }} >{meliMessage.publishName}</Typography>

                                <Chip color='primary' label={meliMessage.price.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',

                                })} style={{ opacity: 0.7, borderRadius: 0 }} >  </Chip>
                              </Grid>
                              <Grid item >
                                <Typography style={{ paddingLeft: 15, paddingTop: 40, opacity: 0 }}  > {meliMessage.externalId}</Typography>
                                <IconButton
                                  autoFocus
                                  onClick={() => {
                                    window.location.href = `/publish/${meliMessage.externalId}`;
                                  }}
                                >

                                </IconButton>
                              </Grid>
                              <Grid item style={{ paddingTop: 10, paddingLeft: 40 }} >
                                <Grid container justifyContent='flex-end'>
                                  <Button style={{ textTransform: 'none' }} startIcon={<ClearIcon />} onClick={() => deleteQuestions(meliMessage)}>
                                    Excluir
                                  </Button>
                                </Grid>
                              </Grid>
                              <Grid item xs={11} style={{ paddingLeft: 20, paddingBottom: 0, paddingTop: 30 }} >
                                <Chip label={meliMessage.message} style={{ borderRadius: 3, width: '100%', justifyContent: 'flex-start' }} avatar={<Avatar><Icon style={{ fontSize: 15 }} >chat_bubble_outline</Icon></Avatar>} color='primary' />
                              </Grid>
                              {meliMessage.answer &&
                                <Grid item xs={11} style={{ paddingLeft: 20, paddingBottom: 0, paddingTop: 5 }} >
                                  <Chip label={meliMessage.answer} style={{ borderRadius: 3, width: '100%', justifyContent: 'flex-start' }} avatar={<Avatar><Icon style={{ fontSize: 15 }} >chat_bubble_outline</Icon></Avatar>} color='primary' />
                                </Grid>
                              }
                              <Grid item xs={1} style={{ marginTop: 30 }} >

                              </Grid>

                              <Grid item xs={12} style={{ paddingBottom: 10 }} >

                                <Form onSubmit={(e) => { e.preventDefault(); sendMessage(meliMessage); }}>
                                  <Grid container spacing={2}>

                                    <Grid item xs={11} style={{ paddingLeft: 25, paddingTop: 0 }}>

                                      <Controls.Input
                                        label="Responda em detalhes ..."
                                        name="message"
                                        multiline
                                        autoFocus
                                        value={meliMessage.answser}
                                        inputProps={{ maxLength: 2000 }}
                                        onChange={(e) => { meliMessage.answser = e.target.value; setMeliMessages([...meliMessages]) }}
                                      />
                                    </Grid>

                                    <Grid item xs={1} style={{ marginTop: 22, padding: 0 }}>
                                      <Button type="submit" startIcon={<SendIcon />} >

                                      </Button>



                                    </Grid>
                                  </Grid>




                                </Form>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Collapse>
                      </Grid>

                    </Grid>
                  </ListItem>
                )
              })}
            </List>
          </Grid >
        </Paper>
      </Grid >
    </Grid >
  );
}
export default injectIntl(MessagePage);
