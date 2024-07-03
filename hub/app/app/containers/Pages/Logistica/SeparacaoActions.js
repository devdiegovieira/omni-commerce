import { CircularProgress, Grid } from "@material-ui/core";
import { promisseApi } from "../../../api/api";
import React, { useEffect, useState } from 'react';
import ButtonGroupComponent from "../../../components/ButtonGroup/ButtonGroup";
import { SeparacaoPickList } from "./SeparacaoPickList";
import { useSnackbar } from 'notistack';

function SeparacaoActions(props) {

  let { orders = [], handleRefreshClick, gridFilter, setGridFilter } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [pickListData, setPickListData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const pickingList = () => {
    setisLoading(true);
    promisseApi(
      'post',
      '/order/pickiglist',
      (data) => {
        setPickListData(data);
        setisLoading(false);
        handleRefreshClick();
        setGridFilter(gridFilter)
      },
      (err) => { setisLoading(false); enqueueSnackbar(err, { variant: 'error' }) },
      orders.map(m => m.orderId),
      { params: { printed: true } }
    );

  }



  useEffect(() => {
    if (pickListData.length > 0) {
      SeparacaoPickList(pickListData);

    }
  }, [pickListData])


  let buttonGroup = [
    {
      title: 'Imprimir Selecionado',
      icon: 'print',
      tooltip: 'Imprime os pedidos selecionado',
      onClick: () => pickingList('print'),
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

export default SeparacaoActions;
