import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl, intlShape } from 'react-intl';
import { Chip, Divider, Grid, Switch } from '@material-ui/core';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import brand from 'digi-api/dummy/brand';
import { promisseApi } from '../../../api/api';
import { capitalizeFirst } from '../../../utils/dynamicMasks';
import { dataGridTexts } from 'digi-components/DataGrid/gridTexts';
import DispatchFilter from './DispatchFilter';
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import { SaleLabel } from '../Sale/SaleLabel';
import DispatchActions from './DispatchActions';

function DispatchPage(props) {
  const { intl } = props;
  const title = `Empresa - ${brand.name}`;
  const description = brand.desc;
  const [gridData, setGridData] = useState([]);
  const [rowsSelected, setRowsSelected] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [orderLabel, setOrderLabel] = useState();
  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    totalStatus: []
  });
  const [gridFilter, setGridFilter] = useState({
    limit: 5,
    offset: 0,
    total: 0,
    dateClosedFrom: new Date(),
    dateClosedTo: new Date()
  })

  const filterSubmit = (filter) => {
    setGridFilter(filter)
  };

  const handleRefreshClick = () => {
    getGridData(gridFilter);
  };

  const getGridData = () => {


    let dateClosedFrom;

    if (gridFilter.dateClosedFrom) {
      dateClosedFrom = new Date(gridFilter.dateClosedFrom);
      dateClosedFrom.setHours(0, 0, 0, 0);
    }
    let dateClosedTo;
    if (gridFilter.dateClosedTo) {
      dateClosedTo = new Date(gridFilter.dateClosedTo);
      dateClosedTo.setHours(23, 59, 59, 999);
    }
    setGridData([]);
    promisseApi(
      'get',
      '/order/list/expedition',
      data => {
        setGridState({ ...gridState, total: data.total, })
        setGridData(data.orderMap.map(m => {
          return {
            ...m,
            dateClosed: new Date(m.dateClosed).toLocaleString(),
            name: capitalizeFirst(m.name)
          }
        }));

      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {},
      {
        params: {
          ...gridFilter,
          status: 'invoiced',
          dateClosedFrom,
          dateClosedTo
        }
      }
    )
  };


  const handleGridState = (action, tableState) => {
    if (action == 'changePage' || action == 'changeRowsPerPage') {
      setGridState({ ...gridState, page: tableState.page });
      setGridFilter({ ...gridFilter, offset: gridFilter.limit * tableState.page, limit: tableState.rowsPerPage })
    };


    if (action == 'rowSelectionChange') {

      let selected = [];
      for (let row of tableState.selectedRows.data) {
        let data = gridData[row.dataIndex];
        if (data) {
          selected.push({
            orderId: data.orderId
          })

        }
      }

      setRowsSelected(selected);

    }
  };



  useEffect(() => {
    getGridData(gridFilter);
  }, [gridFilter]);

  const columns = [
    {
      name: '_id',
      label: 'Id',
      options: {
        display: false,
        sort: false,
        filter: false
      }
    },
    {
      name: 'orderId',
      label: 'Venda',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = gridData[dataIndex];
          return (
            <>
              <b style={{ fontSize: 12, position: 'relative' }}>{data.orderId}</b>
              <br />
            </>
          );
        }
      }
    },
    {
      name: 'name',
      label: 'Nome',
      options: {
        sort: false,

      }
    },
    {
      name: 'dateClosed',
      label: 'Data da Venda',
      options: {
        sort: false,

      }
    },
    {

      name: '',
      options: {
        customBodyRenderLite: (dataIndex) => {
          const data = gridData[dataIndex];

          return (
            <>
              <Grid container justifyContent='flex-end'>
                <ButtonDefault disabled={!data.label} icon={'receipt'} label={gridData[dataIndex].printedLabel == true ? 'Reimprimir Etiqueta' : 'Imprimir Etiqueta'} onClick={() => setOrderLabel({ ...data })} />

              </Grid>
            </>
          );
        }
      }
    },
    {
      name: 'printed',
      label: 'Impresso',
      options: {
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          const data = gridData[dataIndex];

          return (
            <Switch
              name="printed"
              color="primary"
              checked={data.printedLabel ? true : false}
            />
          );
        }
      }
    },

  ];

  const options = {
    filterType: 'multiselect',
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    page: gridState.page,
    rowsPerPageOptions: [5, 20, 30, 60],
    count: gridState.total,
    filter: false,
    search: false,
    print: false,
    download: false,
    sort: false,
    jumpToPage: true,
    viewColumns: false,
    selectableRows: true,
    setTableProps: () => ({
      size: 'small'
    }),
    textLabels: dataGridTexts(intl),
    responsive: 'simple',
    selectToolbarPlacement: 'none',
    textLabels: {
      body: {
        noMatch: "Nenhum pedido disponivel",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`
      },
    },
    customToolbar: () => {
      return (
        <Grid container justifyContent='flex-end' spacing={2} >
          <Grid item xs={6} md={'auto'} lg={'auto'}>
            <ButtonDefault
              onClick={() => { handleRefreshClick() }
              }
              icon={'refresh'}
              label={'Atualizar'}
            />
          </Grid>
          <Grid item xs={6} md={'auto'} lg={'auto'} >
            <DispatchActions
              orders={rowsSelected}
              gridFilter={gridFilter}
              setGridFilter={setGridFilter}
              handleRefreshClick={handleRefreshClick}
              executeAfterAction={getGridData}
            />
          </Grid>
        </Grid >
      );
    },
    onTableChange: handleGridState,

  };

  return (
    <div>

      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <Grid container spacing={2}>
        <>

          <Grid item xs={12}>
            <DispatchFilter
              filter={gridFilter}
              setFilter={setGridFilter}
              handleRefreshClick={handleRefreshClick}
              filterSubmit={filterSubmit}
            />
          </Grid>

          <Grid item xs={12} style={{ position: 'relative', zIndex: '1' }}>

            <MUIDataTable
              title={''}
              data={gridData}
              columns={columns}
              options={options}
            />
          </Grid>

        </>
        <Divider style={{ zIndex: 2 }} />
        <SaleLabel orderId={orderLabel} />
      </Grid>

    </div >
  );
}

DispatchPage.propTypes = {
  intl: intlShape.isRequired
};

export default injectIntl(DispatchPage);
