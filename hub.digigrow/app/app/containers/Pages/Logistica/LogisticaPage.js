import SeparacaoPage from "./SeparacaoPage";
import React from "react";
import { Divider, Grid, Typography } from "@material-ui/core";
import DispatchPage from "./DispatchPage";


export default function LogisticaPage(props) {


  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography align="center" style={{ marginTop: 5, backgroundColor: '#58F808' }}>Separação/Faturamento</Typography>
        <SeparacaoPage />
      </Grid>
      <Grid item>
        <Divider />
      </Grid >
      <Grid item xs={12}>
        <Typography align="center" style={{ backgroundColor: '#58F808' }}>  Embalagem/Expedição</Typography>
        <DispatchPage />
      </Grid>
    </Grid>

  )
}