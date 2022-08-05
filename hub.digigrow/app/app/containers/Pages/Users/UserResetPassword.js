import { Dialog, DialogTitle, Grid, Icon, IconButton, InputAdornment } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React from "react";
import { useState } from "react";
import { promisseApi } from "../../../api/api";
import Controls from "../../../components/Forms/controls";
import { Form, useForm } from "../../../components/Forms/useForm";
import { checkPasswordStrength } from "../../../utils/auth";
import { passwordsMatch, validateEmail } from "../../../utils/formValidation";
import ButtonDefault from '../../../components/Button/ButtonDefault';
import { toLowerCase } from "../../../utils/dynamicMasks";
import { SHA256 } from "crypto-js";
import { useSnackbar } from "notistack";
import Button from "../../../components/Forms/controls/Button";


export default function UserResetPassword(props) {
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = event => event.preventDefault();
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState({});
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let { open, setResetPasswordOpen, valueReset } = props

  const submit = () => {
    try {

      setLoading(true)
      promisseApi(
        'put',
        '/user/su/password',
        (data) => {
          enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
          setLoading(false)
        },

        (err) => enqueueSnackbar(err.code, { variant: 'error' }),
        {
          reset: true,
          mail: valueReset.mail,
          password: (SHA256(values.password)).toString(),
          name: values.name,
          code: values.code
        }
      )

    } catch (error) {
      console.log(error)
    }

  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(value, true, submit, [

    {
      field: 'password',
      message: 'Necessário conter letras, números e no mínimo seis caracteres',
      rule: (fieldValue) => {
        return !checkPasswordStrength(fieldValue.password);
      }
    },

    {
      field: 'passwordConfirm',
      message: 'Senhas diferentes',
      rule: (fieldValue) => {
        return !passwordsMatch(fieldValue.passwordConfirm, fieldValue.password);
      }
    },
  ]);



  return (
    <Dialog open={open} onClose={() => { setResetPasswordOpen(false) }} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" style={{ marginBottom: 0 }}>
        {'Resetar Senha'}
      </DialogTitle>
     
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={1} style={{ padding: 20 }}>
          <Grid item xs={12}>
            <Controls.Input
              autoFocus
              name="mail"
              label="E-mail*"
              onChange={(e) => changeCustom(e, toLowerCase, handleInputChange)}
              disabled={true}
              value={valueReset.mail ? valueReset.mail : ''}
              error={errors.mail}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Input
              autoFocus
              name="password"
              label="Nova Senha*"
              type={showPassword ? 'text' : 'password'}
              onChange={handleInputChange}
              value={values.password}
              error={errors.password}
              inputProps={{ maxLength: 20 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Controls.Input
              name="passwordConfirm"
              label="Confirmar Senha*"
              type={showPassword ? 'text' : 'password'}
              onChange={handleInputChange}
              value={values.passwordConfirm}
              error={errors.passwordConfirm}
              inputProps={{ maxLength: 20 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <ButtonDefault
              fullWidth
              type='submit'
              name="buttom"
              label={'Confirmar'}
              disabled={loading}
              onChange={handleInputChange}
              value={values.buttom}
              error={errors.buttom}
              startIcon={<Icon style={{ marginLeft: 5, fontSize: 14 }}>mail_outline</Icon>}
            />
          </Grid>


          <Grid item xs={6}>
            <ButtonDefault
              fullWidth
              name="close"
              label={'Fechar'}
              onClick={() => { setResetPasswordOpen(false) }}        
              value={values.buttom}
              error={errors.buttom}
              startIcon={<Icon style={{ marginLeft: 5, fontSize: 14 }}>close</Icon>}
            />
          </Grid>
        </Grid>
      </Form>
    </Dialog>

  )
}