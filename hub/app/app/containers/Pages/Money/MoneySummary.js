import React, { useEffect, useState } from 'react';
import { Avatar, Button, capitalize, Divider, Grid, Icon, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import MoneyCards from './MoneyCards';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import Controls from '../../../components/Forms/controls';
import { useForm, Form } from '../../../components/Forms/useForm';
import MoneyActions from './MoneyActions';
import ButtonDefault from '../../../components/Button/ButtonDefault';
export default function MoneySummary(props) {

  const [filter, setFilter] = useState({});
  const [months, setMonths] = useState([]);
  const [user, setUser] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [sellerSelectList, setSellerSelectList] = useState([]);
  const submit = () => { () => useEffect() }

  useEffect(() => {


    promisseApi(
      'get',
      `/ordermoney/concludMonts`,
      (data) => {
        setMonths([...data.map(m => {
          return {
            day: m._id.day,
            month: m._id.month,
            year: m._id.year,
            value: m.concludedValue.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            concluded: true
          }
        }), { concluded: false, checked: true }])

        setFilter({ monthSelected: JSON.stringify({ concluded: false, checked: true }) })
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })

    )



  }, []);


  const concluded = () => {
    promisseApi(
      'put',
      '/ordermoney/concluded',
      () => { location.reload(true); },
      {},
      { sellerId: values.sellerId },


    )
  }

  useEffect(() => {
    promisseApi('get', '/user/superuser', (data) => setUser(data), (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
    promisseApi(
      'get',
      `/selectlist/sellerId`,
      setSellerSelectList
    );


  }, []);



  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(filter, true, submit, []);


  return (
    <Form onSubmit={handleSubmit}>


      <Grid container spacing={1} style={{ padding: 10 }} >

        <Grid item lg={3} xs={12}>
          <Controls.Select
            noEmpty
            label="Período"
            name="monthSelected"
            onChange={handleInputChange}
            options={months.map(m => {
              return {
                id: JSON.stringify(m),
                title: m.year ? `${m.day}/${capitalize(new Date(m.year, m.month - 1).toLocaleString('default', { month: 'long' }))}/${m.year} | ${m.value}` : 'Próximo Fechamento'
              }
            })}
            value={values.monthSelected ? values.monthSelected : null}
            error={errors.monthSelected}
          />
        </Grid>
        <Grid item lg={3} xs={12}>

          <Controls.Select
            label="Empresa"
            name="sellerId"
            onChange={handleInputChange}
            options={sellerSelectList}
            value={values.sellerId}
            error={errors.sellerId}
          />

        </Grid>
        {
          Array.isArray(months) && months.find(f => f) && (
        <Grid item style={{ marginTop: 15, marginLeft: 10 }} xs={5} lg={'auto'} >
          <MoneyActions months={months}/>
        </Grid>)}

        <Grid item style={{ marginTop: 25, marginLeft: 10 }} xs={6} lg={'auto'} >
          {user &&
            <ButtonDefault
              onClick={() => concluded()}
              color="default"
              label={'Concluir recebidos'}
              disabled
              icon={'check'} />}
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>


        {
          Array.isArray(months) && months.find(f => f.checked) && (
            <Grid item xs={12}  >
              <MoneyCards monthSelected={values.monthSelected} sellerId={values.sellerId} sellerFilter={values.sellerId} />
            </Grid>
          )
        }

      </Grid>

    </Form>
  );
}
