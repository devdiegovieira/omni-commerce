
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Divider, Grid } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Badge from '@material-ui/core/Badge';
import { useForm, Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import { promisseApi } from '../../../api/api';
import _ from "lodash";
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: 5,
  }
}));

export default function SellerFilter(props) {
  const classes = useStyles();

  const {
    filter, setFilter, filterSubmit, user
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [platformData, setPlatformData] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [paymentStatusData, setPaymentStatusData] = useState([]);
  const [marketPlaceData, setMarketPlaceData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [open, setOpen] = useState(false);

  const ops = () => {
    setOpen(!open)
  }

  const submit = () => {
    filterSubmit(values)
  };

  useEffect(() => { submit(); getFilterOptions(); }, []);

  //----
  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useForm(filter, true, submit, []);


  const getFilterOptions = () => {

    promisseApi(
      'get',
      '/selectList/sellerid',
      (data) => setSellerData(data)
    );
  };

  const handleFilterOpen = (event, isOpen) => {
    if (isOpen) getFilterOptions();
  };

  const handleResetFilter = () => {
    setFilter({
      limit: 25,
      offset: 0,
      dateClosedFrom: new Date(),
      dateClosedTo: new Date()
    });

    resetForm();
  };

  return (
    <Form onSubmit={handleSubmit}>

      <Grid container style={{ padding: 10 }}  >
        <Grid item xs={12}>
          <Grid container spacing={1}>

            <Grid item sm={4} lg={3} xs={12}>
              <Controls.Input
                label="Nome Fantasia"
                name="code"
                value={values.code}
                onChange={e => {
                  handleInputChange(e)

                }}
                error={errors.code}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item sm={4} lg={3} xs={12}>
              <Controls.Input
                name="document"
                label="CNPJ"
                value={values.document}
                mask="99.999.999.9999-99"
                onChange={e => {
                  handleInputChange(e)
                }}
                error={errors.document}
              />
            </Grid>

            <Grid item sm={4} lg={3} xs={12}>
              <Controls.Select
                name="status"
                label="Status"
                value={values.status}
                onChange={e => {
                  handleInputChange(e)
                  handleChange(e)
                }}
                options={[
                  { title: "Em análise", id: 'pending' },
                  { title: "Concluídos", id: 'concluded' },
                ]}
                error={errors.status}
              />
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid item >
              <ButtonDefault
                icon={'filter_list'}
                disabled={''}
                label={'Filtrar'}
                type='submit'
              />
            </Grid>

            <Grid item >
              <ButtonDefault
                onClick={() => {
                  handleResetFilter()
                }}
                label={'Limpar Filtros'}
                icon={'clear'}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Form >
  );
}
