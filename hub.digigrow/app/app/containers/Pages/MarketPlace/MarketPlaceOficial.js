import Icon from '@material-ui/core/Icon';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import MUIDataTable from 'digi-components/MUIDataTable/MUIDataTable';
import { api } from '../../../api/api';
import { dataGridTexts } from '../../../components/DataGrid/gridTexts';
import messages from './messages';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const useStyles = makeStyles((theme) => ({
  table: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: -10,
  }
}));

export default function MarketPlaceOficial(props) {
  const classes = useStyles();
  const { intl } = props;



  const { enqueueSnackbar } = useSnackbar();

  const [dataOficial, setDataOficial] = useState([]);
  const history = useHistory();

  const getGridData = () => {
    api.get(
      '/marketplace/list/oficial'
    ).then(
      data => {
        setDataOficial(data.data);
      }
    ).catch(
      (err)=> enqueueSnackbar(err, { variant: 'error' })
    );
  };

  const handleDetail = (value) => {
    if (value)
      history.push(`${location.pathname}/${value._id}`)
    else setOpen(true);
  };

  const columnsOficial = [
    {
      name: '_id',
      label: intl.formatMessage(messages.gridId),
      options: {
        filter: true,
        display: false,
      }
    },
    {
      name: 'name',
      label: intl.formatMessage(messages.gridName),
      options: {
        filter: true,
      }
    },
    {
      name: 'platformName',
      label: intl.formatMessage(messages.gridPlatformaName),
      options: {
        filter: true,
      }
    },
    {
      name: 'optionsButton',
      label: ' ',
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {

          return (
            <>
              <Tooltip title="Editar detalhes">
                <IconButton onClick={() => handleDetail(dataOficial[dataIndex])}>
                  <Icon style={{
                    opacity: 0.5,
                  }}>
                    edit
                  </Icon>
                </IconButton>
              </Tooltip>
            </>
          );
        }

      }
    },
  ];

  const optionsOficial = {
    filter: false,
    search: false,
    print: false,
    download: false,
    selectableRowsHideCheckboxes: true,
    viewColumns: false,
    pagination: false,
    responsive: 'simple',
    textLabels: dataGridTexts(intl)

  };

  const handleFilterOpen = (event, isOpen) => {
    if (isOpen) getGridData();
  };

  return (
    <Accordion onChange={handleFilterOpen}>
      <AccordionSummary
        expandIcon={<Icon color="primary">expand_more</Icon>}
        aria-controls="panel4bh-content"
        id="panel4bh-header"
      >

        <Typography variant="h6">
          <Icon
            color="primary"
            style={{
              position: 'relative', top: 4, marginRight: 10, marginLeft: 6
            }}
          >
            military_tech
          </Icon>
          Contas Oficiais
        </Typography>
      </AccordionSummary>

      <MUIDataTable
        className={classes.table}
        data={dataOficial}
        columns={columnsOficial}
        options={optionsOficial}
      />
    </Accordion>
  );
}
