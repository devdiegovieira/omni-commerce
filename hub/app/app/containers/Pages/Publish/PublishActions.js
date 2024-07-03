import {  Grid, Tooltip } from "@material-ui/core";
import { promisseApi } from "../../../api/api";
import React, { useEffect, useState } from 'react';
import { useForm } from "../../../components/Forms/useForm";
import FormDialog from '../../../components/Dialog/FormDialog';
import ButtonGroupComponent from "../../../components/ButtonGroup/ButtonGroup";
import { useSnackbar } from 'notistack';
import Controls from "../../../components/Forms/controls";
import ButtonDefault from "../../../components/Button/ButtonDefault";


function PublishActions(props) {

  let { publishies, executeAfterAction, detailActions, edited = false, handleDownloadClick, handleRefreshClick, requiredFields, isDownloading, valuesDetail } = props;

  const [addPublishOpen, setAddPublishOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

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
        () => {
          enqueueSnackbar(`Anuncio ${actionMsg} com sucesso `, { variant: 'success' });
          executeAfterAction();
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        publishies
      );
    }
    catch (err) {
      (err) => enqueueSnackbar({ message: err.message ? err.message : JSON.stringify(err), variant: 'error' })
    }
  }

  const [publishNew] = useState({});
  const [seller, setSeller] = useState([]);


  const [syncExecuting, setSyncExecuting] = useState(false);

  useEffect(() => {
    promisseApi('get',
      '/selectlist/sellerid',
      setSeller,
      (err) => enqueueSnackbar(err, { variant: 'error' }));
  }, [])

  const syncPublish = (body) => {
    setSyncExecuting(true);
    promisseApi(
      'post',
      '/publish/sync',
      (data) => {
        setSyncExecuting(false);
        setAddPublishOpen(false);
        enqueueSnackbar('Anúncio sincronizado com sucesso', { variant: 'success' });
        executeAfterAction();
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      body
    );
  }

  const sendPublish = () => {

    promisseApi(
      'post',
      '/publish/sendPublish',
      (data) => {
        if (Array.isArray(data) && data.length == 1)
          window.location.href = `/publish/${data[0].publishIdNew}`;

        executeAfterAction();
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      publishies.map(m => m.publishId)
    )

  }

  const handleSync = () => {
    let body = publishies.map(m => {
      return {
        publishId: m.publishId,
        sellerId: m.sellerId,

      }
    });
    syncPublish(body)
  }

  const submit = () => {

    let body = values.mlb.split(',').map(m => {
      return {
        publishId: m,
        sellerId: values.sellerId
      }
    })

    syncPublish(body);

  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(publishNew, true, submit, [
    {
      field: 'mlb',
      message: 'O Campo Mlb é obrigatório'
    },
    {
      field: 'sellerId',
      message: 'O Campo Empresa não pode estar vazio'
    }
  ]);



  let buttonGroup = [
    {
      title: 'Atualizar',
      icon: 'refresh',
      tooltip: 'Atualizar página',
      disabled: publishies.length < 0,
      onClick: handleRefreshClick
    },
    {
      title: 'Publicar',
      icon: 'file_upload',
      tooltip: 'Publica anúncio pentendete',
      disabled: !Array.isArray(publishies) || publishies.length == 0 || publishies.find(m => m.status != 'pending' || m.complete == undefined) || edited,
      onClick: sendPublish
    },
    {
      title: 'Vincular',
      icon: 'link',
      tooltip: 'Vincula um anúncio criado diretamente no Mercado Livre',
      disabled: publishies.length,
      onClick: () => { setAddPublishOpen(false); setAddPublishOpen(true); }
    },
    {
      title: 'Desvincular',
      icon: 'link_off',
      tooltip: 'Desvincula anúncio publicado, o anúncio não será alterado na plataforma, apenas será removido no Hub',
      disabled: !publishies.length,

      onClick: () => publishAction('unlinked')
    },
    {
      title: 'Sincronizar',
      icon: 'sync',
      tooltip: 'Busca informações do anúncio publicado e salva no Hub',
      onClick: handleSync,
      disabled: !publishies.length
    },
    {
      title: 'Ativar',
      icon: 'play_arrow',
      tooltip: 'Ativa anúncio publicado',
      disabled: !publishies.length,
      onClick: () => publishAction('active')
    },
    {
      title: 'Pausar',
      icon: 'pause',
      tooltip: 'Pausa anúncio publicado',
      disabled: !publishies.length,
      onClick: () => publishAction('paused')
    },
    {
      title: 'Rem. Campanha',
      icon: 'remove_circle_outline',
      tooltip: 'Remove campanha de desconto da plataforma',
      disabled: !publishies.length,
      onClick: () => addPublishOpen(true)
    }
  ];

  return (
    <>
      <FormDialog
        isOpen={addPublishOpen}
        setIsOpen={setAddPublishOpen}
        title="Vincular Anúncios"
        description="Adicione os dados do Anúncio"
        handleSubmit={handleSubmit}
      >
        <Controls.Select
          label="Empresas"
          name="sellerId"
          value={values.sellerId}
          onChange={handleInputChange}
          options={seller}
          error={errors.sellerId}
        />
        <Controls.Input
          autoFocus
          label="MLB"
          name="mlb"
          value={values.mlb}
          onChange={handleInputChange}
          error={errors.mlb}
        />
      </FormDialog>

      <Grid
        container
        justifyContent="flex-end"
        spacing={1}
      >

        {!detailActions && (
          <Grid item>
            <ButtonDefault
              onClick={handleDownloadClick}
              disabled={publishies.length || isDownloading}
              icon={'download'}
              label={'Planilha'}
            />
          </Grid>
        )}

       
        {detailActions && (
          <Grid item>
            <ButtonDefault
              icon={'save'}
              disabled={Array.isArray(requiredFields) && requiredFields.filter(objFilter => valuesDetail[objFilter.field]).length !== requiredFields.length}
              type="submit"
              label={'Salvar'}  
            />
          </Grid>
        )}

        <Grid item>
          <ButtonGroupComponent
            size='small'
            buttons={buttonGroup}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default PublishActions;


