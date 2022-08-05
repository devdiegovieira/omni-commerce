import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { injectIntl, intlShape } from "react-intl";
import {
  Button,
  Chip,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@material-ui/core";
import MUIDataTable from "digi-components/MUIDataTable/MUIDataTable";
import brand from "digi-api/dummy/brand";
import { dataGridTexts } from "digi-components/DataGrid/gridTexts";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import SellerSelectToolbar from "./SellerSelectToolbar";
import SellerDetail from "./SellerDetail";
import { promisseApi } from "../../../api/api";
import { handleError } from "../../../utils/error";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import { TabPanel } from "../Sale/SaleSettingsPage";
import SellerInfo from "./SellerInfo";
import SellerTax from "./SellerTax";
import SellerAccount from "./SellerAccount";
import { Form, useForm } from "../../../components/Forms/useForm";
import Controls from "../../../components/Forms/controls";
import StoreIcon from "@material-ui/icons/Store";
import GoBackHeader from "../../../components/GoBackHeader";
import PageTitle from "../../../components/Header/PageTitle";
import { Alert, AlertTitle } from "@material-ui/lab";
import SellerFilter from "./SellerFilter";
import ButtonDefault from "../../../components/Button/ButtonDefault";
import { arrayOf } from "prop-types";

function SellerPage(props) {
  const title = `Empresa - ${brand.name}`;
  const description = brand.desc;
  const { intl } = props;
  const [gridData, setGridData] = useState([]);
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [seller, setSeller] = useState({});
  const [fieldMessages, setFieldMessages] = useState([]);
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);

  const [isNew, setIsNew] = useState(false);

  const [gridFilter, setGridFilter] = useState({
    limit: 25,
    offset: 0,
    total: 0,
  });

  useEffect(() => {
    promisseApi(
      "get",
      "/user/superuser",
      (data) => setUser(data),
      (err) => enqueueSnackbar(handleError(err), { variant: "error" })
    );

    getGridData(gridFilter);
  }, [gridFilter]);

  let paths = location.pathname.split("/");
  const [sellerId, setSellerId] = useState(
    paths.length > 2 && paths[2] ? paths[2] : undefined
  );

  paths = paths.length > 2 && paths[2] ? paths[2] : undefined;
  if (paths != sellerId) setSellerId(paths);

  const handleClickOpen = (sellerId, e) => {
    history.push(`${location.pathname}/${sellerId ? sellerId : "new"}`);
    setSellerId(sellerId);
  };

  const handleClose = (success = false) => {
    if (typeof success === "boolean" && success) {
      enqueueSnackbar("Registro salvo com sucesso!", { variant: "success" });
      getGridData();
    }
  };

  const fileChange = (images, field) => {
    values[field] = images;
    setSeller({ ...values })
  }

  const handleAddClick = () => {
    handleClickOpen();
  };

  const handleRefreshClick = () => {
    getGridData();
  };

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
    },
  }));

  const classes = useStyles();
  const [value, setValue] = useState(0);

  const filterSubmit = (filter) => {
    setGridFilter(filter);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getFormData = () => {
    if (sellerId && sellerId.toLocaleLowerCase() != "new") {
      try {
        promisseApi(
          "get",
          `/seller/${sellerId}`,
          (data) => {
            setSeller(data);
            setIsNew(false);
          },
          (err) => enqueueSnackbar(handleError(err), { variant: "error" }),
          {}
        );
      } catch (error) {
        console.log(error);
      }
    } else setIsNew(true);
  };

  useEffect(() => {
    if (sellerId) getFormData();
    else {
      setIsNew(true);
      setSeller({});
    }
  }, [sellerId]);

  const putSellerFiles = (images, sellerId, path) => {
    let newImages = images.filter(f => f.new).map(m => m.file);


    if (newImages.length > 0) {
      let form = new FormData();

      for (let image of newImages) {
        form.append("image", image, image.name);
      }

      promisseApi(
        "put",
        `/seller/${path}/${sellerId}`,
        (data) => {

          getGridData();
        },
        (err) => enqueueSnackbar(handleError(err), { variant: "error" }),
        form,
        {
          headers: {
            "content-type": "multipart/form-data"
          },
        }
      );
    }

  };

  const submit = () => {
    try {

      promisseApi(
        isNew ? "post" : "put",
        isNew ? "/seller/" : `/seller/${sellerId}`,
        (data) => {
          localStorage.setItem("hasSellers", false);
          setButtonSaveLoading(false);
          getGridData();
          if (data != "") {
            history.replace(`/seller/${data}`);
            localStorage.setItem("hasSellers", true);
            putSellerFiles(values.images, data, 'pic');
            putSellerFiles(values.imagesCs, data, 'picCs');
          } else {
            localStorage.setItem("hasSellers", true);
            setIsLoading(false);
            putSellerFiles(values.images, sellerId, 'pic');
            putSellerFiles(values.imagesCs, sellerId, 'picCs');
            enqueueSnackbar("Registro atualizado com sucesso!", {
              variant: "success",
            });
            getGridData();
          }
        },
        (err) => {
          setIsLoading(false);
          enqueueSnackbar(handleError(err), { variant: "error" });
        },
        {
          ...values,
          images: values.images.filter(f => !f.new && !f.deleted).map(m=>m.url),
          imagesCs: values.imagesCs.filter(f => !f.new && !f.deleted).map(m=>m.url),
          imageDeleted: values.images.filter(f => !f.new && f.deleted).map(m=>m.url),
          imageDeletedCs: values.imagesCs.filter(f => !f.new && f.deleted).map(m=>m.url)
        }
      );
    } catch (error) {
      console.log(error);
    }
  };



  const getConsultarCep = (cep) => {
    if (cep) {
      promisseApi(
        "get",
        `/correio/consulta/${cep}`,
        (data) => {
          setSeller(
            data.map((m) => {
              return {
                ...values,
                address: m.end,
                neighborhood: m.bairro,
                cep: m.cep,
                city: m.cidade,
                state: m.uf,
              };
            })[0]
          );
        },
        (err) => enqueueSnackbar(handleError(err), { variant: "error" }),
        {}
      );
    }
  };

  const [gridState, setGridState] = useState({
    page: 0,
    total: 0,
    totalStatus: [],
  });

  const { values, errors, handleInputChange, handleSubmit, validate } = useForm(
    seller,
    true,
    submit,
    []
  );

  useEffect(() => {
    let { fields } = validate(values, requiredFields);
    setFieldMessages(
      Object.keys(fields)
        .map((m) => fields[m])
        .filter((f) => f != "")
    );
  }, [values]);

  const requiredFields = [
    {
      field: "code",
      message: `O Campo Nome Fantasia é Obrigatório`,
    },
    {
      field: "phone",
      message: `O Campo Telefone é Obrigatório`,
    },
    {
      field: "cpf",
      message: `O Campo CPF é Obrigatório`,
    },
    {
      field: "rg",
      message: `O Campo RG é Obrigatório`,
    },
    {
      field: "name",
      message: "O Campo Razão social é Obrigatório",
    },
    {
      field: "ie",
      message: "O Campo Inscrição Estadual é Obrigatório",
    },
    {
      field: "taxRegime",
      message: "O Campo Regime Tributário é Obrigatório",
    },
    {
      field: "document",
      message: "O Campo CNPJ é Obrigatório",
    },
    {
      field: "userName",
      message: "O Campo Nome é Obrigatório",
    },
    {
      field: "address",
      message: `O Campo Endereço é Obrigatório`,
    },
    {
      field: "number",
      message: `O Campo Número é Obrigatório`,
    },
    {
      field: "city",
      message: `O Campo Cidade é Obrigatório`,
    },
    {
      field: "neighborhood",
      message: `O Campo Bairro é Obrigatório`,
    },
    {
      field: "state",
      message: `O Campo UF é Obrigatório`,
    },
    {
      field: "images",
      message: `É obrigatório anexar Documento de Identidade com foto do Responsável pelo CNPJ`,
      rule: (value, field) => {
        return !value[field] || (value[field] && value.images.filter(f=> !f.deleted).length == 0);
      },
    },
    {
      field: "imagesCs",
      message: `É obrigatório anexar Contrato Social`,
      rule: (value, field) => {
        return !value[field] || (value[field] && value.imagesCs.filter(f=> !f.deleted).length == 0);
      },
    },
  ];

  const getGridData = () => {
    setIsLoading(true);
    promisseApi(
      "get",
      "/seller",
      (data) => {
        setGridData(
          data.map((m) => {
            return {
              ...m,
              userNames: m.users.map((mm) => (mm ? mm.userName : {})),
              updatedAt: new Date(m.updatedAt).toLocaleString(),
            };
          })
        );
        setIsLoading(false);
      },
      (err) => enqueueSnackbar(handleError(err), { variant: "error" }),
      setIsLoading(false),
      {
        params: {
          ...gridFilter,
        },
      }
    );
  };

  useEffect(() => {
    getGridData();
  }, [setGridData]);

  const columns = [
    {
      name: "_id",
      label: "Id",
      options: {
        filter: true,
        display: false,
      },
    },
    {
      name: "code",
      label: "Nome fantasia",
      options: {
        filter: true,
      },
    },
    {
      name: "name",
      label: "Razão social",
      options: {
        filter: true,
      },
    },
    {
      name: "document",
      label: "CNPJ",
      options: {
        filter: true,
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex];

          return (
            <>
              <Chip
                icon={
                  <Icon
                    style={{
                      fontSize: 15,
                      color: value.status == "pending" ? "blue" : "green",
                    }}
                  >
                    lens
                  </Icon>
                }
                label={value.status === "pending" ? "Em análise" : "Concluído"}
              />
            </>
          );
        },
      },
    },
    {
      name: "createdAt",
      label: "Criado",
      options: {
        filter: true,
        display: false,
      },
    },
    {
      name: "createdUser",
      label: "Criado Por",
      options: {
        filter: true,
        display: false,
      },
    },
    {
      name: "updatedAt",
      label: "Atualizado",
      options: {
        filter: true,
        display: false,
      },
    },
    {
      name: "updatedUser",
      label: "Atualizado Por",
      options: {
        filter: true,
        display: false,
      },
    },
    {
      name: "userNames",
      label: "Usuários",
      options: {
        filter: true,
        filterType: "multiselect",
        customBodyRenderLite: (dataIndex) => {
          const value = gridData[dataIndex].users;

          return (
            <>
              <AvatarGroup spacing="small" max={5}>
                {value.map((val, key) => (
                  <Tooltip title={val && val.userName}>
                    <Avatar src={val && val.userImage}>
                      {val && val.userName && val.userName.charAt(0)}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </>
          );
        },
      },
    },
    {
      name: "optionsButton",
      label: " ",
      options: {
        display: true,
        sort: false,
        customBodyRenderLite: (dataIndex) => {
          return (
            <>
              <Grid container justifyContent="flex-end">
                <Tooltip title="Editar detalhes">
                  <ButtonDefault
                    onClick={() => {
                      handleClickOpen(gridData[dataIndex]._id);
                      setValue(0);
                    }}
                    icon={"edit"}
                    label={"Detalhes"}
                  />
                </Tooltip>
              </Grid>
            </>
          );
        },
      },
    },
  ];

  const options = {
    serverSide: true,
    rowsPerPage: gridFilter.limit,
    page: gridState.page,
    rowsPerPageOptions: [25, 50, 100],
    count: gridState.total,
    filter: false,
    search: false,
    print: false,
    download: false,
    sort: false,
    textLabels: dataGridTexts(intl),
    jumpToPage: true,
    viewColumns: false,
    selectableRows: false,
    setTableProps: () => ({
      size: "small",
    }),

    customToolbar: () => (
      <>
        <Grid
          container
          spacing={2}
          justifyContent="flex-end"
          style={{ paddingLeft: 10, paddingRight: 10 }}
        >
          <Grid item>
            <ButtonDefault
              onClick={() => {
                handleAddClick();
              }}
              icon={"add"}
              disabled={""}
              label={"Adicionar"}
            />
          </Grid>

          <Grid item>
            <ButtonDefault
              onClick={() => {
                handleRefreshClick();
              }}
              icon={"refresh"}
              disabled={""}
              label={"Atualizar"}
            />
          </Grid>
        </Grid>
      </>
    ),
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
      let selected = [];
      for (let row of selectedRows.data) {
        selected.push(gridData[row.dataIndex]);
      }

      return (
        <SellerSelectToolbar sellerIds={selected} getGridData={getGridData} />
      );
    },
  };

  const setConfirmSeller = () => {
    promisseApi(
      "put",
      "/seller/confirmseller",
      (data) => {
        getFormData();
        enqueueSnackbar("Cadastro concluído com sucesso", {
          variant: "success",
        });
      },
      {},
      { sellerId: sellerId }
    );
  };

  return (
    <div>
      {sellerId && (
        <>
          <GoBackHeader to={"/seller"} label={"Empresas"} />

          <Paper>
            <Form onSubmit={handleSubmit}>
              <Grid container style={{ padding: 15 }}>
                <Grid item lg={8} xs={9}>
                  <Grid container spacing={1}>
                    <Grid item style={{ paddingRight: 7 }}>
                      <Avatar>
                        {sellerId != "new" && <StoreIcon />}
                        {sellerId == "new" && <Icon>add_business</Icon>}
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontWeight: 600, paddingTop: 7 }}>
                        {seller.name}
                        {sellerId != "new" && (
                          <Chip
                            icon={
                              <Icon
                                style={{
                                  color:
                                    seller.status == "pending"
                                      ? "blue"
                                      : "green",
                                }}
                              >
                                lens
                              </Icon>
                            }
                            label={
                              seller.status === "pending"
                                ? "Em análise"
                                : "Concluído"
                            }
                          />
                        )}
                      </Typography>
                    </Grid>

                    <Grid item>
                      <Controls.Switch
                        name="syncStock"
                        sizeSmal
                        label="Controle de Estoque "
                        value={values.syncStock}
                        error={errors.syncStock}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item lg={4} xs={3}>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      {user && (
                        <ButtonDefault
                          label={"Concluir"}
                          icon={"check"}
                          onClick={() => {
                            setConfirmSeller();
                          }}
                        />
                      )}
                    </Grid>

                    <Grid item>
                      <ButtonDefault
                        type="submit"
                        icon={"save"}
                        disabled={fieldMessages.length}
                        label={"Salvar"}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={12}>
                {fieldMessages.length > 0 && (
                  <Alert severity="error">
                    <AlertTitle style={{ fontSize: 17 }}>
                      Campos obrigatórios *
                    </AlertTitle>

                    <Grid container>
                      {fieldMessages.map((m) => (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          lg={4}
                          xl={3}
                          style={{ paddingTop: 10 }}
                        >
                          <p style={{ marginBottom: 0 }}>- {m}</p>
                        </Grid>
                      ))}
                    </Grid>
                  </Alert>
                )}
              </Grid>

              <Tabs
                orientation={"horizontal"}
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Menu Configurações"
                lassName={classes.tabs}
              >
                <Tab label="Geral" {...a11yProps(0)} />
                <Tab label="Tributário" {...a11yProps(1)} />
                <Tab disabled label="Bancário" {...a11yProps(2)} />
                {sellerId != "new" && (
                  <Tab label="Usuários" {...a11yProps(3)} />
                )}
              </Tabs>

              <TabPanel value={value} index={0}>
                <SellerInfo
                  sellerId={sellerId}
                  getConsultarCep={getConsultarCep}
                  values={values}
                  errors={errors}
                  setButtonSaveLoading={setButtonSaveLoading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  seller={seller}
                  onFileChange={fileChange}
                />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <SellerTax
                  sellerId={sellerId}
                  values={values}
                  errors={errors}
                  setButtonSaveLoading={setButtonSaveLoading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </TabPanel>

              <TabPanel value={value} index={2}>
                <SellerAccount
                  sellerId={sellerId}
                  values={values}
                  errors={errors}
                  setButtonSaveLoading={setButtonSaveLoading}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </TabPanel>
              {sellerId != "new" && (
                <TabPanel value={value} index={3}>
                  <SellerDetail
                    handleClose={handleClose}
                    sellerId={sellerId}
                    seller={seller}
                    intl={intl}
                    handleRefreshClick={handleRefreshClick}
                    errors={errors}
                    getGridData={getGridData}
                  />
                </TabPanel>
              )}
            </Form>
          </Paper>
        </>
      )}

      {!sellerId && (
        <>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
          </Helmet>
          <PageTitle icon={"add_business"} label={"Empresas"} />
          <Paper>
            <SellerFilter
              filter={gridFilter}
              setFilter={setGridFilter}
              filterSubmit={filterSubmit}
              user={user}
            />
            <MUIDataTable data={gridData} columns={columns} options={options} />
          </Paper>
        </>
      )}
    </div>
  );
}

SellerPage.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(SellerPage);
