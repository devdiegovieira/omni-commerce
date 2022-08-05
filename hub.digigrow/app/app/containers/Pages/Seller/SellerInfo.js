import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, Grid, Paper } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import { green } from '@material-ui/core/colors';
import Controls from '../../../components/Forms/controls';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';



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
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#58F808'
  },


}));

export default function SellerInfo(props) {
  const classes = useStyles();

  const {
    values, errors, getConsultarCep, setButtonSaveLoading, handleInputChange, onFileChange
  } = props;


  return (
    <>

      <Paper>
        <Grid container className={classes.gridContainer} style={{ padding: 15 }}  >
          <Grid item lg={12} sm={12} xs={12} className={classes.grid}>
            <Grid container justifyContent="center" spacing={2} >

              <Grid item lg={6} xs={12}>
                <Grid container spacing={1} >
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <p>Dados Gerais</p>
                  </Grid>

                  <Grid item lg={12} xs={12} >
                    <Divider />
                  </Grid>


                  <Grid item lg={12} xs={12} >
                    <Controls.Input
                      autoFocus
                      label="Nome Fantasia"
                      name="code"
                      value={values.code}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.code}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>


                  <Grid item lg={12} xs={12} >
                    <Controls.Input
                      name="name"
                      label="Razão social"
                      value={values.name}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.name}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>


                  <Grid item lg={12} xs={12} >
                    <Controls.Input
                      name="document"
                      label="CNPJ"
                      value={values.document}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      mask="99.999.999/9999-99"
                      error={errors.document}
                    />

                  </Grid>

                  <Grid item lg={12} xs={12} style={{ marginTop: 10 }}>
                    <p>Contrato</p>
                  </Grid>

                  <Grid item lg={12} xs={12} >
                    <Divider />
                  </Grid>


                  <Grid item lg={12} xs={12} >
                    <Controls.Input
                      name="contractName"
                      label="Tipo"
                      onChange={handleInputChange}
                      value={values.contractName}
                      error={errors.contractName}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item lg={6} xs={6}>
                    <UploadFilesPreview   
                      field="images"               
                      onFileChange={onFileChange}
                      label='Foto CNH ou RG (com CPF)'
                      accept = {['.jpeg', '.png', '.jpg']}
                      files={values.images}
                      style={{ width: '100%', height: 'auto' }}

                    />
                  </Grid>
                  <Grid item lg={6} xs={6}>
                    <UploadFilesPreview 
                      field="imagesCs"  
                      onFileChange={onFileChange}
                      accept = {['.pdf']}
                      label='Contrato Social da Empresa (PDF)'
                      files={values.imagesCs}
                      style={{ width: '100%', height: 'auto' }}

                    />
                  </Grid>

                </Grid>
              </Grid>

              <Grid item lg={6} xs={12}>
                <Grid container spacing={1} >
                  <Grid item xs={12} style={{ marginTop: 10 }}>
                    <p>Endereço Logístico</p>
                  </Grid>

                  <Grid item lg={12} xs={12}>
                    <Divider />
                  </Grid>


                  <Grid item lg={3} xs={12}>
                    <Controls.Input
                      name="cep"
                      label="CEP"
                      value={values.cep}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.cep}
                      mask="99999-999"
                    />
                  </Grid>
                  <Grid item lg={9} xs={12} style={{ marginTop: 18 }}>
                    <Button
                      name="cep"
                      label="CEP"
                      onClick={() => { getConsultarCep(values.cep) }}
                    >    Buscar CEP </Button>

                  </Grid>



                  <Grid item lg={12} xs={12}>
                    <Controls.Input
                      label="Endereço"
                      name="address"
                      value={values.address}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.address}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <Controls.Input
                      name="number"
                      label="Número"
                      value={values.number}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      inputProps={{ maxLength: 20 }}
                      error={errors.number}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Controls.Input
                      name="city"
                      label="Cidade"
                      value={values.city}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      inputProps={{ maxLength: 100 }}
                      error={errors.city}
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <Controls.Input
                      name="neighborhood"
                      label="Bairro"
                      value={values.neighborhood}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      inputProps={{ maxLength: 100 }}
                      error={errors.neighborhood}
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>

                    <Controls.Select
                      label="Estado"
                      name="state"
                      value={values.state}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      inputProps={{ maxLength: 100 }}
                      error={errors.state}
                      options={[{ id: 'ACRE', title: 'AC' },
                      { id: 'AL', title: 'AL' },
                      { id: 'AP', title: 'AP' },
                      { id: 'AM', title: 'AM' },
                      { id: 'BA', title: 'BA' },
                      { id: 'CE', title: 'CE' },
                      { id: 'DF', title: 'DF' },
                      { id: 'ES', title: 'ES' },
                      { id: 'GO', title: 'GO' },
                      { id: 'MA', title: 'MA' },
                      { id: 'MT', title: 'MT' },
                      { id: 'MS', title: 'MS' },
                      { id: 'MG', title: 'MG' },
                      { id: 'PA', title: 'PA' },
                      { id: 'PB', title: 'PB' },
                      { id: 'PR', title: 'PR' },
                      { id: 'PE', title: 'PE' },
                      { id: 'PI', title: 'PI' },
                      { id: 'RJ', title: 'RJ' },
                      { id: 'RN', title: 'RN' },
                      { id: 'RS', title: 'RS' },
                      { id: 'RO', title: 'RO' },
                      { id: 'RR', title: 'RR' },
                      { id: 'SC', title: 'SC' },
                      { id: 'SP', title: 'SP' },
                      { id: 'SE', title: 'SE' },
                      { id: 'TO', title: 'TO' }
                      ]}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Controls.Input
                      name="comp"
                      label="Complemento (Opcional)"
                      value={values.comp}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}

                      error={errors.comp}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <Controls.Input
                      name="phone"
                      label="Telefone de contato"
                      value={values.phone}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      mask="(99)99999-9999"
                      error={errors.phone}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>



                  <Grid item lg={12} xs={12} style={{ marginTop: 10 }}>
                    <p>Responsável</p>
                  </Grid>

                  <Grid item lg={12} xs={12} >
                    <Divider />
                  </Grid>

                  <Grid item lg={12} xs={12}>
                    <Controls.Input
                      name="userName"
                      label="Nome"
                      value={values.userName}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.userName}
                      inputProps={{ maxLength: 100 }}
                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controls.Input
                      name="rg"
                      label="RG"
                      value={values.rg}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }} inputProps={{ maxLength: 15 }}
                      error={errors.rg}

                    />
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <Controls.Input
                      name="cpf"
                      label="CPF"
                      value={values.cpf}
                      onChange={e => {
                        handleInputChange(e)
                        setButtonSaveLoading(true)
                      }}
                      error={errors.cpf}
                      mask="999.999.999-99"
                    />
                  </Grid>

                </Grid>
              </Grid>


            </Grid>
          </Grid>
        </Grid>

      </Paper>



    </>
  );
}
