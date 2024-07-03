import React, { useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { Button } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { promisseApi } from '../../../api/api';
import Icon from "@material-ui/core/Icon";
import { handleError } from "../../../utils/error";
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    iconContainer: {
    marginRight: "24px",
  },
  toolbarButtons: {
    border:'2px solid white',
    width: '120px',
    fontSize: '10px',
    marginRight:'8px',
    transition:'1s',
    "&:hover": {
      backgroundColor: 'rgb(186,85,211)',
      color:'#000',
      borderColor:'#000'
    }
  },
  }));

export default function PublishSelectToolbar(props) {
  const classes = useStyles();

  let { selectedRows, getGridData } = props;
 

  let [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    setRows(selectedRows);
  }, [selectedRows]);



  const publishAction = (action) => {
    try {
      let actionMsg = '';
      switch (action) {
        case 'paused':
          actionMsg = 'Pausado'
          break;
        case 'active':
          actionMsg = 'Ativado'
          break;     
        case 'unlinked':
          actionMsg = 'Desvinculado'
          break;  
        default:
          actionMsg = 'Outro'
          break;
      }

      promisseApi(
        'put',
        `/publish/status/${action}`,
        ()=>{
          enqueueSnackbar(`Anuncio ${actionMsg} com sucesso `, {variant: 'success' });
          getGridData();
        },
        handleError,
        rows
      );
    }
    catch(err) {
     (err)=> enqueueSnackbar({message: err.message ? err.message : JSON.stringify(err), variant: 'error'})
    }
  }


  return (
    <>

      <div className={classes.iconContainer}>

        <Tooltip 
          title={'Ativar Anúncio'}
          arrow
        >
          <Button 
            variant="outlined"
            size="small"
            arrow
            startIcon={<Icon className={classes.toolbarIconsButtons}>play_arrow</Icon>}
            className={classes.toolbarButtons}
            onClick={() => publishAction('active')}
          >
            Ativar 
          </Button>
        </Tooltip>

        <Tooltip 
          title={'Pausar Anúncio'}
          arrow
        >
          <Button 
            startIcon={<Icon>pause</Icon>}
            size="small"
            variant="outlined"
            className={classes.toolbarButtons}
            onClick={() => publishAction('paused')}
          >
            Pausar  
          </Button>
        </Tooltip>
        
        <Tooltip 
          title={'Desvincular Anúncio'}
          arrow
        >
          <Button 
            variant="outlined"
            size="small"
            startIcon={<Icon>link_off</Icon>}
            className={classes.toolbarButtons}
            onClick={()=>publishAction('unlinked')}
          >
            Desvincular 
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
