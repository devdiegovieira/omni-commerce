
import { Collapse, Divider, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Form, useForm } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import { promisseApi } from "../../../api/api";

import _ from "lodash";
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';



export default function LogisticaFilter(props) {

  let {
    filter,
    setFilter,
    filterSubmit
  } = props;

  const submit = () => {
    filterSubmit(values);
  }

  const handleResetFilter = () => {
    setFilter({
      limit: 5,
      offset: 0,
      dateClosedFrom: new Date(),
      dateClosedTo: new Date()
    });

    resetForm();
  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useForm(filter, true, submit, []);

  const { enqueueSnackbar } = useSnackbar();

  const [platformData, setPlatformData] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [marketPlaceData, setMarketPlaceData] = useState([]);
  const [orderPrinted, setOrderPrinted] = useState([]);
  const [open, setOpen] = useState(false);

  const onOf = () => {
    setOpen(!open)
  }


  useEffect(() => {
    handleFilterOpen();
  }, [orderPrinted]);



  const handleFilterOpen = () => {

    promisseApi('get', '/selectlist/sellerid', setSellerData, (err) => enqueueSnackbar(err, { variant: 'error' }));
    promisseApi('get', '/selectlist/platformid', setPlatformData, (err) => enqueueSnackbar(err, { variant: 'error' }));
    promisseApi('get', '/selectlist/marketplaceid', setMarketPlaceData, (err) => enqueueSnackbar(err, { variant: 'error' }));
    promisseApi('get', '/selectlist/platformid', setPlatformData, (err) => enqueueSnackbar(err, { variant: 'error' }));
    promisseApi('get', '/selectlist/printed', setOrderPrinted, (err) => enqueueSnackbar(err, { variant: 'error' }));

  }



  return (

    <Form onSubmit={handleSubmit}>

      <Grid container style={{ padding: 16 }}  >
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>


              <Controls.DatePicker
                label="Período de:"
                name="dateClosedFrom"
                value={values.dateClosedFrom}
                onChange={e => {
                  handleInputChange(e)
                }}
                error={errors.dateClosedFrom}

              />
            </Grid>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.DatePicker
                label="Até:"
                name="dateClosedTo"
                value={values.dateClosedTo}
                onChange={e => {
                  handleInputChange(e)
                 
                }}
                error={errors.dateClosedTo}
              />

            </Grid>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input
                name="name"
                label="Nome"
                value={values.name}
                onChange={e => {
                  handleInputChange(e)
           
                }}
                error={errors.name}
              />
            </Grid>

            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input
                name="orderNumber"
                label="Número da Venda"
                value={values.orderNumber}
                onChange={e => {
                  handleInputChange(e)
             
                }}
                error={errors.orderNumber}
              />

            </Grid>

            <Grid item style={{ marginTop: -5 }} xs={12}>
              <Grid item style={{ marginTop: -5 }}>
                <Collapse in={open} >
                  <Grid container spacing={1} style={{ marginBottom: 5 }}>
                    <Grid item lg={3} md={6} xs={12}>
                      <Controls.MultiSelect
                        name="sellerId"
                        label="Empresa"
                        value={values.sellerId}
                        onChange={e => {
                          handleInputChange(e)
                      
                        }}
                        options={sellerData}
                        error={errors.sellerId}
                      />
                    </Grid>

                    <Grid item lg={3} md={6} xs={12}>
                      <Controls.MultiSelect
                        name="printedLabel"
                        label="Impresso"
                        value={values.printedLabel}
                        onChange={e => {
                          handleInputChange(e)
                       
                        }}
                        options={orderPrinted}
                        error={errors.printed}
                      />
                    </Grid>

                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          </Grid>

        </Grid>

        <Grid item >
          <ButtonDefault
            type='submit'
            icon={'filter_list'}
            label={'Filtrar'}s
          />
        </Grid>

        <Grid item >
          <ButtonDefault
            onClick={() => {
              handleResetFilter()
            }}
            label={'Limpar Filtros'}
            icon={'clear'}
          />
        </Grid>

        <Grid item >
          <ButtonDefault
            onClick={() => onOf()}
            label={open ? 'Menos filtros ...' : 'Mais filtros ...'}
            icon={open ? 'remove' : 'add'}
          />
        </Grid>


      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Form >
  )

};