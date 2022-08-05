
import { Button, CircularProgress, Icon } from "@material-ui/core";
import React from "react";

const ButtonDefault = (props) => {
  let {
    onClick,
    icon,
    disabled,
    label,
    onChange,
    isLoading,
    ...others
  } = props;
  return (
    <Button
      onClick={onClick}
      onChange={onChange}
      size={"small"}
      style={{ borderRadius: 3, padding: 4, paddingLeft: 10, paddingRight: 10, textTransform: 'none' }}
      startIcon={<Icon>{icon}</Icon>}
      // color={color}
      fullWidth
      disabled={disabled}
      {...others}
    >
      {label}
      {isLoading && <CircularProgress size={24} style={{
        position: 'absolute',
        zIndex: 1,
      }} />}
    </Button>
  )

}

export default ButtonDefault;