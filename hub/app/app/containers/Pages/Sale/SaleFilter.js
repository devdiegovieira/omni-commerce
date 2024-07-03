import { makeStyles } from "@material-ui/core/styles";
import { Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, InputAdornment, Modal, Paper } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useForm, Form } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import { promisseApi } from "../../../api/api";
import { useSnackbar } from "notistack";
import ButtonDefault from "../../../components/Button/ButtonDefault";
import { addDays } from "date-fns";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Button from "../../../components/Forms/controls/Button";
import { Calendar } from "@material-ui/pickers";
import PeriodPicker from "../../../components/Forms/controls/PeriodPicker";
import DateRangeIcon from '@material-ui/icons/DateRange';

const useStyles = makeStyles((theme) => ({
  grid: {
    padding: 5,
  }
}));

export default function SaleFilter(props) {
  const classes = useStyles();

  let {
    filter,
    setFilter,
    isLoading,
    clearIsLoading,
    setClearIsLoading,
    setIsLoading,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [sellerData, setSellerData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: filter.dateFrom || new Date(),
      endDate: filter.dateTo || new Date(),
      key: "selection",
    },
  ]);


  const dateSubmit = () => {
    let filterDate = { ...date }
    values.dateFrom = filterDate[0].startDate;
    values.dateTo = filterDate[0].endDate;
  };

  let paths = location.pathname.split("/");
  const [med, setMed] = useState(
    paths.length > 2 && paths[2] ? paths[2] : undefined
  );

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths != med) setMed(paths);
  console.log(med);

  const ops = () => {
    setOpen(!open);
  };

  const submit = () => {
    let filterDate = { ...date }
    values.dateClosedFrom = filterDate[0].startDate;
    values.dateClosedTo = filterDate[0].endDate;
    setFilter({ ...values });
    setIsLoading(true);
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit,
    resetForm,
  } = useForm(filter, true, submit, []);

  const getFilterOptions = () => {
    promisseApi(
      "get",
      "/selectList/sellerid",
      (data) => setSellerData(data),
      (err) => enqueueSnackbar(err, { variant: "error" })
    );

    promisseApi(
      "get",
      "/selectlist/orderstatus",
      (data) => setStatusData(data),
      (err) => enqueueSnackbar(err, { variant: "error" })
    );

    // promisseApi(
    //   'get',
    //   'selectlist/paymentstatus',
    //   data => {
    //     setPaymentStatusData(data.data);
    //   },
    //   (err) => enqueueSnackbar(err, { variant: 'error' })

    // )
  };

  const handleResetFilter = () => {
    setFilter({
      limit: 25,
      offset: 0,
    });
    setClearIsLoading(true);
    resetForm();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container style={{ padding: 16 }}>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input

                label="Período:"
                name="dateFrom"
                startIcon={'calendar_month'}
                value={`Período de ${(values.dateFrom ? values.dateFrom : new Date()).toLocaleDateString("pt-BR", { timeZone: 'UTC' })
                  } até ${(values.dateTo ? values.dateTo : new Date()).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}
                onChange={() => setDialogOpen(true)}
                onClick={() => setDialogOpen(true)}
                error={errors.dateFrom}
                InputProps={{
                  endAdornment: (<InputAdornment position="end">
                    <IconButton>
                      {<DateRangeIcon />}
                    </IconButton>
                  </InputAdornment>
                  )
                }}
              />
            </Grid>


            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input
                label="Venda"
                name="orderId"
                value={values.orderId}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                error={errors.orderId}
              />
            </Grid>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input
                label="SKU"
                name="sku"
                value={values.sku}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                error={errors.sku}
              />
            </Grid>
            <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
              <Controls.Input
                label="Doc. Comprador"
                name="buyerDocument"
                value={values.buyerDocument}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                error={errors.buyerDocument}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Grid + filtros */}

        <Grid item xs={12}>
          <Collapse in={open}>
            <Grid container spacing={1}>


              <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
                <Controls.Input
                  label="Nome Comprador"
                  name="buyerName"
                  value={values.buyerName}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  error={errors.buyerName}
                />
              </Grid>

              <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
                <Controls.MultiSelect
                  name="sellerId"
                  label="Empresa"
                  value={values.sellerId}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  options={sellerData}
                  error={errors.sellerId}
                />
              </Grid>

              <Grid item style={{ marginTop: -5 }} sm={6} lg={3} xs={12}>
                <Controls.MultiSelect
                  name="status"
                  label="Status"
                  value={values.status}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  options={statusData}
                  error={errors.status}
                />
              </Grid>
              {med === "mediation" && (
                <Grid item sm={6} lg={3} xs={12}>
                  <Controls.Select
                    name="medStatus"
                    label="Status da Mediação"
                    value={values.medStatus}
                    onChange={(e) => {
                      handleInputChange(e);
                    }}
                    options={[
                      { id: "open", title: "Aberta" },
                      { id: "closed", title: "Fechada" },
                    ]}
                  />
                </Grid>
              )}
            </Grid>
          </Collapse>
        </Grid>

        {/* Botão de Pesquisar && mais filtros...*/}

        <Grid item xs={12} lg={12} style={{ marginTop: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={4} md={"auto"} lg={"auto"}>
              <ButtonDefault
                icon={"filter_list"}
                isLoading={isLoading}
                disabled={isLoading}
                label={"Filtrar"}
                type="submit"
              />
            </Grid>
            <Grid item xs={4} md={"auto"} lg={"auto"}>
              <ButtonDefault
                onClick={() => {
                  handleResetFilter();
                }}
                isLoading={clearIsLoading}
                disabled={clearIsLoading}
                label={"Limpar Filtros"}
                icon={"clear"}
              />
            </Grid>
            <Grid item xs={4} md={"auto"} lg={"auto"}>
              <ButtonDefault
                onClick={() => {
                  ops();
                }}
                icon={open ? "remove" : "add"}
                label={open ? "Menos filtros ... " : " Mais filtros ..."}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>


      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}

      >
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh', padding: 5 }}
        >
          <Paper style={{ borderRadius: 0, backgroundColor: 'white' }}>
            <Grid item xs={12}>
              <PeriodPicker
                editableDateInputs={true}
                onChange={item => {
                  setDate([item.selection])
                  { e => setLocale(e.target.value) }
                }}
                moveRangeOnFirstSelection={false}
                ranges={date}

              />
            </Grid>
            <Grid item xs={12}>
              <Grid container >
                <Grid item xs={6}>
                  <ButtonDefault
                    onClick={() => { setDialogOpen(false); dateSubmit() }}
                    color="primary"
                    label="Selecionar"
                    icon='done'

                  />
                </Grid>
                <Grid item xs={6}>
                  <ButtonDefault
                    onClick={() => setDialogOpen(false)}
                    color="primary"
                    label="Cancelar"
                    icon='close'
                  />
                </Grid>
              </Grid>
            </Grid>

          </Paper>
        </Grid>

      </Modal>
    </Form>
  );
}
