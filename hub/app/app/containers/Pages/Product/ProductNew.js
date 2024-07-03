import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Collapse, Divider, Grid, Icon, IconButton, Input, InputAdornment, InputLabel, List, ListItem, MenuItem, Paper, Select, Tooltip } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import MeliCategories from '../../../components/Meli/MeliCategories';
import MeliAttibutes from '../../../components/Meli/MeliAttibutes';
import { makeStyles } from '@material-ui/core/styles';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';
import { promisseApi } from '../../../api/api';


const useStyles = makeStyles(theme => ({
  bottomBar: {
    position: 'fixed',
    top: 'auto',
    bottom: 0,
    width: '100%',
    padding: 10,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 90000
  },
}))

function GroupForm(props) {
  let { title, subTitle, children } = props;
  return (
    <Grid container spacing={2}>
      <Grid item xl={3} lg={3} md={3} sm={12} xs={12} >
        <p style={{ color: 'rgba(132, 100, 200, 0.7)', marginBottom: 0 }}>{title}</p>
        <p style={{ fontSize: 10 }}>{subTitle}</p>
      </Grid>

      <Grid item xl={9} lg={9} md={9} sm={12} xs={12} >
        {children}
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  )
}

function ProductVariations(props) {
  let { productDetail, setProductDetail } = props;

  return productDetail.variations.map(variation => {
    return (

      <Paper elevation={4} style={{ padding: 10, marginBottom: 10 }}>
        <Collapse in={variation.open} collapsedSize={40}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item>
                  <Avatar><img src={variation.images.length > 0 && variation.images[0].url} /></Avatar>
                </Grid>
                <Grid item xs container>
                  <Grid item>
                    <p style={{ marginBottom: 0 }}>{`${variation.barCode || ''} - ${variation.sku || ''}`}</p>
                    <p style={{ marginBottom: 0, fontSize: 12 }}>{`${(variation.price || 0).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })} | ${variation.stock || 0}`}</p>

                  </Grid>
                </Grid>
                <Grid item style={{ marginTop: 7 }}>
                  <IconButton
                    id="deleteVariation"
                    disabled={productDetail.variations.length < 2}
                    onClick={() => {
                      productDetail.variations = productDetail.variations.filter(f => f != variation);
                      setProductDetail({ ...productDetail });
                    }}

                  >
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton
                    id="openVariation"
                    onClick={() => {
                      variation.open = !variation.open;
                      setProductDetail({ ...productDetail });
                    }}

                  >
                    <Icon>{variation.open ? 'expand_less' : 'expand_more'}</Icon>
                  </IconButton>
                </Grid>

              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <UploadFilesPreview
                label='Arraste as imagens aqui!'
                field='images'
                files={
                  variation.images
                }
                onFileChange={(e) => {
                  variation.images = e;
                  setProductDetail({ ...productDetail });
                }}
                sizeLimit={1024000000}
              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Código de Barras</p>
              <Input
                id="barCode"
                value={variation.barCode || ''}
                onChange={(e) => {
                  variation.barCode = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                  setProductDetail({ ...productDetail });
                }}

              />
            </Grid>
            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Código Interno</p>
              <Input
                id="sku"
                value={variation.sku || ''}
                onChange={(e) => {
                  variation.sku = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                  setProductDetail({ ...productDetail });
                }}

              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Preço</p>
              <Input
                id="price"

                value={(variation.price || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
                onChange={(e) => {
                  let numValue =
                    Number(e.target.value.replace('R$', '').replaceAll(',', '').replaceAll('.', '')) / 100;

                  variation.price =
                    numValue > 99999 ? Number(String(numValue * 100).substring(0, 7)) / 100 : numValue;

                  setProductDetail({ ...productDetail });
                }}
              />
            </Grid>
            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Estoque</p>
              <Input
                id="stock"
                type='number'
                value={variation.stock ? String(variation.stock) : '0'}
                onChange={(e) => {
                  variation.stock =
                    Number(e.target.value) < 0 ? 0 :
                      Number(e.target.value) > 99999 ? Number(e.target.value.substring(0, 5)) :
                        Number(e.target.value);

                  setProductDetail({ ...productDetail });
                }}

              />
            </Grid>
          </Grid>
          <MeliAttibutes
            category={productDetail.category}
            attributes={variation.attributes}
            filter={f => f.tags.find(ff => (ff == 'variation_attribute' || ff == 'allow_variations') && ff != 'read_only')}
            onChange={(atts) => {
              variation.attributes = [...atts];
              setProductDetail({ ...productDetail })
            }}
          />
        </Collapse>
      </Paper>

    )
  })
}


export default function ProductNew(props) {

  const { enqueueSnackbar } = useSnackbar();
  const [barCode, setBarCode] = useState();
  const classes = useStyles();

  const newVariation = {
    images: [],
    attributes: [],
    open: true
  };

  const [productDetail, setProductDetail] = useState({
    isNew: true,
    variations: [newVariation]
  });




  return (
    <Form onSubmit={() => { }} >

      <Paper style={{ padding: 20, marginBottom: 40 }}>

        <GroupForm
          title='Cadastro de Produto'
          subTitle='Preencha um código de barras GTIN/EAN válido'
        >
          <p style={{ marginBottom: 0, fontSize: 12 }}>Código de Barras</p>
          <Input
            id="findBarCode"
            style={{ maxWidth: 250 }}
            fullWidth
            value={barCode}
            onChange={(e) => setBarCode(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => { }}
                // onMouseDown={handleMouseDownPassword}
                >
                  <Icon>search</Icon>
                </IconButton>
              </InputAdornment>
            }
          />
        </GroupForm>

        <GroupForm
          title='Dados Gerais'
          subTitle='Verifique os dados do seu anúcio'
        >
          <p style={{ marginBottom: 0, fontSize: 12 }}>Título</p>
          <Input
            id="title"
            fullWidth
            value={productDetail.title || ''}
            onChange={e => setProductDetail({ ...productDetail, title: e.target.value })}
            onBlur={() => { 
              promisseApi(
                'get',
                '/sku/categoryByTitle',
                (data) => {
                  setProductDetail({...productDetail, category: data})
                },
                (e) => {enqueueSnackbar(e, {variant: 'error', anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'right'
                }})},
                {},
                {
                  params: {
                    title: productDetail.title
                  }
                }
              ) 
            }}
          />

          <p style={{ marginBottom: 0, fontSize: 12, paddingTop: 10 }}>Empresa</p>
          <Select
            id="seller"
            fullWidth
            value={productDetail.sellerId || 10}
            onChange={e => setProductDetail({ ...productDetail, sellerId: e.target.value })}
            style={{ maxWidth: 400 }}
          >
            <MenuItem value={10}>Nestlé Brasil Ltda</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>

          <p style={{ marginBottom: 0, fontSize: 12, paddingTop: 10, color: 'red' }}>Descrição</p>
          <Input
            id="description"
            multiline
            rows={6}
            fullWidth
            // error={true}
            value={productDetail.description || ''}
            onChange={(e) => {
              setProductDetail({ ...productDetail, description: e.target.value });
            }}
            error={true}
            helperText={'Campo obrigatório'}

          />
          <p style={{ marginBottom: 0, fontSize: 12, color: 'red' }}>Campo obrigatório</p>
        </GroupForm>


        <GroupForm
          title='Categoria'
          subTitle='Escolha a categoria do produto.'
        >
          <MeliCategories
            category={productDetail.category || ''}
            onSetCategory={(e) => setProductDetail({ ...productDetail, category: e })}
            dislabled={!productDetail.isNew}
          />
        </GroupForm>

        <GroupForm
          title='Ficha Técnica'
          subTitle='Especificações técnicas obrigatórias do produto de acordo com a categoria selecionada.'
        >
          <MeliAttibutes
            category={productDetail.category}
            onChange={(atts) => { setProductDetail({ ...productDetail, attributes: atts }) }}
          />
        </GroupForm>

        <GroupForm
          title='Variações'
          subTitle='Adicione ou modifique as variações ao produto, os códigos internos e de barras não podem se repetir, todos os campos inclusive imagem são obrigatórios'
        >
          <ProductVariations productDetail={productDetail} setProductDetail={setProductDetail} />
          <ButtonDefault
            icon={'add'}
            label={'Adicionar Variação'}
            fullWidth={false}
            onClick={() => {
              productDetail.variations.push(newVariation);
              setProductDetail({ ...productDetail });
            }}
          />
        </GroupForm>


        <GroupForm
          title='Dados Fiscais'
          subTitle='Dados utilzados pelo módulo fiscal para calcular as alíquotas de imposto na emissão da NF.'
        >

          <Grid container spacing={1}>
            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Cest</p>
              <Input
                id="cest"
                fullWidth
                value={productDetail.cest || ''}
                onChange={e => setProductDetail({ ...productDetail, cest: e.target.value })}

              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Ncm</p>
              <Input
                id="ncm"
                fullWidth
                value={productDetail.ncm || ''}
                onChange={e => setProductDetail({ ...productDetail, ncm: e.target.value })}

              />
            </Grid>
          </Grid>
        </GroupForm>

        <GroupForm
          title='Dimensões'
          subTitle='Preencha os dados de volume e peso considerando a embalagem. Medidas em (centímetros) e Peso em (gramas)'
        >

          <Grid container spacing={1}>
            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Altura</p>
              <Input
                id="heigth"
                fullWidth
                value={productDetail.heigth || ''}
                onChange={e => setProductDetail({ ...productDetail, heigth: e.target.value })}

              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Largura</p>
              <Input
                id="width"
                fullWidth
                value={productDetail.width || ''}
                onChange={e => setProductDetail({ ...productDetail, width: e.target.value })}

              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Profundidade</p>
              <Input
                id="depth"
                fullWidth
                value={productDetail.depth || ''}
                onChange={e => setProductDetail({ ...productDetail, depth: e.target.value })}

              />
            </Grid>

            <Grid item>
              <p style={{ marginBottom: 0, fontSize: 12 }}>Peso</p>
              <Input
                id="weigth"
                fullWidth
                value={productDetail.weigth || ''}
                onChange={e => setProductDetail({ ...productDetail, weigth: e.target.value })}

              />
            </Grid>

          </Grid>
        </GroupForm>

      </Paper>

      <Box boxShadow={3} className={classes.bottomBar}>
        <Grid container justifyContent='center' spacing={1}>
          <Grid item>
            <ButtonDefault
              size='medium'
              icon={'save'}
              label={'Salvar Rascunho'}
              fullWidth={false}
              variant={'contained'}
              onClick={() => {
                productDetail.variations.push(newVariation);
                setProductDetail({ ...productDetail });
              }}
            />
          </Grid>
          <Grid item>
            <ButtonDefault
              size='medium'
              icon={'upload'}
              label={'Publicar'}
              fullWidth={false}
              variant='contained'
              color='primary'
              onClick={() => {
                productDetail.variations.push(newVariation);
                setProductDetail({ ...productDetail });
              }}
            />
          </Grid>

        </Grid>
      </Box>

    </Form>
  );
}
