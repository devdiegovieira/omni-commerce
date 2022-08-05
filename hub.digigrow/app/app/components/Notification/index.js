import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


function Notification(props) {
  let { message } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(message.message && message.message != '');
  }, [message]);

  function Alert(props) {
    return <MuiAlert elevation={12} variant="filled" {...props} />;
  }

  const handleMessageClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleMessageClose} >
      <Alert onClose={handleMessageClose} severity={message.type}>
        {message.message}
      </Alert>
    </Snackbar>
  );
}


export default Notification;
