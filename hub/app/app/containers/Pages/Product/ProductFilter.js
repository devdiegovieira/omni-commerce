
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, Divider, Grid, Paper, Typography } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import Badge from '@material-ui/core/Badge';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import _ from "lodash";
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import CircularProgress from '@material-ui/core/CircularProgress';



const useStyles = makeStyles((theme) => ({

  gridContainer: {
    marginTop: -30,
    padding: 10,
  },
}));


export default function ProductFilter(props) {
  const classes = useStyles();
  const { filter, setFilter, filterSubmit, isLoading, clearIsLoading ,setClearIsLoading, setIsLoading} = props;
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [sellerSelectList, setSellerSelectList] = useState([]);
  const [attList, setAttList] = useState([]);
  const [attValuesList, setAttValuesList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const ops = () => {
    setOpen(!open)
  }

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
  } = useForm(filter, true, submit, []);

  const getFilterOptions = () => {
    promisseApi(
      'get',
      `/selectlist/category/`,
      (data) => setOptionsCategory(data),
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

    promisseApi(
      'get',
      `/selectlist/sellerId`,
      (data) => setSellerSelectList(data),
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );

    promisseApi(
      'get',
      `/selectlist/skuatt`,
      setAttList,
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );
  }

  const getAttValues = (value) => {
    promisseApi(
      'get',
      `/selectlist/skuatt/${value}/value`,
      setAttValuesList
    );

  }

  useEffect(() => { getFilterOptions() }, [])


  const handleResetFilter = () => {
    setFilter({
      limit: 25,
      offset: 0
    });
    setClearIsLoading(true)
    sessionStorage.setItem('productFilter', JSON.stringify({ limit: 25, offset: 0 }));

    resetForm();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container style={{ paddingLeft: 10, paddingRight: 10 }} >
        <Grid item xs={12}>
          <Grid container spacing={1}>

            <Grid item lg={3} md={6} xs={12}>
              <Controls.Input
                name="code"
                label="Código Produto ou Variação"
                value={values.code}
                onChange={e => {
                  e.target.value = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                  handleInputChange(e)
                  handleChange(e)
                }}
                error={errors.code}
              />
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
              <Controls.Input
                name="title"
                label="Título"
                value={values.title}
                onChange={e => {
                  handleInputChange(e)
                  handleChange(e)
                }}
                error={errors.title}
              />
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
              <Controls.MultiSelect
                label="Empresa"
                name="sellerId"
                onChange={e => {
                  handleInputChange(e)
                  handleChange(e)
                }}
                options={sellerSelectList}
                value={values.sellerId}
                error={errors.sellerId}
              />
            </Grid>
            <Grid item lg={3} md={6} xs={12}>
              <Controls.AutoComplete
                name="categoryId"
                label="Categoria"
                value={values.categoryId}
                onChange={e => {
                  handleInputChange(e)
                  handleChange(e)
                }}
                onInputChange={handleInputChange}
                options={optionsCategory}
                error={errors.categoryId}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid item >
            <Collapse in={open} >
              <Grid container spacing={1} style={{ marginBottom: 5 }}>
                <Grid item lg={3} md={6} xs={12}>
                  <Controls.Select
                    name="status"
                    label="Status"
                    value={values.status}
                    onChange={e => {
                      handleInputChange(e)
                      handleChange(e)
                    }}
                    options={[
                      { title: "Ativos", id: true },
                      { title: "Inativos", id: false },
                    ]}
                    error={errors.status}
                  />
                </Grid>

                <Grid item lg={3} md={6} xs={12}>
                  <Controls.AutoComplete
                    name="attId"
                    label="Atributo"
                    value={values.attId}
                    onChange={e => {
                      getAttValues(e.target.value)
                      handleInputChange(e)
                      handleChange(e)
                    }}
                    onInputChange={handleInputChange}
                    options={attList}
                    inputProps={{ maxLength: 20 }}
                    error={errors.attId}
                  />
                </Grid>

                <Grid item lg={3} md={6} xs={12}>
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
                    inputProps={{ maxLength: 20 }}
                    error={errors.attValue}
                  />
                </Grid>

              </Grid>
            </Collapse>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item >
              <ButtonDefault
                type='submit'
                isLoading={isLoading}
                disabled={isLoading}
                icon={'filter_list'}
                receivement
                label={'Filtrar'}
              />
             
            </Grid>
            <Grid item >
              <ButtonDefault
                color="default"
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
                label={open ? 'Menos filtros ... ' : ' Mais filtros ...'}
                icon={open ? 'remove' : 'add'}
              />
            </Grid>
          </Grid>

        </Grid>
      </Grid>

    </Form >
  );
}