import { AppBar, Dialog, Button, Grid, Icon, IconButton, Toolbar, Typography, useMediaQuery, useTheme, DialogContent, CircularProgress, Slide, LinearProgress, Divider, List, ListItem } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { promisseApi } from "../../../api/api";
import CloseIcon from '@material-ui/icons/Close';
import UploadFilesPreview from "../../../components/Image/UploadFilesPreview";
import { parseXls, readXLSX } from "../../../utils/xlsx";
import { chunkArray } from "../../../utils/javaScript";
import CardStats from "../../../components/Cards/Card";
import { useSnackbar } from 'notistack';
import Pagination from '@material-ui/lab/Pagination';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

let activeTimer = true;

function ProductUpload(props) {
  let { isOpen, setIsOpen } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [file, setFile] = useState();
  const [buttonSaveLoading, setButtonSaveLoading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState({});
  const [uploadCards, setUploadCards] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [errorState, setErrorState] = useState({
    offset: 0,
    limit: 100
  })


  useEffect(() => {
    activeTimer = isOpen;
    if (isOpen) {
      getUploadCards();

      promisseApi(
        'get',
        '/sku/uploadErrorList',
        data => {
          setUploadErrors(data)
        },
        (err) => { enqueueSnackbar(err, { variant: 'error' }) },
        {},
        {
          params: errorState
        }
      )
    }

  }, [errorState, isOpen])

  const deleteQueueError = () => {
    promisseApi(
      'Delete',
      '/queue/deleteQueueError',
      () => {
        enqueueSnackbar('Log Deletado com sucesso!', { variant: 'success' })
        setErrorState({ ...errorState })
      },
      (err) => { enqueueSnackbar(err, { variant: 'error' }) }
    )
  };


  const getUploadCards = () => {
    promisseApi(
      'get',
      '/sku/uploadCards',
      data => {
        setUploadCards(data)
      },
      (err) => { enqueueSnackbar(err, { variant: 'error' }) }
    );
  }

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeTimer)
        getUploadCards()
    }, 10000);

    return () => {
      clearInterval(interval)
    }
  }, [])

  const sendFile = () => {

    setButtonSaveLoading(true)

    const fileReader = new FileReader();
    fileReader.onload = (e) => {

      let sheets = readXLSX(e.target.result, [1, 2]);

      let products = [];

      sheets.map((sheet, sheetIndex) => {

        let values = parseXls(
          sheet.splice(2),
          sheetIndex == 0 ?
            ['sku', 'title', 'sellerDocument', 'price', 'stock', 'isActive', 'categoryId', 'attributesPath', 'image', 'description', 'cest', 'ncm', 'height', 'width', 'length', 'weight'] :
            ['sku', 'productId', 'price', 'stock', 'attributesPath', 'image']
        );


        //produto
        if (sheetIndex == 0) {
          products.push(...values)
        }
        //variação
        else {
          values.map(value => {
            let product = products.find(f => f.sku == value.productId);
            if (product) {
              if (!product.variations) product.variations = [];

              product.variations.push(value);
            }
          })
        }
      })


      let productPack = chunkArray(products, 100);

      productPack.map((pack, packIndex, packList) => {


        setTimeout(() => {
          promisseApi(
            'post',
            '/sku/productMany',
            () => {

              if (packIndex == packList.length - 1) {
                enqueueSnackbar('Arquivo enviado com sucesso!', { variant: 'success' });
                setButtonSaveLoading(false);
                setFile();
                getUploadStatus();
              }
            },
            (err) => {
              enqueueSnackbar(err, { variant: 'error' });
              if (packIndex == packList.length - 1) {
                setButtonSaveLoading(false);
                setFile();
              }
            },
            pack
          )
        }, 10 * packIndex);
      }


      )

    }

    try {
      fileReader.readAsArrayBuffer(file[0].file);
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' })
      setButtonSaveLoading(false);
    }

  }

  const errorChangePage = (a, b) => {
    setErrorState({ ...errorState, offset: (b - 1) * errorState.limit })
  }

  return (
    <Dialog
      fullScreen={fullScreen}

      open={isOpen}
      onClose={() => { setIsOpen(false); setFile() }}
      TransitionComponent={Transition}
      fullWidth
    >
      <AppBar style={{ position: 'relative', padding: "0!important" }}>
        <Toolbar>
          <Grid container justifyContent="space-between">
            <Grid item xs={1} >
              <IconButton
                onClick={() => setIsOpen(false)}
                aria-label="Sair"
                color="inherit"

              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11} >
              <Grid container justifyContent="center">
                <Typography style={{ marginLeft: '0%' }} variant="h6" >
                  Criação/Alteração de Produtos em Massa
                </Typography>
              </Grid>

            </Grid>

          </Grid>
        </Toolbar>
      </AppBar>

      <DialogContent style={{ padding: 8 }}>

        <Grid container >


          <Grid item xl={4} lg={4} md={4} sm={12} xs={12} >
            <Grid container justifyContent="center" style={{ marginTop: 30 }}>
              <Button
                href={"/templates/subidaProduto.xlsx"}
                download={"subidaProduto.xlsx"}
                style={{ textTransform: 'none' }}

              >
                <div>
                  <Icon fontSize={'large'} style={{ marginLeft: 27, overflow: "hidden" }}>cloud_download</Icon>
                  <p>Baixar Exemplo</p>
                </div>

              </Button>
            </Grid>
          </Grid >

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12} >
            <UploadFilesPreview
              accept={['.xlsx']}
              singleFile
              onFileChange={setFile}
              field
              label={'Selecionar Planilha'} 
            />
          </Grid >

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12} >
            <Grid container justifyContent="center" style={{ marginTop: 30 }}>
              <Button
                disabled={file == undefined || buttonSaveLoading}
                onClick={sendFile}
                style={{ textTransform: 'none' }}
              >
                <div>
                  <Icon fontSize={'large'} style={{ overflow: "hidden" }}>cloud_upload</Icon>
                  <p>Enviar Planilha</p>
                </div>
                {buttonSaveLoading && <CircularProgress style={{
                  position: 'absolute',
                  zIndex: 1
                }} />}
              </Button>
            </Grid>
          </Grid >


          {(uploadCards.error > 0 || uploadCards.pending > 0) && (
            <>
              <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <CardStats
                      subtitle="Produtos Pendentes"
                      title={uploadCards.pending}
                      icon="pending_actions"
                      color={'purple'}
                      footer={(<></>)}
                    />

                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>

                    <CardStats
                      subtitle="Erros"
                      title={uploadCards.error}
                      icon="warning"
                      color={'red'}
                      footer={(<></>)}
                    />
                  </Grid>

                  {uploadCards.pending > 0 && (
                    <Grid item xs={12}>
                      <div style={{ flexGrow: 1 }}>
                        <LinearProgress color="secondary" />
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12}>


                  </Grid>
                </Grid>
              </Grid>


              {uploadErrors.list && uploadErrors.list.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <List style={{
                      height: 170,
                      overflow: 'auto',
                    }}>
                      {
                        uploadErrors.list.map(m => (
                          <ListItem>
                            <Grid container>
                              <Grid item lg={3} sm={12} xs={12}>
                                {m.sku}
                              </Grid>

                              <Grid item lg={9} sm={12} xs={12}>
                                {m.error}
                              </Grid>

                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                            </Grid>
                          </ListItem>
                        ))
                      }
                    </List>
                  </Grid>
                  <Grid item xs={12} >
                    <Grid container style={{ marginTop: 10 }}>
                      <Grid item xs={8}>
                        <Pagination
                          count={Math.round(uploadErrors.total / errorState.limit)}
                          page={(errorState.offset / errorState.limit) + 1}
                          onChange={errorChangePage}
                          size="small"
                        // showFirstButton 
                        // showLastButton 
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <Grid container justifyContent="flex-end">
                          <Button
                            style={{}}
                            elevation={2}
                            variant="contained"
                            color="primary"
                            name=""
                            onClick={() => { deleteQueueError() }}
                          >
                            Limpar erros
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </>

          )}

        </Grid>

      </DialogContent>
    </Dialog >

  )

}

export default ProductUpload;
