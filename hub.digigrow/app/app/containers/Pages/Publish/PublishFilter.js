import { Collapse, Divider, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { Form, useForm } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import { promisseApi } from "../../../api/api";
import { useSnackbar } from "notistack";
import ButtonDefault from "../../../components/Button/ButtonDefault";

export default function PublishFilter(props) {

  let {
    filter,
    setFilter,
    filterSubmit,
    isLoading,
    clearIsLoading,
    setClearIsLoading,
    setIsLoading
  } = props;

  const submit = () => {
    if (JSON.stringify(values.categoryId) === "{}") delete values.categoryId
    filterSubmit(values)
    setIsLoading(true)
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useForm(filter, false, submit, []);

  const [shipMode, setShipModeData] = useState([]);
  const [oficialStore, setOficialStoreData] = useState([]);
  const [listingType, setListingTypeData] = useState([]);
  const [sellerSelectList, setSellerSelectList] = useState([]);
  const [attValuesList, setAttValuesList] = useState([]);
  const [status, setStatusData] = useState([]);

  const [attList, setAttList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();



  const [open, setOpen] = useState(false);

  const ops = () => {
    setOpen(!open)
  }

  useEffect(() => {
    promisseApi('get', '/selectlist/shipmode', setShipModeData, handleError);
    promisseApi('get', '/selectlist/oficialstore', setOficialStoreData, handleError);
    promisseApi('get', '/selectlist/listingtype', setListingTypeData, handleError);
    promisseApi('get', '/selectlist/sellerId', setSellerSelectList, handleError);
    promisseApi('get', '/selectlist/status', setStatusData, handleError);
    promisseApi('get', `/selectlist/skuatt`, setAttList, handleError);
  }, []);

  const handleError = (err) => {
    enqueueSnackbar(err, { variant: 'error' })
  }

  const handleResetFilter = () => {
    setFilter({
      limit: 25,
      offset: 0
    });
    setClearIsLoading(true)
    sessionStorage.setItem('publishFilter', JSON.stringify({ limit: 25, offset: 0 }));

    resetForm();
  }

  const getAttValues = (value) => {
    promisseApi('get', `/selectlist/skuatt/${value}/value`, setAttValuesList
    );
  }

  return (


    <Form onSubmit={handleSubmit}>

      <Grid container style={{ paddingLeft: 10, paddingRight: 10, marginBottom: 10 }} >
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item sm={6} lg={3} xs={12}>
              <Controls.Input
                name="title"
                label="Título"
                value={values.title}
                onChange={e => {
                  handleInputChange(e)
                }}
                error={errors.title}
              />
            </Grid>
            <Grid item sm={6} lg={3} xs={12}>
              <Controls.Input
                name="sku"
                label="SKU"
                value={values.sku}
                onChange={e => {
                  handleInputChange(e)

                }}
                error={errors.sku}
              />
            </Grid>
            <Grid item sm={6} lg={3} xs={12}>
              <Controls.Input
                name="publishId"
                label="Id do Anúncio"
                value={values.publishId}
                onChange={e => {
                  handleInputChange(e)

                }}
                error={errors.publishId}
              />

            </Grid>
            <Grid item sm={6} lg={3} xs={12}>
              <Controls.MultiSelect
                name="sellerId"
                label="Empresa"
                value={values.sellerId}
                onChange={e => {
                  handleInputChange(e)

                }}
                options={sellerSelectList}
                error={errors.sellerId}
              />
            </Grid>
          </Grid>
        </Grid>


        {/* Grid + filtros */}

        <Grid item xs={12}>
          <Collapse in={open} >
            <Grid container spacing={1}>

              <Grid item sm={6} lg={3} xs={12}>

                <Controls.MultiSelect
                  name="shipMode"
                  label="Modo de Envio"
                  value={values.shipMode}
                  onChange={e => {
                    handleInputChange(e)

                  }}
                  options={shipMode}
                  error={errors.shipMode}
                />
              </Grid>

              <Grid item sm={6} lg={3} xs={12}>
                <Controls.AutoComplete
                  name="attId"
                  label="Atributo"
                  value={values.attId}
                  onChange={e => {
                    getAttValues(e.target.value)
                    handleInputChange(e)

                  }}
                  onInputChange={handleInputChange}
                  options={attList}
                  error={errors.attId}
                />
              </Grid>
              <Grid item sm={6} lg={3} xs={12}>
                <Controls.AutoComplete
                  name="attValue"
                  label="Valor Atributo"
                  value={values.attValue}
                  onChange={e => {
                    handleInputChange(e)
                    handleChange(e)
                  }}
                  onInputChange={handleInputChange}
                  options={attValuesList}
                  error={errors.attValue}
                />
              </Grid>
              <Grid item sm={6} lg={3} xs={12}>
                <Controls.MultiSelect
                  name="oficialStore"
                  label="Loja Oficial"
                  value={values.oficialStore}
                  onChange={e => {
                    handleInputChange(e)

                  }}
                  options={oficialStore}
                  error={errors.oficialStore}
                />
              </Grid>

              <Grid item sm={6} lg={3} xs={12}>
                <Controls.MultiSelect
                  name="listingType"
                  label="Destaque"
                  value={values.listingType}
                  onChange={e => {
                    handleInputChange(e)

                  }}
                  options={listingType}
                  error={errors.listingType}
                />
              </Grid>

              <Grid item sm={6} lg={3} xs={12}>
                <Controls.MultiSelect
                  name="status"
                  label="Status"
                  value={values.status}
                  onChange={e => {
                    handleInputChange(e)

                  }}
                  options={status}
                  error={errors.status}
                />
              </Grid>
            </Grid>

          </Collapse>
        </Grid>

        <Grid item >
          <ButtonDefault
            type='submit'
            isLoading={isLoading}
            disabled={isLoading}
            icon={'filter_list'}
            label={'Filtrar'}
          />
        </Grid>

        <Grid item >
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

        <Grid item >
          <ButtonDefault
            onClick={() => ops()}
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
