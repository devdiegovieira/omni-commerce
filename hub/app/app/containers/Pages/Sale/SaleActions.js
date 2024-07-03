import { Button, Grid, Icon } from "@material-ui/core";
import React, { useState, } from 'react';
import { promisseApi, } from '../../../api/api';
import { SaleLabel } from "./SaleLabel";
import { SaleXml } from "./SaleXml";
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import { handleError } from "../../../utils/error";
import { useSnackbar } from 'notistack';
import ButtonGroupComponent from "../../../components/ButtonGroup/ButtonGroup";

function SaleActions(props) {

  const { enqueueSnackbar } = useSnackbar();

  const { orderDetail, setSaleData } = props;

  const [orderLabel, setOrderLabel] = useState();
  const [orderXML, setOrderXML] = useState();

  let statusOrder = (status) => {



    promisseApi(
      'put',
      '/order/status',
      (data) => {
        enqueueSnackbar('Status alterado com sucesso!', { variant: 'success' });
        location.reload(true)
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      [{
        orderId: orderDetail.externalId,
        status: status
      }]
    );

  }

  let buttonGroup = [
    {
      title: 'Cancelar',
      icon: 'close',
      tooltip: 'Cancelar pedido',

      onClick: () => statusOrder('cancelled')
    },
    {
      title: 'Concluir',
      icon: 'check',
      tooltip: 'Concluir pedido',
      disabled: orderDetail.shipping && orderDetail.shipping.mode == 'me2',
      onClick: () => statusOrder('delivered')
    },

  ];



  return (
    <>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Button
            title='Etiqueta'
            style={{ fontSize: 10 }}
            tooltip='Remove campanha de desconto da plataforma'
            disabled={!orderDetail.label}
            onClick={() => setOrderLabel({ ...orderDetail })}
          >
            <Icon>receipt</Icon>Etiqueta
          </Button>
        </Grid>
        <Grid item>
          <Button
            title='XML'
            style={{ fontSize: 10, marginRight: 5 }}
            icon='format_align_center'
            tooltip='Consultar XML'
            disabled={!orderDetail.status == 'cancelled' || !orderDetail.invoice}
            onClick={() => { setOrderXML({ ...orderDetail }) }}>
            <Icon>format_align_center</Icon>XML
          </Button>
        </Grid>
        <Grid item style={{ fontSize: 10, marginRight: 5, paddingTop: 5 }} >
          <ButtonGroupComponent
            size='small'
            buttons={buttonGroup}
          />
        </Grid>
      </Grid>
      {/* <AlertDialog
        isOpen={showDeleteAlert}
        title={dlgMessage.title}
        description={dlgMessage.description}
        handleClose={statusOrder}
      /> */}
      <SaleLabel orderId={orderLabel} />
      <SaleXml orderId={orderXML} />
    </>
  )
}

export default SaleActions;
