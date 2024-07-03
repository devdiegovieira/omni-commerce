import { Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import Controls from '../../../components/Forms/controls';


export function ProductHeader(props) {
  const { values, handleInputChange, sellerSelectList, category, errors } = props;

  return (
    <Grid container>

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item lg={6} sm={6} xs={12}>
            <Grid container>
              <Grid item lg={12} sm={12} xs={12} >
                <Controls.Input
                  name="sku"
                  autoFocus
                  label="Código"
                  disabled={values._id}
                  value={values.sku}
                  length={20}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
                    handleInputChange(e)
                  }}
                  error={errors.sku}
                />
              </Grid>

              <Grid item lg={12} sm={12} xs={12} >

                <Controls.Input
                  name="title"
                  label="Título"
                  value={values.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  inputProps={{ maxLength: 60 }}
                />
              </Grid>


              <Grid item lg={12} sm={12} xs={12} >
                <Controls.Select
                  label="Empresa"
                  name="sellerId"
                  disabled={values._id}
                  onChange={handleInputChange}
                  options={sellerSelectList}
                  value={values.sellerId}
                  error={errors.sellerId}
                />
              </Grid>

              <Grid item lg={12} sm={12} xs={12} >
                <Controls.AutoComplete
                  name="categoryId"
                  label="Categoria"
                  value={values.categoryId}
                  onChange={handleInputChange}
                  onInputChange={handleInputChange}
                  options={category}
                  error={errors.categoryId}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>


            </Grid>
          </Grid>

          <Grid item lg={6} sm={6} xs={12}>
            <Grid container>

              <Grid item lg={12} sm={12} xs={12}>

                <Controls.Input
                  rows={10}
                  name="description"
                  label="Descrição"
                  value={values.description}
                  onChange={handleInputChange}
                  multiline
                  error={errors.description}
                  style={{ marginTop: 2 }}

                />
              </Grid>


            </Grid>
          </Grid>


        </Grid>
      </Grid>

    </Grid>
  );
}
