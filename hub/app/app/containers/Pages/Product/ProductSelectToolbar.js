import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { promisseApi } from '../../../api/api';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  iconButton: {
  },
  iconContainer: {
    marginRight: '24px',
  },
  inverseIcon: {
    transform: 'rotate(90deg)',
  },
 }));

export default function ProductSelectToolbar(props) {
  const classes = useStyles();
 
  const { enqueueSnackbar } = useSnackbar();

  const { selectedRows } = props;

  const handlePublish = () => {

    let skuIds = selectedRows.map(m => m._id) 

    promisseApi(
      'post',
      '/publish/skutopublish',
      () => {},
      ()=>{},
      skuIds
    )
    enqueueSnackbar( 'Anúncio(s) Criado(s) com sucesso!', {variant: 'success' });
    
  }


  return (
    <>
    

      <div className={classes.iconContainer}>
        {/* <Tooltip title="Gerar Anúncio">
          <IconButton className={classes.iconButton} onClick={handlePublish}>
            <Icon className={classes.icon}>storefront</Icon>
          </IconButton>
        </Tooltip> */}
      </div>
    </>
  );
}

