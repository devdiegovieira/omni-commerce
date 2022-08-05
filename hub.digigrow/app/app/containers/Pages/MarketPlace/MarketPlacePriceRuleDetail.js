import React, { useState, useEffect } from 'react';
import { Button, Dialog, Grid, makeStyles, Slide, useMediaQuery, useTheme } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import PriceRuleOption from './PriceRuleOption';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1,
    padding: 10,
  },
  appBar: {
    position: 'relative',
    paddingRight: 0
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  grid: {
    padding: 10,
    paddingTop: 0
  },
  grid2: {
    padding: 10,
    paddingTop: 15
  },
  saveProgress: {
    color: green[500],
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

}));

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function MarketPlacePriceRuleDetail(props) {
  const classes = useStyles();

  const { priceRuleId, afterClose } = props;
  const [isNew, setIsNew] = useState(false);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [priceRule, setPriceRule] = useState({ startDate: new Date(), endDate: new Date() });
  const [priceRuleOptions, setPriceRuleOptions] = useState([]);
  const [dynamicSelectList, setDynamicSelectList] = useState([]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  let handleClose = () => {
    setOpen(false);
    if (afterClose) afterClose();
  }

  useEffect(() => {
    if (priceRuleId.isOpen) setOpen(priceRuleId.isOpen);
  }, [priceRuleId])



  const handlePlatformOptions = (platformId) => {
    if (platformId)
      promisseApi(
        'get',
        `/pricerule/options/${platformId}`,
        (data) => {
          setPriceRuleOptions(data)

          data.filter(f => f.data.type == 'api').map(m => {
            promisseApi('get', m.data.value, (dynData) => {
              setDynamicSelectList({ ...dynamicSelectList, [m.type]: dynData })
            }, (err) => enqueueSnackbar(err, { variant: 'error' }));
          })

        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      )
    else
      setPriceRuleOptions([]);
  }

  useEffect(() => {
    if (priceRuleId.id) {
      promisseApi(
        'get',
        `/pricerule/${priceRuleId.id}`,
        (data) => {
          let publishFilter = {};
          for (let filter of data.publishFilters) {
            if (filter.values)
              for (let value of filter.values) {
                publishFilter[value] = true;
              }
          }
          handlePlatformOptions(data.platformId);

          setIsNew(false);
          setPriceRule({ ...data, ...data.calc, ...publishFilter });

        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      );

      // asyncApi(priceRuleId);
    } else {
      setIsNew(true);
      setPriceRule({
        platformId: priceRuleId.platformId,
        marketPlaceId: priceRuleId.marketPlaceId,
        sellerId: priceRuleId.sellerId
      });

      handlePlatformOptions(priceRuleId.platformId);
    };

  }, [priceRuleId]);

  const requiredFields = [
    {
      field: 'title',
      message: 'O Campo Nome é obrigatório'
    },
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
      field: 'value',
      message: 'O campo Valor é obrigatório'
    },
    {
      field: 'operation',
      message: 'O campo Operação é obrigatório'
    },
    {
      field: 'value',
      message: 'O campo V'
    }
  ];

  const submit = () => {

    values['publishFilters'] = [];

    for (let priceRuleOption of priceRuleOptions) {
      if (priceRuleOption.data.type == 'list') {
        let newValues = [];
        for (let value of priceRuleOption.data.value) {
          handleClose
          if (values[value.code]) {
            newValues.push(value.code)
          }
        }

        if (newValues.length)
          values['publishFilters'].push({
            field: priceRuleOption.type,
            values: newValues
          })

      }
      if (priceRuleOption.data.type == 'api') {


        values['publishFilters'].push({
          field: priceRuleOption.type,
          values: values[priceRuleOption.type]
        })

      }
    }


    setButtonSaveLoading(true);

    promisseApi(
      isNew ? 'post' : 'put',
      `/pricerule/${!isNew ? priceRuleId.id : ''}`,//colocar ${priceRuleId},

      data => {
        setButtonSaveLoading(false);
        handleClose(true);
      },
      error => {
        setButtonSaveLoading(false);
        enqueueSnackbar({ message: error.response ? error.response.data : error.message ? error.message : JSON.stringify(error), variant: 'error' });
      },
      values,

    );
  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(priceRule, true, submit, requiredFields);

  return (
    <Form onSubmit={handleSubmit}>

      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} fullScreen={fullScreen} maxWidth="md">
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => handleClose(false)} aria-label="Sair">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {priceRule.name}
            </Typography>
            <div className={classes.wrapper}>
              <Button type='submit' variant='outlined' onClick={() => submit()}>Salvar</Button>

              {buttonSaveLoading && <CircularProgress size={50} className={classes.saveProgress} />}

            </div>
          </Toolbar>
        </AppBar>

        <Grid container className={classes.gridContainer}>
          <Grid item lg={6} sm={6} xs={12} className={classes.grid}>
            <Grid container justifyContent="center">
              <Controls.Input
                autoFocus
                label="Nome da regra"
                name="title"
                value={values.title}
                onChange={handleInputChange}
                error={errors.title}
              />


              <Controls.Input
                label="Valor"
                name="value"
                type="number"
                value={values.value}
                onChange={handleInputChange}
                error={errors.value}
              />

              <Controls.Select
                label="Operação"
                name="operation"
                value={values.operation}
                onChange={handleInputChange}
                error={errors.operation}
                options={[{ id: '*', title: 'Multiplicação' }, { id: '/', title: 'Divisão' }, { id: '+', title: 'Soma' }]}
              />
              <Controls.DatePicker
                label="Início"
                name="startDate"
                value={values.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
              />
              <Controls.DatePicker
                name="endDate"
                label="Fim"
                value={values.endDate}
                onChange={handleInputChange}
                error={errors.endDate}
              />
              <Controls.Switch
                name="active"
                label="Ativo"
                value={values.active}
                onChange={handleInputChange}
                error={errors.active}
              />
            </Grid>
          </Grid>

          <Grid item lg={6} sm={6} xs={12} className={classes.grid2}>
            {priceRuleOptions.map(m => (
              <PriceRuleOption title={m.title} icon={m.icon}>
                {
                  m.data.type == 'list'
                  && m.data.value.map(option => (
                    <Controls.Switch
                      label={option.title}
                      name={option.code}
                      value={values[option.code]}
                      onChange={handleInputChange}
                      error={errors[option.code]}
                    />
                  ))
                }
                {
                  m.data.type == 'api'
                  && (
                    <Controls.MultiSelect
                      name={m.type}
                      label="Loja Oficial"
                      value={values[m.type]}
                      onChange={handleInputChange}
                      options={dynamicSelectList[m.type] ? dynamicSelectList[m.type] : []}
                      error={errors[m.type]}
                      style={{ marginRight: 20 }}
                    />
                  )
                }
              </PriceRuleOption>
            ))}
          </Grid>

        </Grid>
      </Dialog>
    </Form>

  );
}
