import { Grid, Icon } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Controls from '../../../components/Forms/controls';


export function ProductSize(props) {
  const { values, handleInputChange, errors } = props;





  return (
    <>
      <Grid container spacing={1}>
        <Grid item lg={6} sm={6} xs={12} >
          <Controls.Input
            name="height"
            label="Altura (Cm) - Maxímo de 70cm"
            type='number'
            value={values.height}
            onChange={handleInputChange}
            error={errors.height}
          />
          <Controls.Input
            name="length"
            label="Comprimento (Cm) - Maxímo de 70cm"
            value={values.length}
            type='number'
            onChange={handleInputChange}
            error={errors.length}
          />
        </Grid>
        <Grid item lg={6} sm={6} xs={12} >
          <Controls.Input
            name="width"
            label="Largura (Cm) - Maxímo de 70cm"
            type='number'
            value={values.width}
            onChange={handleInputChange}
            error={errors.width}
          />
          <Controls.Input
            name="weight"
            type='number'
            min={0}
            max={30000}
            // maxWei
            label="Peso (Gramas) - Maxímo de 30Kg"
            value={values.weight}
            onChange={handleInputChange}
            error={errors.weight}
          />
        </Grid>

      </Grid>
    </>
  );
}
