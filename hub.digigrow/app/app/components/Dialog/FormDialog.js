import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Form } from './../../components/Forms/useForm';


export default function FormDialog(props) {

  let {isOpen, setIsOpen, title, description, handleSubmit, children} = props;
    
  return (
    <Dialog open={isOpen} onClose={() => { setIsOpen(false) }} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title" style={{marginBottom:0}}>
        {title}
      </DialogTitle>

      <Form onSubmit={handleSubmit}>
        <DialogContent>
          {
            description && (
              <DialogContentText>
                {description}
              </DialogContentText>
            )
          }
            {children}      
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => { setIsOpen(false) }} color="primary">
            Cancelar
          </Button>
          <Button 
            type="submit"
            color="primary"
          >
            Enviar
          </Button>
        </DialogActions>
      </Form> 
    </Dialog>
  );
}