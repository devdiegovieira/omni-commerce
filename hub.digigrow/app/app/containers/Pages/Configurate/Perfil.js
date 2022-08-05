import React, { useState, useEffect } from 'react';
import { Avatar, Grid, Button, Typography, Divider, Chip } from '@material-ui/core';
import Controls from '../../../components/Forms/controls';
import { injectIntl } from 'react-intl';
import { Form, useForm } from '../../../components/Forms/useForm';
import { promisseApi } from '../../../api/api';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import SaveIcon from '@material-ui/icons/Save';
import ButtonDefault from '../../../components/Button/ButtonDefault';

function Perfil(props) {

  const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(13),
      height: theme.spacing(13),
      textAlign: 'center'

    },
    button: {
      backgroundColor: '#58F808'
    },

  }));

  const [userData, setUserData] = useState({
  });

  const { enqueueSnackbar } = useSnackbar();

  const submit = () => {
    let { name, phone, mail } = values;
    promisseApi(
      'put',
      `/user/${values._id}`,
      () => {
        getUserData();
        enqueueSnackbar('Dados salvos com sucesso!', { variant: 'success' })
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {
        name, phone, mail
      }
    )
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(userData, true, submit, [
    {
      field: 'name',
      message: 'O Campo Nome é obrigatório'
    },
    {
      field: 'phone',
      message: 'O Campo Telefone é obrigatório'
    }
  ]);

  const getUserData = () => {
    promisseApi(
      'get',
      `/user/:user`,
      (data) => setUserData({ ...data }),
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

  }


  const handleFiles = e => {
    let form = new FormData();
    form.append("image", e.target.files[0], e.target.files[0].name);

    promisseApi(
      'put',
      `/user/userpic/${userData._id}`,
      (data) => {
        location.reload(true);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      form,
      {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
    )

  }

  useEffect(() => {
    getUserData();
  }, []);

  const classes = useStyles();

  return (

    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} style={{ paddingTop: 10, paddingLeft: 20 }} >
              <Grid container>
                <Grid item xs={10}>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 2 }}  >
              <Divider ></Divider>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent='center'>
            <Grid item xs={12} style={{ padding: 25 }} >
              <Grid container justifyContent='center'>
                <Grid item lg={6} md={3} xs={12} style={{ paddingTop: 25 }} >
                  <Grid container justifyContent='center'>
                    <Grid item style={{ padding: 20 }}>
                      <Grid container direction='column' justifyContent='center'>
                        <Grid item xs={'auto'} lg={'auto'}>
                          <Avatar
                            style={{ width: 150, height: 150 }}
                            src={userData.picture}
                            className={classes.large}
                            alt={userData.name}
                          />
                        </Grid>
                        <Grid item >
                          <Grid container justifyContent='center'>
                            <input
                              accept="image/*"
                              id="icon-button-file"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={handleFiles}
                            />
                            <label htmlFor="icon-button-file">
                              <Button component='span' style={{ marginTop: 15, padding: 5, fontSize: 12, borderRadius: 3, textTransform: 'none' }} variant='contained' > Substituir Imagem </Button>
                            </label>
                            <label htmlFor="icon-button-file">

                            </label>
                            <input
                              accept="image/*"
                              id="icon-button-file"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={handleFiles}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item style={{ marginTop: 50, marginLeft: 20, marginBottom: 20 }} xs={'auto'} lg={6}>
                      <Typography style={{ fontSize: 26, fontWeight: 600, marginRight: 0 }} >
                        {userData.name}
                      </Typography>
                      {userData.su && (<Chip xs={12} lg={6} style={{ marginRight: 20 }} label={'Super Usuário'} />)}
                    </Grid>

                  </Grid>
                </Grid>
                <Grid item lg={6} md={7} xs={12} >
                  <Controls.Input
                    autoFocus
                    label="Nome"
                    name="name"
                    inputProps={{ maxLength: 100 }}
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                  <Controls.Input
                    disabled
                    name="Document"
                    label="Documento"
                    value={values.document}
                    onChange={handleInputChange}
                    error={errors.document}
                    mask="999.999.999-99"
                  />
                  <Controls.Input
                    label="E-mail"
                    name="mail"
                    value={values.mail}
                    inputProps={{ maxLength: 200 }}
                    onChange={handleInputChange}
                    error={errors.mail}
                    disabled={true}

                  />
                  <Controls.Input
                    label="Telefone"
                    name="phone"
                    value={values.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    mask="(99)99999-9999"
                  />
                  <Controls.Input
                    disabled
                    multiline
                    name="userToken"
                    label="Token de Acesso"
                    value={values.userToken}
                    onChange={handleInputChange}
                    error={errors.userToken}
                  />

                  <ButtonDefault
                    color='#58F808'
                    type='submit'
                    label={'Salvar'}
                    icon={'save'}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Form>


  );
}
export default injectIntl(Perfil);
