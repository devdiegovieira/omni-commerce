import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  icon: {
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

function AddButtonToolbar(props) {
  const classes = useStyles();  
  let { handleClick, icon, title, disabled } = props;
  
  return (
    <React.Fragment>
      <Tooltip title={title}>
        <IconButton onClick={handleClick} className={classes.icon} disabled={disabled || false}>
          <Icon>{icon}</Icon>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  );

}

export default AddButtonToolbar;
