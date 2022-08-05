import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';



export default function UsersFilter(props) {
  const { filter, setGridFilter, filterSubmit } = props;
  const [sellerSelectList, setSellerSelectList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  const submit = () => {
    filterSubmit(values)
  }


  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(filter, true, false, submit, []);


  const handleError = (err) => {
    enqueueSnackbar(err, { variant: 'error' })
  }


  const getFilterOptions = () => {
    promisseApi(
      'get',
      `/selectlist/sellerId`,
      setSellerSelectList, handleError
      // (err) => enqueueSnackbar(err, { variant: 'error' })
    );
  }

  useEffect(() => { getFilterOptions() }, [])

  const handleResetFilter = () => {
    setGridFilter({
      limit: 25,
      offset: 0
    });
    sessionStorage.setItem('usersFilter', JSON.stringify({ limit: 25, offset: 0 }));
    resetForm();
  }


  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Grid container style={{ padding: 10 }} spacing={1} >
              <Grid item lg={3} xs={6} >
                <Controls.Input
                  name="name"
                  label="Nome"
                  value={values.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />
              </Grid>
              <Grid item lg={3} xs={6} >
                <Controls.Input
                  name="document"
                  label="Documento"
                  value={values.document}
                  mask={'999.999.999-99'}
                  onChange={handleInputChange}
                  error={errors.name}
                />
              </Grid>
              <Grid item lg={3} xs={6} >
                <Controls.Input
                  name="mail"
                  label="Email"
                  value={values.mail}
                  onChange={handleInputChange}
                  error={errors.mail}
                />
              </Grid>
              <Grid item lg={3} xs={6} >
                <Controls.MultiSelect
                  label="Empresas Vinculadas"
                  name="sellerId"
                  value={values.sellerId}
                  onChange={handleInputChange}
                  options={sellerSelectList}
                  values={values.sellerId}
                  error={errors.sellerId}
                />
              </Grid>
              <Grid item lg={3} xs={6} >
                <Controls.MultiSelect
                  name="su"
                  label="Super User"
                  onChange={handleInputChange}
                  options={[{ title: "Ativo", id: true }, { title: "Inativo", id: false }]}
                  value={values.su}
                  error={errors.su}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container style={{ padding: 15, marginTop: -25 }} justifyContent='flex-start' spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={2}>
                <ButtonDefault
                  type='submit'
                  onClick={() => { submit(); }}
                  icon={'filter_list'}
                  label={'Filtrar'}
                />
              </Grid>


              <Grid item lg={2}>
                <ButtonDefault
                  color="default"
                  onClick={handleResetFilter}
                  label={'Limpar Filtros'}
                  icon={'clear'}
                />
              </Grid>



            </Grid>
          </Grid>
        </Grid>



      </Form>
    </>
  )
}