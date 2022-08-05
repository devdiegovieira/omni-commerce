import { Avatar, Button, Chip, Collapse, Divider, Grid, Icon, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import Controls from '../../../components/Forms/controls';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';


export function ProductVariation(props) {
  const { values, setAtt, errors, setProductData, fileChange, variationChange } = props;

  return (
    <Grid container>
      {/* att */}
      {(!values || !values.variations || values.variations.length == 0) &&
        <Grid item xs={12}>
          <Paper
            component="ul"
            style={{

              padding: 5,
            }}
          >
            <Button
              startIcon={<Icon>add</Icon>}
              style={{ textTransform: 'none', marginRight: 5, fontSize: 11, paddingTop: 5, paddingBottom: 5, marginTop: 3 }}
              onClick={() => { setAtt({ sku: values.sku, open: true, attributes: values.attributes ? values.attributes.map(m => m.id) : [] }) }}
            >
              Adicionar Atributo
            </Button>

            {values.attributes && values.attributes.map((data, dataIndex) => {

              return (
                <Chip
                  label={`${data.id ? data.id : ''}: ${data.value ? data.value : ''}`}
                  onDelete={() => {
                    values.attributes.splice(dataIndex, 1)
                    setProductData();
                  }}
                />
              );
            })}
          </Paper>
        </Grid>
      }

      {/* images */}
      {(!values || !values.variations || values.variations.length == 0) &&
        <Grid xs={12} style={{ padding: 7 }}>

          <UploadFilesPreview
            label='Arraste as imagens aqui!'
            field='image'
            files={
              values.image ? values.image : []
            }
            onFileChange={fileChange}
            sizeLimit={1024000000}
          />
        </Grid>
      }


      <Grid item xs={12}>
        <List>
          <Grid container spacing={1}>

            <Grid item xs={12}>
              <p style={{marginBottom: 0}}>Variações</p>
              <Divider />
            </Grid>




            {values.variations && values.variations.map((item, itemIndex) => (
              <Grid item xs={12}>
                <Paper >
                  <Grid item xs={12}>
                    <ListItem
                      button
                      onClick={() => { item.open = !item.open; setProductData() }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <img src={item.image && item.image.length > 0 && item.image[0].url ? item.image[0].url : item.image[0] } />
                        </Avatar>
                      </ListItemAvatar>
                      <Grid container>

                        <Grid item xl={4} lg={4} md={12} sm={12} xs={12}>
                          <ListItemText
                            primary={values[`sku_${itemIndex}`] || 'Sem Código'}
                            secondary={`${values[`price_${itemIndex}`]} | ${values[`stock_${itemIndex}`]} disponíveis`}
                          />
                        </Grid>

                        <Grid item style={{ paddingTop: 9 }} >

                          <Button
                            startIcon={<Icon>add</Icon>}
                            style={{ textTransform: 'none', marginRight: 5, fontSize: 11, paddingTop: 5, paddingBottom: 5, marginTop: 3 }}
                            onClick={() => { setAtt({ sku: item.sku, open: true, attributes: item.attributes || [] }) }}
                            disabled={!values[`sku_${itemIndex}`]}
                          >Adicionar Atributo</Button>


                          {item.attributes && item.attributes.map((data, dataIndex) => {

                            return (
                              <Chip
                                style={{ marginTop: 2, marginRight: 5 }}
                                label={`${data.id}: ${data.value}`}
                                onDelete={() => {
                                  item.attributes.splice(dataIndex, 1)
                                  setProductData();
                                }}
                              />
                            );
                          })}
                        </Grid>

                      </Grid>

                      <ListItemIcon>
                        <IconButton
                          onClick={() => values.variations.splice(itemIndex, 1)}
                          disabled={!item.isNew || values.variations.length < 2}
                        >
                          <Icon>
                            delete
                          </Icon>
                        </IconButton>
                        <Icon style={{ marginTop: 3 }}>{item.open ? 'expand_less' : 'expand_more'}</Icon>
                      </ListItemIcon>
                    </ListItem>

                  </Grid>

                  <Grid item xs={12}>

                    <Collapse in={item.open} timeout="auto" unmountOnExit>
                      <Grid container spacing={1} style={{ padding: 10 }}>

                        <Grid item lg={3} sm={3} xs={12} >
                          <Controls.Input
                            name={`gtin_${itemIndex}`}
                            label="GTIN (EAN)"
                            disabled={!item.isNew}
                            value={values[`gtin_${itemIndex}`]}
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                              variationChange(e);
                            }}
                            error={values[`gtin_${itemIndex}`] && values[`gtin_${itemIndex}`].length < 8 ? 'EAN inválido': ''}

                            inputProps={{ maxLength: 14 }}
                          />
                        </Grid>

                        <Grid item lg={3} sm={3} xs={12}>
                          <Controls.Input
                            name={`sku_${itemIndex}`}
                            label="Código"
                            value={values[`sku_${itemIndex}`]}
                            length={20}
                            disabled={!item.isNew}
                            onChange={(e) => { e.target.value = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase(); variationChange(e) }}
                            error={errors[`sku_${itemIndex}`]}
                          />
                        </Grid>

                        <Grid item lg={3} sm={3} xs={12}>
                          <Controls.Input
                            name={`stock_${itemIndex}`}
                            label="Estoque"
                            type='number'
                            value={values[`stock_${itemIndex}`] < 0 ? 0 : values[`stock_${itemIndex}`]}
                            onChange={variationChange}
                            error={errors[`stock_${itemIndex}`]}
                            min={0}
                            max={99999}
                          />
                        </Grid>
                        <Grid item lg={3} sm={3} xs={12}>
                          <Controls.Input
                            name={`price_${itemIndex}`}
                            label="Preço"
                            money
                            length={16}
                            value={values[`price_${itemIndex}`]}
                            onChange={variationChange}
                            error={errors[`price_${itemIndex}`]}
                          />
                        </Grid>

                        <Grid item xs={12} >
                          <UploadFilesPreview
                            label='Arraste as imagens aqui!'
                            field='image'
                            files={
                              item.image
                            }
                            onFileChange={(images, field) => fileChange(images, field, itemIndex)}
                            sizeLimit={1024000000}
                          />
                        </Grid>


                      </Grid>


                    </Collapse>
                  </Grid>
                </Paper>
              </Grid>
            ))}

            <Grid item xs={12}>
              <ListItem
                button
                onClick={() => {

                  if (!values.variations) values.variations = [];
                  values.price = 'R$ 0';
                  values.stock = '0';
                  values.variations.push({ sku: '', open: true, price: '0', stock: '0', image: [], isNew: true });
                  setProductData({ ...values });
                }}
                style={{ paddingTop: 15, paddingBottom: 15 }}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Icon>add</Icon>
                  </Avatar>
                </ListItemAvatar>

                <ListItemText primary={<b>Adicionar Variação</b>} />

              </ListItem>
            </Grid>
          </Grid>
        </List>
      </Grid>

    </Grid>
  );
}
