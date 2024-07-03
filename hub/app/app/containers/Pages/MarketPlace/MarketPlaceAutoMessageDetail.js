import { Accordion, AccordionSummary, AppBar, Chip, Dialog, Fab, Grid, Icon, makeStyles, Slide, Toolbar, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { promisseApi } from '../../../api/api';
import Controls from '../../../components/Forms/controls'
import { Form, useForm } from '../../../components/Forms/useForm'
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';


const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    paddingRight: 0
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  saveProgress: {
    position: 'absolute',
    top: -26,
    left: -23,
    zIndex: 1,
  },
  saveButton: {
    position: 'absolute',
    top: -14,
    left: -10,
    zIndex: 1,
  },
  wrapper: {
    position: 'relative',
  },
  fab: {
    margin: '5px',
    background: 'none',
    border: '1px solid #cdcdcd',
    color: '#cdcdcd',
    transition: 'all ease 0.3s',
    '&:hover': {
      color: '#000'
    }
  }

}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function MarketPlaceAutoMessageDetail(props) {
  const classes = useStyles()

  const [status, setStatus] = useState([]);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [messagePositionStart, setMessagePositionStart] = useState(0);
  const [messagePositionEnd, setMessagePositionEnd] = useState(0);
  const [autoMessageDetail, setAutoMessageDetail] = useState({});
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  let { autoMessageId, afterClose } = props;

  const buttonsOptions = [
    '${NumeroDoPedido}', '${idPedidoAny}', '${Nomecomprador}', '${PrimeiroNomecomprador}', '${ValorFrete}', '${NomeDestinatario}', 
    '${EnderecoEntrega}', '${ValorTotalPedido}', '${ProdutosPedido}', '${NotaFiscal}', '${DataEstimadaEntrega}', '${NotaFiscalNumero}',
    '${NotaFiscalSerie}', '${NotaChaveDeAcesso}', '${NotaFiscalDataDeEmissao}', '${NotaFiscalLinkDeAcesso}'
  ]

  let handleClose = () => {
    setOpen(false)
    if (afterClose) afterClose();
  }

  useEffect(() => {
    if (autoMessageId.isOpen) {
      setButtonSaveLoading(false);
      setOpen(autoMessageId.isOpen);
      setAutoMessageDetail(autoMessageId.id);
    }
  }, [autoMessageId])




  const submit = () => {
    setButtonSaveLoading(true);
      promisseApi(
        autoMessageDetail._id ? 'put' : 'post',
        autoMessageDetail._id ? `/marketplace/comments/${autoMessageDetail._id}` : '/marketplace/comments',
        () => {
          enqueueSnackbar('Mensagem salva com sucesso!', { variant: 'success' })
          setButtonSaveLoading(false);
          handleClose();
        },
        (err)=> enqueueSnackbar(err, { variant: 'error' }),
        values 
      )
  }    

  useEffect(() => {
    promisseApi(
      'get',
      `/selectlist/orderstatus`,
      (data) => {
        setStatus(data)
      },
    )
  }, []);

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    setValues
  } = useForm(autoMessageDetail, true, submit, [
    {
      field: 'platformId',
      message: 'O Campo Plataforma é obrigatório'
    },
    {
      field: 'sellerId',
      message: 'O Campo Empresa é obrigatório'
    },
    {
      field: 'marketPlaceId',
      message: 'O Campo Conta é obrigatório'
    },
    {
      field: 'orderStatus',
      message: 'O Campo Status é obrigatório'
    },
    {
      field: 'message',
      message: 'O Campo Período de Integração é obrigatório'
    }
  ]);

  return (
    <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}   fullScreen={fullScreen} maxWidth="md">
      <Form onSubmit={handleSubmit}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => {
              setOpen(false)
            }} aria-label="Sair">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.disabled ? 'Detalhes da Mensagem' : 'Criar Nova Mensagem'}
            </Typography>
            <div className={classes.wrapper}>
              <IconButton
                edge="start"
                aria-label="Salvar"
                color="inherit"
                disabled={buttonSaveLoading}
                type="submit"
                className={classes.saveButton}
              >
                <SaveIcon />
              </IconButton>

              {buttonSaveLoading && <CircularProgress size={50} className={classes.saveProgress} />}

            </div>
          </Toolbar>
        </AppBar>

        <Grid container style={{
          flexGrow: 1,
          padding: 10,
        }}>
          {/* <Grid item lg={12} sm={12} xs={12} style={{
            padding: 10,
            paddingTop: 0
          }}> */}
         
          <Grid item lg={6} sm={6} xs={12} style={{
            padding: 10,
            paddingTop: 0
          }}>
            <Controls.Select
              name="orderStatus"
              label="Status"
              value={values.orderStatus}
              onChange={handleInputChange}
              options={status}
              error={errors.orderStatus}
            />
          </Grid >
          <Grid item lg={12} sm={12} xs={12} style={{
            padding: 10,
            paddingTop: 0
          }}>
            <Accordion style={{ paddingLeft: '10px', paddingBottom: '10px' }} >
              <AccordionSummary
                expandIcon={<Icon color="primary">expand_more</Icon>}
                aria-controls="panel4bh-content"
                id="panel4bh-header"
              >
                <Icon color="primary" className={classes.Icon}>sort</Icon>Opções
              </AccordionSummary>
              {
                buttonsOptions.map((item) => (
                  <Chip
                    label={item}
                    style={{marginRight: 5, marginBottom: 5}}
                    // size="small"
                    onClick={() => {
                      let teste = values.message
                      let valor = {
                        ...values,
                        message: teste.substring(0, messagePositionStart) + item + ' ' + teste.substring(messagePositionEnd, teste.length)
                      }
                      setValues(valor)
                    }}
                  />
                    
                  
                ))
              }
            </Accordion>

            <Controls.Input
              label="Mensagem"
              name="message"
              value={values.message}
              onChange={handleInputChange}
              onClick={(element) => {

                setMessagePositionStart(element.target.selectionStart);
                setMessagePositionEnd(element.target.selectionEnd);

              }}
              error={errors.message}
              fullWidth
              multiline
            />
            <Controls.Switch
              label="Ativo"
              name="active"
              value={values.active}
              onChange={handleInputChange}
              error={errors.active}
            />
          </Grid>
        </Grid>
        <Grid />
        {/* </Grid> */}



      </Form>
    </Dialog>
  )
}