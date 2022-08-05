import { PaperBlock } from 'digi-components';
import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import Controls from '../../../components/Forms/controls';
import { useForm, Form } from '../../../components/Forms/useForm';
import { useHistory } from 'react-router-dom';
import SaveIcon from '@material-ui/icons/Save';
import GoBackHeader from '../../../components/GoBackHeader';
import MarketPlacePriceRule from './MarketPlacePriceRule';
import MarketPlaceAutoMessage from './MarketPlaceAutoMessage';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

export default function MarketPlaceDetail(props) {

  const {
    marketPlaceId, intl, gridData, paths } = props;

  const [marketplace, setMarketplace] = useState({});
  const [isNew, setIsNew] = useState(true);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [platformSelectList, setPlatformSelectList] = useState([]);
  const [sellerSelectList, setSellerSelectList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {

    if (!marketPlaceId.includes('TG-')) {
      promisseApi(
        'get',
        `/marketplace/${marketPlaceId}`,
        (data) => {
          setIsNew(false),
            setMarketplace(data)
        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      )



    } else {
      setMarketplace({
        tgMeli: marketPlaceId,
        sellerMeli: marketPlaceId.split(`-`)[2].split('&')[0]
      })
    }

    promisseApi(
      'get',
      `/selectlist/platformid`,
      (data) => {
        setPlatformSelectList(data);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

    promisseApi(
      'get',
      `/selectlist/sellerId`,
      (data) => {
        setSellerSelectList(data)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

  }, [marketPlaceId]);

  const submit = () => {
    setButtonSaveLoading(true);

    promisseApi(
      isNew ? 'post' : 'put',
      `/marketplace/${marketPlaceId}`,
      (data) => {

        setButtonSaveLoading(false);
        enqueueSnackbar('Registro salvo com sucesso!', { variant: 'success' })
      },
      (err) => {
        setButtonSaveLoading(false);
        enqueueSnackbar(err, { variant: 'error' })
      },
      values
    )
  };

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(marketplace, true, submit, [
    {
      field: 'name',
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
      field: 'lastDateGetOrder',
      message: 'O Campo Período de Integração é obrigatório'
    }
  ]);


  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <GoBackHeader
              name={"Contas"}
              descricao={"Próxima Conta"}
              descricaoBack={"Conta anterior"}
              gridData={gridData}
              paths={paths}
              propriedade={'_id'}
              locationBack={'/marketplace'}
            />
          </Grid>

          <Grid item xs={6}>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                color="default"
                size="small"
                startIcon={<SaveIcon />}
                style={{ fontSize: '11px' }}
                disabled={buttonSaveLoading}
                type="submit"
              >
                Salvar
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <PaperBlock
              title="Contas (Market Place)"
              icon="storefront"
              desc="Cadastro de conta de canal de vendas."
              overflowX
            >
              <Grid container spacing={1} >
                <Grid item xl={6} lg={6} md={6} sm={6} xs={12} >
                  <Controls.Input
                    disabled
                    label="Id"
                    name="_id"
                    value={values._id}
                    onChange={handleInputChange}
                    error={errors._id}
                  />

                  <Controls.Input
                    autoFocus
                    name="name"
                    label="Nome"
                    value={values.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />

                  <Controls.DatePicker
                    label="Periodo de integração de pedido"
                    name="lastDateGetOrder"
                    value={values.lastDateGetOrder}
                    onChange={handleInputChange}
                    error={errors.lastDateGetOrder}
                  />

                  <Controls.Input
                    disabled
                    label="Id da Empresa"
                    name="sellerId"
                    value={(values.auth && values.auth.sellerId) || values.sellerMeli}
                    error={null}
                    onChange={handleInputChange}
                  />

                  <Controls.Input
                    disabled
                    label="Token de acesso"
                    name="accessToken"
                    value={(values.auth && values.auth.accessToken) || values.tgMeli}
                    error={null}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={6} xs={12}>
                  <Controls.Select
                    name="platformId"
                    label="Plataforma"
                    value={values.platformId}
                    onChange={handleInputChange}
                    options={platformSelectList}
                    error={errors.platformId}
                  />

                  <Controls.Select
                    label="Empresa"
                    name="sellerId"
                    value={values.sellerId}
                    onChange={handleInputChange}
                    options={sellerSelectList}
                    error={errors.sellerId}
                  />

                  <Controls.Input
                    label="endpoint para callback de frete"
                    name="freightCallback"
                    value={values.freightCallback}
                    error={errors.freightCallback}
                    onChange={handleInputChange}
                  />

                  <Controls.Input
                    disabled
                    label="Usuário"
                    name="userId"
                    value={values.auth && values.auth.userId}
                    error={null}
                    onChange={handleInputChange}
                  />
                  <Controls.Switch
                    label="Ativo"
                    name="active"
                    value={values.active}
                    onChange={handleInputChange}
                    error={errors.active}
                  />
                </Grid>
              </Grid>
            </PaperBlock>
          </Grid>

          <Grid item xs={12}>
            <PaperBlock
              title="Integrações"
              icon="sync_alt"
              desc="Ativar ou desativar integrações da Conta"
              overflowX
            >
              <Grid container>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de pedido"
                    name="getOrder"
                    value={values.getOrder}
                    onChange={handleInputChange}
                    error={errors.getOrder}

                  />
                </Grid>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de etiqueta"
                    name="getShippLabel"
                    value={values.getShippLabel}
                    onChange={handleInputChange}
                    error={errors.getShippLabel}

                  />
                </Grid>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de preço"
                    name="putPrice"
                    value={values.putPrice}
                    onChange={handleInputChange}
                    error={errors.putPrice}
                  />
                </Grid>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de estoque"
                    name="putStock"
                    value={values.putStock}
                    onChange={handleInputChange}
                    error={errors.putStock}
                  />
                </Grid>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de status"
                    name="putOrderStatus"
                    value={values.putOrderStatus}
                    onChange={handleInputChange}
                    error={errors.putOrderStatus}
                  />
                </Grid>

                <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                  <Controls.Switch
                    label="Integração de outros"
                    name="putOthers"
                    value={values.putOthers}
                    onChange={handleInputChange}
                    error={errors.putOthers}
                  />
                </Grid>
              </Grid>
            </PaperBlock>
          </Grid>
        </Grid>
      </Form >
      <Grid container spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={12}>
          <MarketPlacePriceRule marketPlace={values} />
        </Grid>

        <Grid item xs={12}>
          <MarketPlaceAutoMessage marketPlace={values} />
        </Grid>

      </Grid >
    </>


  );
}
