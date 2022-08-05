import React from "react";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


function QueueTypeToolbar(props) {

  const [open, setOpen] = React.useState(false);

  let {onChange,queueType} = props;

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Select style={{width: 120, textAlign:'left'}}
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={queueType}
        onChange={handleChange}
      >
        <MenuItem value={'queue'}>Aguardando</MenuItem>
        <MenuItem value={'queueSuccess'}>Sucesso</MenuItem>
        <MenuItem value={'queueError'}>Erro</MenuItem>
      </Select>
    </React.Fragment>
  );

}

export default QueueTypeToolbar;
