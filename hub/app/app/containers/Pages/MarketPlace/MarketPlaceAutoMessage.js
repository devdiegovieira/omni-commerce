import { PaperBlock } from 'digi-components';
import React, { useEffect, useState } from 'react';
import { Grid, Button, List, ListItem, Chip, Switch, IconButton, Icon, Tooltip, Divider } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import MarketPlaceAutoMessageDetail from './MarketPlaceAutoMessageDetail';
import { useSnackbar } from 'notistack';

export default function MarketPlaceAutoMessage(props) {
  let { marketPlace } = props;

  const [autoMessageList, setAutoMessageList] = useState([]);
  const [autoMessageId, setAutoMessageId] = useState({});
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [autoMessageDelete, setAutoMessageDelete] = useState(false);
  const { enqueueSnackbar } = useSnackbar();


  const handleDelete = (confirm) => {

    if (confirm) {
      promisseApi(
        'delete',
        `/marketPlace/comments/${autoMessageDelete}`,
        (data) => {
          enqueueSnackbar('Registro(s) deletado(s) com sucesso!', {variant: 'success' });
          getDetailData();

        },
        (err) => { enqueueSnackbar(handleError(err), { variant: 'error' }) },
        {}
      )

    }
    setDeleteOpen(false);

  }

  const getDetailData = () => {

    if (marketPlace && marketPlace._id) {
      promisseApi(
        'get',
        `/marketplace/comments`,
        (data) => {
          setAutoMessageList(data.sort((x, y) => {
            if (x.status < y.status) { return -1; }
            if (x.status > y.status) { return 1; }
            return 0;
          }))
        },
        (err)=> enqueueSnackbar(err, { variant: 'error' }),
        {},
        {
          params: {
            marketPlaceId: marketPlace._id,
            sellerId: marketPlace.sellerId,
            platformId: marketPlace.platformId,
          }
        },

      )
    }

  }

  useEffect(() => {
    getDetailData();
  }, [marketPlace]);




  return (
    <PaperBlock
      title="Mensagens"
      icon="message"        >
      <Grid container justifyContent='flex-end'>

        <Button
          onClick={() => {
            setAutoMessageId({
              isOpen: true,
              id: {
                platformId: marketPlace.platformId,
                marketPlaceId: marketPlace._id,
                sellerId: marketPlace.sellerId
              }
            })
          }
          }
          startIcon={<Icon>add</Icon>}
        >
          Nova Mensagem
        </Button>
      </Grid>

      {Array.isArray(autoMessageList) && autoMessageList.length > 0 && (
        <List>
          <Divider />
          {autoMessageList.map(m => {

            return (
              <>
                <ListItem>
                  <Grid container>
                    <Grid item xs={9}>
                      {m.message}
                    </Grid>


                    <Grid item xs={3} >
                      <Grid container justifyContent='flex-end'>

                        <Chip
                          style={{marginTop: 8, width: 100}}
                          label={m.status}
                          variant="outlined"
                        />
                        <div style={{ marginTop: 4 }}>
                          <Switch
                            name="Mensagens Automáticas"
                            label=""
                            color="primary"
                            disabled={true}
                            checked={m.active == true}
                          />


                        </div>

                        <IconButton onClick={() => {
                          setAutoMessageId({ isOpen: true, id: m })
                        }} >
                          <Icon>edit</Icon>
                        </IconButton>

                        <IconButton onClick={() => {
                          setDeleteOpen(true);
                          setAutoMessageDelete(m._id);
                        }} >
                          <Icon>delete</Icon>
                        </IconButton>

                      </Grid>

                    </Grid>

                  </Grid>
                </ListItem>
                <Divider />
              </>
            )
          })}

        </List>

      )}

      <MarketPlaceAutoMessageDetail
        autoMessageId={autoMessageId}
        afterClose={getDetailData}
      />

      <AlertDialog
        isOpen={deleteOpen}
        title="Deletar Registro(s)"
        description="Deseja mesmo deletar o(s) registro(s) selecionado(s)?"
        handleClose={handleDelete}
      />

    </PaperBlock>
  )

}