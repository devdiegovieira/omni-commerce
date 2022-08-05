import { Button, Icon, Tooltip } from "@material-ui/core";
import React from "react";
import { useHistory } from 'react-router-dom';

export default function GoBackHeader(props) {

  let { label = 'Voltar', to } = props;
  const history = useHistory()


  return (
    <>
      <Tooltip
        title={label}
        arrow
      >
        <Button 
          style={{ marginBottom: 5, marginTop: 5 }} 
          onClick={() => { 
            if (!to) 
              history.goBack()
            else 
              history.push(to)
          }}
        >
          <Icon style={{ marginRight: 5 }}>keyboard_backspace</Icon>
          {label}
        </Button>
      </Tooltip>

    </>
  )
}

