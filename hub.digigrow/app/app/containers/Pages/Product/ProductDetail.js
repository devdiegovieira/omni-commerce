import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { alpha, Avatar, Button, Chip, Dialog, DialogContent, DialogTitle, FormControlLabel, Grid, Icon, IconButton, Paper, styled, Switch, Tab, Tabs, Tooltip, Typography } from '@material-ui/core';
import { green, purple } from '@material-ui/core/colors';
import { promisseApi } from '../../../api/api';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import GoBackHeader from '../../../components/GoBackHeader';
import { useHistory } from 'react-router-dom';
import AddAttributes from './AddAtributes';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { ProductHeader } from './ProductHeader';
import { ProductVariation } from './ProductVariation';
import { ProductMoney } from './ProductMoney';
import { ProductSize } from './ProductSize';
import { TabPanel } from '../Sale/SaleSettingsPage';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import { Alert, AlertTitle } from '@material-ui/lab';
import ProductNew from './ProductNew';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  saveProgress: {
    color: green[500],
    position: 'absolute',
    top: -26,
    left: -23,
    zIndex: 1,
  }
}));

const GreenSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'lightGrey',
    '&:hover': {
      backgroundColor: alpha('#58F808', theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#58F808',
  },
}));

export default function ProductDetail(props) {
  const classes = useStyles();
  const history = useHistory();

  let {
    skuId,
    handleRefreshClick
  } = props;

  const [productDetail, setProductDetail] = useState({
    variations: [{
      sku: '',
      open: true,
      price: '0',
      stock: '0',
      image: [],
      isNew: true
    }]
  });

  const [gtin, setGtin] = useState();

  const [sellerSelectList, setSellerSelectList] = useState([]);
  const [att, setAtt] = useState({});
  const [category, setCategory] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  const defaultRequired = [
    {
      field: 'sku',
      message: 'Código do produto deve ser preenchido e não pode ser igual ao das variações',
      rule: (value, field) => {
        return !value[field] || (Array.isArray(values.variations) && values.variations.filter(f => f.sku == value[field]).length > 1);
      }
    },
    {
      field: 'title',
      message: 'O Campo Título é obrigatório'
    },
    {
      field: 'sellerId',
      message: 'O Campo Empresa é obrigatório'
    },
    {
      field: 'price',
      message: 'O Campo Preço é obrigatório'
    },
    {
      field: 'stock',
      message: 'O Campo Estoque é obrigatório'
    },
    {
      field: 'attributes',
      message: 'O Campo Atributo é obrigatório',
      rule: (value, field) => {
        return (!value[field] && (!Array.isArray(value.variations) || value.variations.length == 0)) ||
          (Array.isArray(value.variations) && value.variations.find(f => !f.attributes || (Array.isArray(f.attributes) && f.attributes.length == 0))) ||
          ((!value.variations || (Array.isArray(value.variations) && value.variations.length == 0)) && Array.isArray(value[field]) && value[field].length == 0)
      }
    },
    {
      field: 'image',
      message: 'O Campo Imagem do Produto é obrigatório',
      rule: (value, field) => {
        return (!value[field] && (!Array.isArray(value.variations) || value.variations.length == 0)) ||
          (Array.isArray(value.variations) && value.variations.find(f => !f.image || (Array.isArray(f.image) && f.image.length == 0))) ||
          ((!value.variations || (Array.isArray(value.variations) && value.variations.length == 0)) && Array.isArray(value[field]) && value[field].filter(f=> !f.deleted).length == 0)
      }
    },
  ]

  let [requiredFields, setRequiredFields] = useState(defaultRequired);
  let [fieldMessages, setFieldMessages] = useState([]);


  const setProductData = (data = values) => {


    let newRequired = []

    Array.isArray(data.variations) && data.variations.map((v, vIndex) => {


      data[`sku_${vIndex}`] = v.sku;
      data[`gtin_${vIndex}`] = v.gtin;
      data[`price_${vIndex}`] = v.price;
      data[`stock_${vIndex}`] = v.stock.toString();

      newRequired.push({
        field: `price_${vIndex}`,
        message: 'Preço das variações obrigatório'
      })
      newRequired.push({
        field: `stock_${vIndex}`,
        message: 'Estoque das variações obrigatório'
      })
      newRequired.push({
        field: `sku_${vIndex}`,
        message: 'Código das variações deve ser preenchido e não pode ser repetido',
        rule: (value, field) => {
          return !value[field] || value[field] == value.sku || data.variations.filter(f => f.sku == value[field]).length > 1;
        }
      })
      newRequired.push({
        field: `gtin_${vIndex}`,
        message: 'Código GTIN(EAN) das variações deve ser preenchido e não pode ser repetido',
        rule: (value, field) => {
          return !value[field] || data.variations.filter(f => f.gtin == value[field]).length > 1;
        }
      })

    });

    setRequiredFields([...defaultRequired, ...newRequired]);

    setProductDetail({ ...data });
  }

  const handleAtt = (att) => {
    let variation = values.variations && values.variations.length > 0 ? values.variations.find(f => f.sku == att.sku) : values;

    if (variation) {
      if (!variation.attributes) variation.attributes = [];

      variation.attributes.push({
        id: att.attId,
        value: att.attValue
      });

      setProductData();
    }
  }

  const getDetailData = () => {
    if (skuId != 'new')
      promisseApi(
        'get',
        `/sku/${skuId}`,
        (data) => {
          if (data.price) {
            data.priceValue = data.price;
            data.price = `R$ ${data.price.toLocaleString('pt-BR')}`;
            data.stock = data.stock.toString();
          }
          if (data.variations) {
            data.variations.map(mm => mm.price = mm.price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }))
          }
          setProductData(data);
          handleRefreshClick();
        },
        (err) => enqueueSnackbar(err, { variant: 'error' })

      );
    else setProductData(productDetail);

    promisseApi(
      'get',
      `/selectlist/sellerId`,
      setSellerSelectList,
      (err) => enqueueSnackbar(err, { variant: 'error' })

    );

    promisseApi(
      'get',
      `/selectlist/category/`,
      (data) => setCategory(data),
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )


  }

  useEffect(() => {
    if (skuId) getDetailData();
  }, [skuId]);

  const submit = () => {
    if (!values.variations) values.variations = [];

    if (values.price < 0) errAtt.push('Valor não pode ser menor que 0')
    if (values.stock < 0) errAtt.push('Estoque não pode ser menor que 0')

    let attArr = [];
    values.variations.map(m => Array.isArray(m.attributes) && attArr.push(...m.attributes.map(mm => mm.id)));
    attArr = attArr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    })

    let errAtt = [];
    values.variations.map(m => {
      for (let att of attArr) {
        if (!m.attributes) m.attributes = [];
        if (Array.isArray(m.attributes) && !m.attributes.find(f => f.id == att))
          errAtt.push(`O atributo '${att.toUpperCase()}' precisa ser preenchido na variação '${m.sku}'`)
      }
    })

    if (errAtt.length > 0) {
      enqueueSnackbar(handleError(errAtt.join(',')), { variant: 'error' })
    } else {

      values.variations.map((v, vIndex) => {

        delete values[`sku_${vIndex}`];
        delete values[`price_${vIndex}`];
        delete values[`price_${vIndex}Value`];
        delete values[`stock_${vIndex}`];

      });

      promisseApi(
        skuId == 'new' ? 'post' : 'put',
        `/sku`,
        (data) => {

          let address = data.find(f => f.sku == values.sku).skuId

          if (values.image) handleAddImage(values.sku, values.sellerId, values.image.filter(f => f.new).map(m => m.file),address, data);

          if (Array.isArray(values.variations)) values.variations.map(variation => {
            handleAddImage(variation.sku, values.sellerId, variation.image.filter(f => f.new).map(m => m.file), address, data);
          })

          if (skuId == 'new') {
            enqueueSnackbar('Registro salvo com sucesso!', { variant: 'success' });
          }
          else {
            enqueueSnackbar('Registro Alterado com sucesso!', { variant: 'success' });
            getDetailData();
          }

        },
        (e) => {
          enqueueSnackbar(handleError(e), { variant: 'error' });
        },
        {
          ...values,
          price: values.priceValue,
          image: values.image ? values.image.filter(f => !f.new && !f.deleted).map(m => m.url ? m.url : m) : [],
          imageDeleted: values.image ? values.image.filter(f => f.deleted).map(m => m.url ? m.url : m) : [],
          variations: values.variations.map(variation => {
            return {
              ...variation,
              image: variation.image.filter(f => !f.new && !f.deleted).map(m => m.url ? m.url : m),
              imageDeleted: variation.image.filter(f => f.deleted).map(m => m.url ? m.url : m),
              priceValue: parseFloat(variation.price.replace('R$', '').replace('.', '').replace(',', '.')),
              price: parseFloat(variation.price.replace('R$', '').replace('.', '').replace(',', '.'))
            }
          })
        }
      );
    }
  }

  const handleAddImage = (sku, sellerId, images, address, data) => {

    if (images.length > 0) {

      let form = new FormData();

      for (let image of images) {
        form.append("image", image, image.name);
      }

      promisseApi(
        'post',
        `/sku/image`,
        () => {
          if (skuId == 'new') {
            history.push(`/product/${data.find(f => f.sku == values.sku).skuId}`);
          } else {
            getDetailData();
          }
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        form,
        {
          headers: {
            'content-type': 'multipart/form-data',
            sku,
            sellerId
          }
        }
      )
    }

  }


  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    validate
  } = useForm(productDetail, true, submit, []);

  useEffect(() => {
    let { fields } = validate(values, requiredFields);
    setFieldMessages(Object.keys(fields).map(m => fields[m]).filter(f => f != ''))
  }, [requiredFields, values])


  const variationChange = (e) => {
    let field = e.target.name.split('_');

    values.variations[field[1]][field[0]] = e.target.value;
    if (e.target.money) values.variations[field[1]][`${field[0]}Value`] = e.target.money;
    handleInputChange(e);

    if (values.variations.length > 0) {
      values.price = `R$ ${Math.max(...values.variations.map(m => m.priceValue)).toLocaleString('Pt-BR')}`;
      values.priceValue = Math.max(...values.variations.map(m => m.priceValue));
      values.stock = values.variations.reduce((n, { stock }) => n + parseInt(stock), 0).toString();
    }

    setProductData()
  }

  const fileChange = (images, field, varIndex) => {
    let item = varIndex >= 0 ? values.variations[varIndex] : values;
    item[field] = images;
    setProductData()
  }

  const [value, setValue] = useState(0);
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const searchGtin = (e) => {
    e.preventDefault();

    promisseApi(
      'get',
      '/sku/getDefaultData',
      (data) => {

      },
      (err) => enqueueSnackbar(err, { variant: 'error' })
    )

    setGtin(values.gtin_0);
  }

  return (
    <>


        <GoBackHeader label={"Produtos"} to={'/product'} />



      {/* <Dialog open=}>
        <DialogContent style={{ marginBottom: 10 }}>
        </DialogContent>
      </Dialog> */}

      <ProductNew />


      {/* {skuId == 'new' && !gtin &&
        <Form onSubmit={searchGtin}>

          <Grid container>

            <Grid item xs={12}>
              Para começar preencha um GTIN/EAN
            </Grid>
            <Grid item xs={12}>
              <Controls.Input
                name={`gtin_0`}
                autoFocus
                label="GTIN (EAN)"
                value={values.gtin_0}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                  variationChange(e);
                }}
                error={values.gtin_0 && values.gtin_0.length < 8 ? 'EAN inválido' : ''}
                inputProps={{ maxLength: 14 }}
              />
            </Grid>
            <Grid item>
              <ButtonDefault
                type='submit'
                icon={'arrow_forward'}
                label={'Continuar'}
                variant={'contained'}
              />
            </Grid>
          </Grid>
        </Form>

      } */}


      {(skuId != 'new' || gtin) &&
        <Form onSubmit={handleSubmit}>
          <Paper style={{ marginTop: 5 }}>
            <Grid container spacing={1} >
              <Grid item xs={12}>
                <Grid container style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
                  <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                    <Grid container>

                      <Grid item style={{ paddingRight: 7, marginTop: 4 }} >
                        <Avatar>
                          <LocalOfferIcon />
                        </Avatar>
                      </Grid>

                      <Grid item style={{ marginTop: 4 }}>
                        <Chip
                          label={!values.productId ? 'Produto' : 'Variação'}
                          // variant="contained"
                          size="small"
                          style={{ marginTop: 7, paddingLeft: 5, marginBottom: 4, fontSize: 10, fontWeight: 600 }}
                        />
                      </Grid>

                      <Grid item style={{ marginTop: 5 }}>
                        <Typography style={{ paddingLeft: 7, fontWeight: 600, paddingTop: 7 }} >
                          {values.sku} - {values.title}
                        </Typography>
                      </Grid>

                    </Grid>
                  </Grid>

                  <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
                    <Grid container justifyContent='flex-end'>

                      <Grid item>
                        <Controls.Switch
                          label="Ativo"
                          name="isActive"
                          value={values.isActive}
                          onChange={handleInputChange}
                          error={errors.isActive}
                          control={(props) => <GreenSwitch color="secondary" {...props} />}
                        />
                      </Grid>

                      <Grid item style={{ marginTop: 5 }}>
                        <Tooltip
                          title={'Salvar'}
                        >
                          <ButtonDefault
                            type="submit"
                            startIcon={<Icon>save</Icon>}
                            size="small"
                            disabled={(fieldMessages.length > 0)}
                            label={'Salvar'}
                          />
                        </ Tooltip>
                      </Grid>
                    </Grid>
                  </Grid>


                </Grid>
              </Grid>

              <Grid item xs={12} lg={12}>
                {
                  fieldMessages.length > 0 && (


                    <Alert
                      severity="error"
                    >

                      <AlertTitle style={{ fontSize: 17 }}>Campos obrigatórios *</AlertTitle>

                      <Grid container >
                        {

                          fieldMessages.map(m => (
                            <Grid item xs={12} md={6} lg={4} xl={3} style={{ paddingTop: 10 }}>
                              <p style={{ marginBottom: 0 }}>- {m}</p>
                            </Grid>
                          ))
                        }

                      </Grid>

                    </Alert>

                  )
                }
              </Grid>

              <Grid item xs={12} >
                <Tabs
                  orientation={"horizontal"}
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Menu Configurações"
                  lassName={classes.tabs}
                >
                  <Tab label="Descrição" {...a11yProps(0)} />
                  <Tab label="Fiscal" {...a11yProps(1)} />
                  <Tab label="Dimensões" {...a11yProps(2)} />
                </Tabs>
              </Grid>

            <Grid item xs={12} style={{ padding: 20 }}>
              <TabPanel value={value} index={0} >
                <ProductHeader values={values} sellerSelectList={sellerSelectList} errors={errors} handleInputChange={handleInputChange} category={category} />
                <ProductVariation values={values} setAtt={setAtt} errors={errors} setProductData={setProductData} fileChange={fileChange} variationChange={variationChange} />
              </TabPanel>

                <TabPanel value={value} index={1} >
                  <ProductMoney values={values} handleInputChange={handleInputChange} errors={errors} />
                </TabPanel>

                <TabPanel value={value} index={2} >
                  <ProductSize values={values} handleInputChange={handleInputChange} errors={errors} />
                </TabPanel>
              </Grid>

            </Grid>
          </Paper>
        </Form >
      }


      <AddAttributes open={att.open} setOpen={setAtt} skuCode={att} handleError={handleError} onSubmit={handleAtt} />

    </>
  );
}
