import { Icon, Typography } from "@material-ui/core"
import React from "react";


function PageTitle(props) {

  let { icon, label } = props;

  return (
    <Typography style={{ fontWeight: 600, marginBottom: 10, marginTop: 10, fontSize: 18, marginLeft: 15 }} >
      <Icon color="primary" style={{ paddingTop: 2, fontSize: 20, marginRight: 15 }} >{icon}</Icon>{label}
    </ Typography>

      )
}
      export default PageTitle