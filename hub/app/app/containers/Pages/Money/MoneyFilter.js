import { Grid, IconButton, InputAdornment, Modal, Paper, Switch, Typography } from '@material-ui/core';
import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import { addDays } from "date-fns";
import Checkbox from '../../../components/Forms/controls/Checkbox';
import { DateRange } from 'react-date-range';
import DateRangeIcon from '@material-ui/icons/DateRange';
import PeriodPicker from '../../../components/Forms/controls/PeriodPicker';

export default function MoneyFilter(props) {

  const [sellerList, setSellerList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [checked, setChecked] = useState(false);


  useEffect(() => {
    let filterDate = { ...date }
    values.dateFrom = filterDate[0].startDate;
    values.dateTo = filterDate[0].endDate;
  }, [])

  let {
    filter,
    setFilter,
    isLoading,
    clearIsLoading,
    setClearIsLoading,
    setIsLoading,
  } = props;

  const [date, setDate] = useState([
    {
      startDate: filter.dateFrom || new Date(),
      endDate: filter.dateTo || new Date(),
      key: "selection",
    },
  ]);

  const dateSubmit = () => {
    let filterDate = { ...date }
    values.dateFrom = filterDate[0].startDate;
    values.dateTo = filterDate[0].endDate;
  };

  const submit = () => {
    let filterDate = { ...date }
    values.dateFrom = filterDate[0].startDate;
    values.dateTo = filterDate[0].endDate;
    setFilter(values);
    setIsLoading(true)
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(filter, true, submit, []);

  
  // const handleChange = (e) => {
  //   setChecked(e.target.checked);
  //   handleInputChange();
  // };

  useEffect(() => {
    promisseApi('get',
      '/selectlist/sellerid',
      setSellerList,
      (err) => enqueueSnackbar(err, { variant: 'error' }));
  }, [])


  const handleResetFilter = () => {
    setFilter({
      limit: 25,
      offset: 0,
      payBack: false,
      dateClosedFrom: new Date(),
      dateClosedTo: new Date()
    });
    setChecked(false);
    resetForm();
  }

  return (
    <Form onSubmit={handleSubmit}>

      <Grid container spacing={1}  >

        <Grid item xs={6} lg={3} style={{ paddingTop: 0, paddingBottom: 0 }} >
          <Controls.Input

            label="Período:"
            name="dateFrom"
            startIcon={'calendar_month'}
            value={`Período de ${(values.dateFrom ? values.dateFrom : new Date()).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
              } até ${(values.dateTo ? values.dateTo : new Date()).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}
            onChange={() => setDialogOpen(true)}
            onClick={() => setDialogOpen(true)}
            error={errors.dateFrom}
            InputProps={{
              endAdornment: (<InputAdornment position="end">
                <IconButton>
                  {<DateRangeIcon />}
                </IconButton>
              </InputAdornment>
              )
            }}
          />
        </Grid>




        <Grid item xs={6} lg={3} style={{ paddingTop: 0, paddingBottom: 0 }} >
          <Controls.MultiSelect
            label="Status"
            name="paymentStatus"
            value={values.paymentStatus}
            onChange={e => {
              handleInputChange(e)
            }}
            options={[
              {
                id: 'received',
                title: 'Previsto',
                checked: 'false',

              },
              {
                id: 'concluded',
                title: 'Fechamentos anteriores',
                checked: 'false',

              },
              {
                id: 'pending',
                title: 'Sem previsão',
                checked: 'false',

              }
            ]}
            error={errors.paymentStatus}
          />
        </Grid>

        <Grid item xs={6} lg={3} style={{ paddingTop: 0, paddingBottom: 0 }} >
          <Controls.Input
            label="Venda"
            name="orderId"
            value={values.orderId}
            onChange={e => {
              handleInputChange(e)
            }}
            error={errors.orderId}
          />
        </Grid>

        <Grid item xs={6} lg={3} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Controls.MultiSelect
            name="sellerId"
            label="Empresa"
            value={values.sellerId}
            onChange={e => {
              handleInputChange(e)
            }}
            options={sellerList}
            error={errors.sellerId}
          />
        </Grid>

        <Grid item xs={6} style={{ marginTop: 5 }}>
          <Grid container spacing={1} justifyContent='flex-start'>
            <Grid item>
              <ButtonDefault
                icon={'filter_list'}
                type='submit'
                isLoading={isLoading}
                disabled={isLoading}
                label={'Filtrar'}
              />
            </Grid>

            <Grid item>
              <ButtonDefault
                onClick={() => handleResetFilter()}
                label={'Limpar Filtros'}
                isLoading={clearIsLoading}
                disabled={clearIsLoading}
                icon={'clear'} />

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Grid container justifyContent='flex-end' >
            <Grid item >
              <Typography style={{ fontSize: 14 }}>
                <Switch
                  name="payBack"
                  color="primary"
                  value={values.payBack = checked}
                  checked={checked}
                  onChange={e => {handleInputChange(e)
                    setChecked(!checked);
                }}
                />
                <b>Estornos</b></Typography>
            </Grid>
          </Grid>
        </Grid>

      </Grid>




      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}

      >
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh', padding: 5 }}
        >
          <Paper style={{ borderRadius: 0, backgroundColor: 'white' }}>
            <Grid item xs={12}>
              <PeriodPicker
                editableDateInputs={true}
                onChange={item => {
                  setDate([item.selection])
                  { e => setLocale(e.target.value) }
                }}
                moveRangeOnFirstSelection={false}
                ranges={date}

              />
            </Grid>
            <Grid item xs={12}>
              <Grid container >
                <Grid item xs={6}>
                  <ButtonDefault
                    onClick={() => { setDialogOpen(false); dateSubmit() }}
                    color="primary"
                    label="Selecionar"
                    icon='done'

                  />
                </Grid>
                <Grid item xs={6}>
                  <ButtonDefault
                    onClick={() => setDialogOpen(false)}
                    color="primary"
                    label="Cancelar"
                    icon='close'
                  />
                </Grid>
              </Grid>
            </Grid>

          </Paper>
        </Grid>

      </Modal>
    </Form >
  );
}
