import { CircularProgress, Grid } from "@material-ui/core";
import { promisseApi } from "../../../api/api";
import React, { useEffect, useState } from 'react';
import ButtonGroupComponent from "../../../components/ButtonGroup/ButtonGroup";
import { useSnackbar } from 'notistack';
import { DispatchPickingLabel } from "./DispatchPickingLabel";
import { handleError } from "../../../utils/error";
import { DispatchReport } from "./DispatchReport";

function LogisticaActions(props) {

  let { orders = [], handleRefreshClick, gridFilter, setGridFilter } = props;

  const { enqueueSnackbar } = useSnackbar();
  const [index, setIndex] = useState(0);
  const [pickListData, setPickListData] = useState([]);
  const [pickReport, setPickReport] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const DispactchList = () => {
    setisLoading(true);
    promisseApi(
      'post',
      '/order/documentshipping',
      (data) => {
        setPickReport(data);
        handleRefreshClick();
        setisLoading(false);
        setGridFilter(gridFilter);
      },
      (err) => { setisLoading(false); enqueueSnackbar(handleError(err), { variant: 'error' }) },
      orders.map(m => m.orderId),


    );

  }

  const pickingLabel = () => {
    setisLoading(true);
    promisseApi(
      'post',
      `/order/pickiglist`,
      (data) => {
        setPickListData(data);
        handleRefreshClick();
        setGridFilter(gridFilter);
        setisLoading(false);
      },
      (err) => {
        setisLoading(false);
        enqueueSnackbar(err, { variant: 'error' })
      },
      orders.map(m => m.orderId),
      { params: { printedLabel: true } }
    );

  }

  useEffect(() => {

    if (pickListData.length > 0) {
      DispatchPickingLabel(pickListData)
    }
  }, [pickListData])

  useEffect(() => {
    if (pickReport.length > 0) {
      DispatchReport(pickReport);

    }
  }, [pickReport])


  let buttonGroup = [
    {
      title: 'Despachar Pedido',
      icon: 'local_shipping',
      tooltip: 'Despachar Pedido',
      onClick: () => DispactchList('print'),
      disabled: isLoading || orders.length == 0,

    },
    {
      title: 'Imprimir Selecionado',
      icon: 'print',
      tooltip: 'Imprime Etiquetas selecionada',
      onClick: () => pickingLabel('print'),
      disabled: isLoading || orders.length == 0
    },
  ]

  return (
    <>

      <Grid
        container
        justifyContent="flex-end"
        spacing={2}
      >
        <Grid item xs={6} md={'auto'} lg={'auto'}>
          {isLoading && <CircularProgress size={24} style={{
            position: 'absolute',
            marginLeft: 10,
            zIndex: 1,
          }} />}
          <ButtonGroupComponent
            buttons={buttonGroup}
          />
        </Grid>
      </Grid>
    </>
  )

}

export default LogisticaActions;
