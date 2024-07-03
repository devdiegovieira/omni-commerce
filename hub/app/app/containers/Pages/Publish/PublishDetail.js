import React, { useState, useEffect } from 'react';
import { Avatar, Button, Collapse, Divider, Grid, Icon, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, Typography } from '@material-ui/core';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import Chip from '@material-ui/core/Chip';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LinearProgress from '@material-ui/core/LinearProgress';
import PublishActions from './PublishActions';
import GoBackHeader from '../../../components/GoBackHeader';
import { getAttributes, getSaleTerms } from '../../../utils/mercadoLivre';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import MeliAttibutes from '../../../components/Meli/MeliAttibutes';
import AddPubAttributes from './AddPubAtributes';
import { Alert, AlertTitle } from '@material-ui/lab';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { makeStyles } from "@material-ui/core";
import PublishSkuList from './PublishSkuList';
import MeliCategories from '../../../components/Meli/MeliCategories';

export const useStyles = makeStyles(() => ({
  root: {
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "red",
    },
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "green",
    },
  },
}));

export default function PublishDetail(props) {
  const classes = useStyles();
  const { publishId } = props;
  const [sellerList, setSellerList] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([{ status: 'undefined' }]);
  const [marketPlaceList, setMarketPlaceList] = useState([]);
  const [publishData, setPublishData] = useState({});
  const [technicalSpecs, setTechnicalSpecs] = useState([]);
  const [disabled, setDisabled] = useState(true);


  const [skuToDelete, setSkuToDelete] = useState();
  const [newImgs, setNewImgs] = useState([]);
  const [att, setAtt] = useState({});
  const [saleTerms, setSaleTerms] = useState([]);
  const [user, setUser] = useState();
  const { enqueueSnackbar } = useSnackbar();

  const staticRequiredFields = [
    {
      field: 'shipMode',
      message: `O Campo envio é obrigatório`,
    },
    {
      field: 'warrantyType',
      message: 'O campo Garantia é obrigatório. Para liberar este campo selecione uma categoria.',
    },
    {
      field: 'warrantyTime',
      message: 'O campo Tempo de Garantia é obrigatório. Para liberar este campo selecione uma categoria.',
    },
    {
      field: 'warrantyTimeUnit',
      message: 'O campo Tipo de Garantia é obrigatório. Para liberar este campo selecione uma categoria.',
    },
    {
      field: 'listingType',
      message: `O Campo Tipo de Anúncio é obrigatório`,
    },
    {
      field: 'condition',
      message: `O Campo condição é obrigatório`,
    },
    {
      field: 'title',
      message: `O Campo Titulo é obrigatório`,
    },
    {
      field: 'sellerId',
      message: `O Campo empresa é obrigatório`,
    },
    {
      field: 'description',
      message: `O Campo Descrição é obrigatório`,
    },
  ];

  const [requiredFields, setRequiredFields] = useState(staticRequiredFields);


  const handleSelectSku = (sellectedSku) => {

    if (values.variations.find(f => f.sku == sellectedSku.sku)) {
      enqueueSnackbar(`A variação ${sellectedSku.sku} já existe no anúncio.`, { variant: 'error' });
    }
    else {
      values.variations.push({
        sellerId: sellectedSku.sellerId,
        marketPlaceId: publishData.marketPlaceId,
        platformId: publishData.platformId,
        images: sellectedSku.images,
        price: sellectedSku.price,
        publishId: publishData.publishId,
        quantity: sellectedSku.stock,
        sku: sellectedSku.sku
      })
      setPublishData({ ...values });
    }

  }

  const handleAtt = (att) => {

    let variation =
      values.variations && values.variations.length > 0 ?
        values.variations.find(f => f.sku == att.sku) :
        values;

    if (variation) {
      if (!variation.attributes) variation.attributes = [];

      variation.attributes.push({
        name: att.attId,
        value_name: att.attValues,
        custom: true
      })
    }
    setDetailData(values)
  }

  const fileChange = (images, field, varIndex) => {
    let item = varIndex >= 0 ? values.variations[varIndex] : values;
    item[field] = images;
    setPublishData({ ...values });
  }
  const validSubmit = () => {


    let attArr = [];
    values.variations.map(m => Array.isArray(m.attributes) && attArr.push(...m.attributes.map(mm => mm.name)));

    attArr = attArr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    })

    let errAtt = [];
    if (values.variations.length > 0 && values.variations.find(f => !f.attributes.find(ff => ff.custom || ff.combination)))
      errAtt.push('Todas as variações precisam ter ao menos uma característica de Variação')


    if (errAtt.length > 0) {
      enqueueSnackbar(errAtt.join(', '), { variant: 'error' })
      return false
    } else {
      return true

    }

  }

  const submit = () => {

    let complete = requiredFields.find(f => !values[f.field]) == undefined;

    values.marketPlaceId = '60c798b36d68ee0822834006';
    values.platformId = '60c75ce16d68ee082276c5ae'

    let atts = [];

    for (let spec of technicalSpecs) {
      if (values[spec.id]) {
        atts.push({
          id: spec.id,
          name: spec.name,
          value_name: values[spec.id]
        });

        delete values[spec.id];
      }
    }
    values.attributes = atts || [];

    for (let variation of values.variations) {
      atts = [];

      if (!Array.isArray(variation.attributes)) variation.attributes = [];

      for (let spec of technicalSpecs) {
        if (values[`${variation.sku}_${spec.id}`]) {

          atts.push({
            id: spec.id,
            name: spec.name,
            value_name: values[`${variation.sku}_${spec.id}`],
            combination: spec.tags.find(f => f == 'allow_variations') != undefined
          });

          delete values[`${variation.sku}_${spec.id}`];
        }
      }
      variation.attributes = [...atts, ...variation.attributes.filter(f => f.custom)];

      setDisabled(true);
    }



    if (validSubmit()) {

      try {


        promisseApi(
          'put',
          `/publish/${publishId}`,
          () => {
            if (Array.isArray(values.variations)) values.variations.map(variation => {
              handleAddImage(values.publishId, variation.sku, variation.images.filter(f => f.new).map(m => m.file));
            })
            setNewImgs([]);
            enqueueSnackbar('Anúncio atualizado com sucesso', { variant: 'success' });
            getDetailData();
            setEdited(false);
          },
          (err) => enqueueSnackbar(err, { variant: 'error' }),
          {
            ...values,
            complete,
            image: values.image ? values.image.filter(f => !f.new).map(m => m.url) : [],
            imageDeleted: values.image ? values.image.filter(f => f.deleted).map(m => m.url) : [],
            variations: values.variations.map(variation => {
              return {
                ...variation,
                images: variation.images.filter(f => !f.new && !f.deleted).map(m => m.url ? m.url : m),
                imageDeleted: variation.images.filter(f => f.deleted).map(m => m.url ? m.url : m),
              }
            })
          }
        );
      } catch (error) {
        console.log(error);
      }


    }
    setDetailData(values);
  }

  const [edited, setEdited] = useState(false);

  const warrantyTypeChange = (e) => {
    useFormChange(e);

    if (e.target.value == 'Sem garantia') {
      setDetailData({ ...values, warrantyType: 'Sem garantia', warrantyTime: '0', warrantyTimeUnit: 'dias' })
    }

  }

  const useFormChange = (e) => {
    handleInputChange(e);
    setEdited(true)
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
  } = useForm(publishData, true, submit, []);


  const handleAddImage = (publishId, sku, images) => {

    if (images && images.length > 0) {
      let form = new FormData();

      for (let image of images) {
        form.append("image", image, image.name);
      }

      promisseApi(
        'post',
        `/publish/image`,
        () => { },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        form,
        {
          headers: {
            'content-type': 'multipart/form-data',
            sku,
            publish: values.publishId,

          }
        }
      )
    }
  }

  const [newVariation, setNewVariation] = useState();


  const handleVariationsDelete = (confirm) => {


    if (confirm) {
      promisseApi(
        'delete',
        `/publish/delSku/${publishId}`,
        () => getDetailData(),
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        {
          skuToDelete,
          publishId,
        }
      );
    }

    setSkuToDelete();
  }

  useEffect(() => {
    getDetailData();

  }, [publishId]);

  const setDetailData = (data) => {
    if (!data.variations) data.variations = [];
    if (!data.attributes) data.attributes = [];

    setRowsSelected([{
      status: data.status,
      publishId: data.publishId,
      marketPlaceId: data.marketPlaceId,
      sellerId: data.sellerId,
      complete: data.complete

    }]);

    let atts = {}
    data.attributes.map(m => {
      atts[m.id] = m.value_name;
    });


    data.variations.map(m => {
      if (Array.isArray(m.attributes))
        m.attributes.map(mm => {
          data[`${m.sku}_${mm.id}`] = mm.value_name
        })
    })

    setPublishData({ ...data, ...atts });

    if (data.category) {
      let reqFields = []

      getAttributes(
        data.category,
        (retAtts) => {
          let attributes = [];

          for (let group of retAtts.groups) {
            for (let component of group.components) {
              attributes.push(...component.attributes)
            }
          }

          for (let att of attributes.filter(f => f.tags.find(ff => ff == 'catalog_required'))) {
            reqFields.push({
              field: att.id,
              message: `O Campo Ficha Técnica do Anúncio > ${att.name} é obrigatório`
            });
          }

          setRequiredFields([...staticRequiredFields, ...reqFields]);
          setTechnicalSpecs([...attributes]);
        },
        (err) => enqueueSnackbar(err, { variant: 'error' })
      )
    }

  }

  const refreshSaleTerms = (category) => {
    if (category) getSaleTerms(category, (saleTerms) => {
      setSaleTerms(saleTerms.filter(f => f.id == 'WARRANTY_TYPE' || f.id == 'WARRANTY_TIME'))
    }, (err) => enqueueSnackbar(err, { variant: 'error' }))
  }

  const getDetailData = () => {

    promisseApi(
      'get',
      `/publish/${publishId}`,
      (data) => {
        setDetailData(data);
        refreshSaleTerms(data.category)

      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );

    promisseApi('get', '/selectlist/sellerid', setSellerList, (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
    promisseApi('get', '/selectlist/marketplaceid', (data) => setMarketPlaceList(data), (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
    promisseApi('get', '/user/superuser', (data) => setUser(data), (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
  }

  const onSetCategory = (category) => {

    getAttributes(
      category,
      (data) => {
        let attributes = [];
        let reqFields = [];

        for (let group of data.groups) {
          for (let component of group.components) {
            attributes.push(...component.attributes)
          }
        }

        for (let att of attributes.filter(f => f.tags.find(ff => ff == 'catalog_required'))) {
          reqFields.push({
            field: att.id,
            message: `O Campo Ficha Técnica do Anúncio > ${att.name} é obrigatório`
          });

        }

        setRequiredFields([...staticRequiredFields, ...reqFields]);
        setTechnicalSpecs([...attributes]);
      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    );
    setPublishData({
      ...values, category
    })
    refreshSaleTerms(category)
  }

  return (
    <>



      <Form onSubmit={handleSubmit}>
        <AlertDialog
          isOpen={skuToDelete}
          title="Deletar Variação"
          description="Deseja mesmo deletar a variação? Ao remover a variação ela também será apagada na plataforma"
          handleClose={handleVariationsDelete}
        />

        <GoBackHeader label={'Anúncios'} />

        <Paper elevation={2}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container style={{ padding: 10 }}>
                <Grid item xl={5} lg={5} md={5} sm={12} xs={12} style={{ paddingBottom: 5 }} >
                  <Grid container>

                    <Grid item>
                      <Avatar >
                        <Icon>dvr</Icon>

                      </Avatar>
                    </Grid>

                    <Grid item style={{ marginTop: 2 }} >
                      <Chip
                        label={'Anúncio'}
                        // variant="contained"
                        size="small"
                        style={{ marginTop: 7, paddingLeft: 5, marginBottom: 4, fontSize: 10, fontWeight: 600, marginLeft: 5 }}
                      />
                    </Grid>

                    <Grid item style={{ marginTop: 3 }}>
                      <Typography style={{ paddingLeft: 7, fontWeight: 600, paddingTop: 7 }} >
                        {publishData.publishId ? publishData.publishId : ''} - {publishData.title ? publishData.title : ''}
                      </Typography>
                    </Grid>

                  </Grid>

                </Grid>

                <Grid item lg={7} md={7} xs={12} style={{ marginTop: 10 }}>
                  <PublishActions
                    publishies={rowsSelected}
                    executeAfterAction={getDetailData}
                    detailActions
                    status={values.status}
                    edited={edited}
                    valuesDetail={values}
                    handleRefreshClick={getDetailData}
                    requiredFields={requiredFields}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ margin: 0 }} />
            </Grid>


            <Grid item xs={12}>
              {
                requiredFields.find(f => !values[f.field]) && (
                  <Alert severity="error">
                    <AlertTitle style={{ fontSize: 17 }}>Campos obrigatórios para publicar o Anúncio</AlertTitle>
                    <Grid container>
                      {
                        requiredFields.filter(f => !values[f.field]).map(m => (
                          <Grid item xs={12} md={6} style={{ paddingTop: 10 }}>
                            <p style={{ marginBottom: 0 }}>- {m.message}</p>
                          </Grid>
                        ))
                      }
                    </Grid>
                  </Alert>
                )
              }

            </Grid>

            <Grid item xs={12}>

              <Grid container spacing={1} style={{ padding: 10 }}>
                {/* coluna 1 */}

                <Grid item lg={6} md={6} xs={12}>
                  <Grid container >
                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xs={12}>
                      <p style={{ fontSize: 15 }}> <b>Dados Gerais:</b></p>
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={8} lg={8} md={8} sm={8} xs={12} >

                      <Controls.Input
                        autoFocus
                        label="Título*"
                        name="title"
                        value={values.title}
                        onChange={useFormChange}
                        error={errors.title}
                      />

                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12}>
                      <Controls.Select
                        name="sellerId"
                        label="Empresa*"
                        value={values.sellerId}
                        noEmpty={true}
                        onChange={useFormChange}
                        options={sellerList}
                        error={errors.sellerId}
                      />
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12} >
                      <Controls.Select
                        name="condition"
                        label="Condição*"
                        value={values.condition}
                        onChange={useFormChange}
                        disabled={!user}
                        options={[
                          { id: 'new', title: 'Novo' },
                          { id: 'used', title: 'Usado' }
                        ]}

                        error={errors.condition}
                      />
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12}>
                      <Controls.Select
                        name="listingType"
                        label="Tipo de Anúncio*"
                        noEmpty={true}
                        value={values.listingType}
                        onChange={useFormChange}
                        options={[
                          { id: 'gold_pro', title: 'Premium' },
                          { id: 'gold_special', title: 'Clássico' }
                        ]}
                        error={errors.listingType}
                      />
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12} >
                      <Controls.Select
                        name="shipMode"
                        label="Modo de Envio*"
                        noEmpty={true}
                        value={values.shipMode}
                        onChange={useFormChange}
                        options={[
                          { id: 'me1', title: 'Mercado Envios 1' },
                          { id: 'me2', title: 'Mercado Envios 2' }
                        ]}
                        error={errors.shipMode}
                      />
                    </Grid>

                    {user && (
                      <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12}>
                        <Controls.Select
                          name="marketPlaceId"
                          label="Conta"
                          noEmpty={true}
                          value={values.marketPlaceId}
                          onChange={useFormChange}
                          disabled={values.status && values.status != 'pending'}
                          options={marketPlaceList}
                          error={errors.marketPlaceId}
                        />
                      </Grid>
                    )}

                    <Grid item style={{ marginTop: 10, paddingLeft: 5, paddingRight: 5 }} xs={12}>

                      <Typography>Descrição*</Typography>

                      <TextField
                        name="description"
                        rows={5}
                        value={values.description}
                        onChange={useFormChange}
                        error={errors.description}
                        fullWidth
                        multiline
                        inputProps={{ maxLength: 5000 }}
                      />


                    </Grid>

                    <Grid item style={{ marginTop: 10, marginBottom: 10, paddingLeft: 5, paddingRight: 5 }} xs={12}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>Categoria*</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <MeliCategories publishCategory={values.category} onSetCategory={onSetCategory} status={values.status} />

                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12} >
                      <Controls.Select
                        name="warrantyType"
                        label="Garantia*"
                        noEmpty={true}
                        value={values.warrantyType}
                        onChange={warrantyTypeChange}
                        options={
                          saleTerms.find(f => f.id == 'WARRANTY_TYPE') ? saleTerms.find(f => f.id == 'WARRANTY_TYPE').values.map(m => {
                            return {
                              id: m.name,
                              name: m.name
                            }
                          }) : []
                        }
                        error={errors.warrantyType}
                      />
                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12}>
                      <Controls.Input
                        label="Tempo da Garantia*"
                        name="warrantyTime"
                        value={values.warrantyTime}
                        onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); useFormChange(e); }}
                        error={errors.warrantyTime}
                        inputProps={{ maxLength: 3 }}
                      />

                    </Grid>

                    <Grid item style={{ paddingLeft: 5, paddingRight: 5 }} xl={4} lg={4} md={4} sm={4} xs={12}>
                      <Controls.Select
                        label="Tipo de Garantia*"
                        name="warrantyTimeUnit"
                        noEmpty={true}
                        value={values.warrantyTimeUnit}
                        onChange={useFormChange}
                        options={saleTerms.find(f => f.id == 'WARRANTY_TIME') ? saleTerms.find(f => f.id == 'WARRANTY_TIME').allowed_units : []}
                        error={errors.warrantyTimeUnit}
                      />
                    </Grid>

                    {values.category && (
                      <Grid item xs={12}>

                        <Typography style={{ paddingLeft: 5, paddingRight: 5, marginTop: 10 }}  >Ficha Técnica - Anúncio</Typography>





                        <Grid container>

                          <MeliAttibutes
                            listData={technicalSpecs.filter(f => !f.tags.find(f => f == 'read_only' || f == 'variation_attribute' || f == 'allow_variations')).sort((x, y) => {
                              if (x.relevance < y.relevance) { return -1; }
                              if (x.relevance > y.relevance) { return 1; }
                              return 0;
                            })}
                            values={values}
                            errors={errors}
                            handleInputChange={useFormChange}
                          />

                        </Grid>

                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {/* coluna 2 */}

                <Grid item lg={6} md={6} xs={12} >
                  <Grid container spacing={1} style={{ padding: 10 }}>
                    <Grid item xs={12}>
                      <b>Resumo do Anúncio:</b>
                    </Grid>

                    <Grid item xs={6} style={{ marginTop: 7 }}>

                      {publishData && publishData.quality && (
                        <div className={classes.root}>
                          <LinearProgress
                            variant="determinate"
                            style={{
                              height: 12,
                              borderRadius: 10,
                              opacity: '0.5'
                            }}
                            value={publishData && publishData.quality && publishData.quality.health * 100}
                          />
                        </div>
                      )}

                    </Grid>

                    <Grid item xs={6}>
                      {publishData && publishData.quality && <b style={{ color: "primary" }}> {publishData && publishData.quality && publishData.quality.health * 100 > 60 ? publishData.quality.health.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0 }) + 'Exencente' : publishData.quality.health.toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0 }) + ' Baixa'}</b>}
                    </Grid>


                    <Grid item xs={12}>
                      <Icon style={{
                        color: 'Goldenrod',
                        fontSize: '17px',
                        marginRight: '5px',
                      }}>
                        local_offer
                      </Icon>


                      {publishData.condition === 'new' ? 'Novo' : 'Usado'}
                    </Grid>

                    <Grid item xs={12}>
                      {publishData.shipMode === 'me1' ?
                        (
                          <Icon style={{
                            color: 'LightSeaGreen',
                            fontSize: '17px',
                            marginRight: '5px',
                          }}>
                            local_shipping
                          </Icon>
                        )
                        :
                        (
                          <Icon style={{
                            color: 'yellow',
                            fontSize: '17px',
                            marginRight: '5px',
                          }}>
                            local_shipping
                          </Icon>
                        )
                      }
                      {publishData.shipMode === 'me1' ? 'Mercado Envios 1' : 'Mercado Envios 2'}

                    </Grid>

                    <Grid item xs={12}>
                      {publishData.listingType &&
                        (<Icon
                          style={{
                            color: 'MediumSlateBlue',
                            fontSize: '17px',
                            marginRight: '5px',
                          }}
                        >
                          diamond
                        </Icon>
                        )}
                      {publishData.listingType === 'gold_special' ? 'Clássico' : 'Premium'}


                    </Grid>

                    <Grid item xs={12}>
                      {publishData.status === 'active' ? (<Icon
                        style={{
                          color: 'green',
                          fontSize: '17px',
                          marginRight: '5px',
                        }}>play_circle</Icon>) :
                        <Icon
                          style={{
                            color: 'red',
                            fontSize: '17px',
                            marginRight: '5px',
                          }}>paused</Icon>
                      }
                      {publishData.status === 'active' ? 'Ativo' : 'Pausado'}
                    </Grid>

                    <Grid item xs={12}>
                      <Icon style={{
                        color: 'Goldenrod',
                        fontSize: '17px',
                        marginRight: '5px',
                      }}>
                        storefront
                      </Icon>
                      Mercado Livre
                    </Grid>

                    {publishData.status === 'paused' && (
                      <Grid item xs={12}>
                        <Icon style={{
                          color: 'red',
                          fontSize: '17px',
                          marginRight: '5px',
                        }}>
                          cancel
                        </Icon>
                        {publishData.sub_status == 'out_of_stock' ? 'Pausa por falta de Estoque' : 'Pausa Manual'}
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      {publishData.freezedByDeal ?
                        (
                          <Icon style={{
                            fontSize: '17px',
                            marginRight: '5px',
                            color: 'yellow',
                          }}>
                            lock
                          </Icon>
                        ) :
                        (
                          <Icon style={{
                            fontSize: '17px',
                            marginRight: '5px',
                            color: 'blue'
                          }}>
                            lock_open
                          </Icon>
                        )
                      }

                      {publishData.freezedByDeal ? 'Trava de Anúncio Hábilitada' : 'Trava de Anúncio Desabilitada'}
                    </Grid>

                    <Grid item xs={12}>

                      <Icon style={{
                        fontSize: '17px',
                        marginRight: '5px',
                        color: 'DodgerBlue',
                      }}>
                        shopping_cart
                      </Icon>
                      Total Vendas: {publishData.sold}
                    </Grid>



                    <Grid item xs={12}>
                      <b style={{ marginTop: 20 }}>Variações*</b>


                      <List>

                        {values.variations && values.variations.map((data, dataIndex) => {

                          return (
                            <>
                              <Divider />

                              <ListItem
                                button
                                onClick={() => { data.open = !data.open; setPublishData({ ...values }) }}
                              >
                                <Grid Item>
                                  <ListItemAvatar>
                                    <Avatar variant="circle" alt={data.sku ? data.sku : ''} >
                                      <img src={data.images && data.images.length > 0 && data.images[0]} />
                                      {data.sku ? data.sku.charAt(0) : ''}
                                    </Avatar>
                                  </ListItemAvatar>

                                </Grid>
                                <ListItemText
                                  primary={data.sku}
                                  secondary={`${data.price && data.price.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                  })} | ${data.quantity} disponíveis`}
                                />

                                <IconButton
                                  disabled={data._id ? true : false}
                                  onClick={() => setSkuToDelete(data.sku)}
                                >
                                  <Icon>
                                    delete
                                  </Icon>
                                </IconButton>


                                <Icon>{data.open ? 'expand_less' : 'expand_more'}</Icon>


                              </ListItem>




                              <Collapse in={data.open} timeout="auto" unmountOnExit>
                                <Grid container spacing={2} style={{ paddingTop: 10, paddingBottom: 10 }}>

                                  <Grid item lg={12} sm={12} xs={12} >
                                    <UploadFilesPreview
                                      label='Arraste as imagens aqui!'
                                      field='images'
                                      files={
                                        data.images
                                      }
                                      onFileChange={(images, field) => fileChange(images, field, dataIndex)}
                                      sizeLimit={1024000000}
                                    />

                                  </Grid>

                                  <Grid item lg={12} sm={12} xs={12}>

                                    <MeliAttibutes
                                      listData={technicalSpecs.filter(f => !f.tags.find(f => f == 'read_only')).filter(f => f.tags.find(f => f == 'allow_variations'))}
                                      values={values}
                                      errors={errors}
                                      handleInputChange={useFormChange}
                                      variation={data.sku}
                                    />
                                  </Grid>


                                  <Grid item lg={12} sm={12} xs={12}>
                                    <Paper
                                      component="ul"
                                      style={{
                                        display: 'flex',
                                        // justifyContent: 'center',
                                        flexWrap: 'wrap',
                                        listStyle: 'none',
                                        padding: 5,
                                        margin: 0,
                                      }}
                                    >
                                      <li key={0}>
                                        <Button
                                          startIcon={<Icon>add</Icon>}
                                          style={{ marginRight: 5 }}
                                          onClick={() => {
                                            setAtt({ sku: data.sku, category: values.category, open: true, attributes: data.attributes })
                                          }}
                                        >Característica da Variação</Button>
                                      </li>

                                      {Array.isArray(data.attributes) && data.attributes.filter(f => f.custom).map((att, attIndex) => {

                                        return (
                                          <li key={att.id}>
                                            <Chip
                                              // icon={<>}
                                              style={{ marginTop: 2, marginRight: 5 }}
                                              label={`${att.name}: ${att.value_name}`}
                                              onDelete={() => {
                                                data.attributes.splice(attIndex, 1)
                                                setDetailData({ ...values });
                                              }}
                                            />
                                          </li>
                                        );
                                      })}
                                    </Paper>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Accordion>
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                      >
                                        <Typography>Ficha Técnica - Variação</Typography>
                                      </AccordionSummary>
                                      <Typography>

                                        <Grid container style={{ padding: 10 }}>


                                          <MeliAttibutes
                                            listData={technicalSpecs.filter(f => !f.tags.find(f => f == 'read_only')).filter(f => f.tags.find(f => f == 'variation_attribute')).sort((x, y) => {
                                              if (x.relevance < y.relevance) { return -1; }
                                              if (x.relevance > y.relevance) { return 1; }
                                              return 0;
                                            })}
                                            values={values}
                                            errors={errors}
                                            handleInputChange={useFormChange}
                                            variation={data.sku}
                                          />

                                        </Grid>
                                      </Typography>
                                    </Accordion>
                                  </Grid>
                                </Grid>
                              </Collapse>
                            </>
                          )

                        }
                        )}

                        <Divider />
                        <ListItem
                          button
                          onClick={() => {
                            setNewVariation({ ...publishData })

                          }}
                          style={{ paddingTop: 15, paddingBottom: 15 }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <Icon>add</Icon>
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText primary={'Adicionar Variações'} />


                        </ListItem>
                        <Divider />
                      </List>

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

            </Grid>


          </Grid>






        </Paper>
      </Form>

      <PublishSkuList publish={newVariation} handleSelectSku={handleSelectSku} />
      <AddPubAttributes setOpen={setAtt} open={att.open} publishData={att} onSubmit={handleAtt} />
    </>
  )
}
