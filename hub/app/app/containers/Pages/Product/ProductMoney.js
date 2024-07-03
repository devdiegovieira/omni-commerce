import { Accordion, AccordionSummary, Grid, Icon } from '@material-ui/core';
import React, { useState } from 'react';
import Controls from '../../../components/Forms/controls';


export function ProductMoney(props) {
  const { values, handleInputChange, errors } = props;


  return (
    <Grid container spacing={1} >
      <Grid item xl={6} md={6} xs={12} >
          <Controls.Input
            name="cest"
            label="cest"
            value={values.cest}
            length={7}
            onChange={handleInputChange}
            
            error={errors.cest}
          />
        </Grid>
        <Grid item xl={6} md={6} xs={12}>
          <Controls.Input
            name="ncm"
            label="ncm"
            value={values.ncm}
            length={8}
            onChange={handleInputChange}
            error={errors.ncm}
          />
        </Grid>
      </Grid>
  );
}
