import { Button, Grid, Icon, CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from 'react';
import { promisseApi } from "../../../api/api";
import { chunkArray } from "../../../utils/javaScript";
import { useSnackbar } from 'notistack';
import { createWorkSheet, writeXLSX } from '../../../utils/xlsx';
import { useHistory } from "react-router-dom";
import ButtonGroupComponent from "../../../components/ButtonGroup/ButtonGroup";
import ProductUpload from "./ProductUpload";
import ButtonDefault from "../../../components/Button/ButtonDefault";


function ProductActions(props) {
  const [isOpen, setIsOpen] = useState(false);
  const { rowsSelected, gridFilter, putStatus, handleRefreshClick } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  const handleDownloadClick = () => {
    setIsLoading(true);

    promisseApi(
      'get',
      '/sku/productReport',
      (data) => {
        setIsLoading(false);
        setReport(data);
      },
      (err) => {
        enqueueSnackbar(handleError(err), { variant: 'error' }) && setIsLoading(false)
      },

      {},
      { params: { ...gridFilter, limit: 5000 } }
    )
  }
  const [report, setReport] = useState();

  let buttonGroup = [
    {
      title: 'Atualizar',
      icon: 'refresh',
      tooltip: 'Atualizar página',
      disabled: rowsSelected.length,
      onClick: () => handleRefreshClick()
    },
    {
      title: 'Upload Planílha',
      icon: 'file_upload',
      tooltip: 'Criar ou Atualizar produtos massivamente',
      disabled: isLoading,
      onClick: () => { setIsOpen(true), getUploadStatus() }
    },
    {
      title: 'Baixar Relatório',
      icon: 'download',
      tooltip: 'Baixa lista de anúncios em XLSX',
      disabled: isLoading,
      onClick: () => { handleDownloadClick() }
    },
    {
      title: 'Gerar Anúncio',
      icon: 'list',
      tooltip: 'Baixa lista de anúncios em XLSX',
      disabled: !rowsSelected.length,
      onClick: () => {
        let skuIds = rowsSelected.map(m => m.sku)
        promisseApi(
          'post',
          '/publish/skutopublish',
          () => {

            enqueueSnackbar('Anúncio(s) Criado(s) com sucesso!', { variant: 'success' });
          },
          (err) => enqueueSnackbar(err, { variant: 'error' }),
          {
            skuIds
          }
        )
        window.location.href = '/publish?status=pending'
      }
    },
    {
      title: 'Desativar produtos',
      icon: 'toggle_off',
      tooltip: 'Inativa todos os produtos selecionados',
      disabled: !rowsSelected.length,
      onClick: () => putStatus(rowsSelected.map(m => m.sku), false)
    },
    {
      title: 'Ativar produtos',
      icon: 'toggle_on',
      tooltip: 'Ativa todos os produtos selecionados',
      disabled: !rowsSelected.length,
      onClick: () => putStatus(rowsSelected.map(m => m.sku), true),

    },


  ]

  useEffect(() => {

    if (report) {
      setIsLoading(true)
      let offset = report.offset + report.limit;

      promisseApi(
        'get',
        '/sku/productReport',
        (data) => {

          report.list.push(...data.list);
          report.offset = offset;

          if (data.list.length > 0)
            setReport({ ...report });
          else {
            let workSheets = [];

            let chunksProduct = chunkArray(report.list, 100000);

            for (let productList of chunksProduct) {
              let prodPlan = [];
              let varPlan = [];

              for (let product of productList) {
                if (Array.isArray(product.variations))
                  varPlan.push(...product.variations.map(m => {
                    return {
                      ...m,
                      productId: product.sku
                    }
                  }))

                delete product.variations;

                prodPlan.push(product);
              }

              let product = prodPlan.map(m => {

                return {

                  'Código Produto *': m.sku ? m.sku : '',
                  'Título *': m.title ? m.title : '',
                  'Empresa (CNPJ) *': m.sellerDocument ? m.sellerDocument : '',
                  'Preço **': m.price ? m.price : '',
                  'Estoque **': m.stock ? m.stock : '',
                  'isActive': m.isActive === true ? 'Ativo' : 'Inativo',
                  'Categoria *': m.categoryId ? m.categoryId : '',
                  'Atributos': m.attributes ? m.attributes : '',
                  'Imagens (Link público)': m.image ? m.image.join(',') : '',
                  'Descrição(Aceita quebra de Linha)': m.description ? m.description : '',
                  'CEST': m.CEST ? m.CEST : '',
                  'NCM': m.NCM ? m.NCM : '',
                  'Altura (cm)': m.height ? m.height : '',
                  'Largura (cm)': m.width ? m.width : '',
                  'Comprimento (cm)': m.length ? m.length : '',
                  'Peso (gramas)': m.weight ? m.weight : '',
                }

              });



              let variation = varPlan.map(m => {


                return {
                  'Código da Variação *': m.sku ? m.sku : '',
                  'Código do Produto *': m.productId ? m.productId : '',
                  'Preço *': m.price ? m.price : '',
                  'Estoque **': m.stock ? m.stock : '',
                  'Atributos *': m.attributes ? m.attributes.map(mm => `${mm['id']}: ${mm['value']}`).join(', ') : '',
                  'Imagens (Link publico)': m.image ? m.image.join(',') : '',
                }
              });

              let mergeSummary = [
                { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } },
                { s: { c: 1, r: 0 }, e: { c: 9, r: 0 } },
                { s: { c: 10, r: 0 }, e: { c: 11, r: 0 } },
                { s: { c: 12, r: 0 }, e: { c: 15, r: 0 } },
              ];
              let mergeSummaryVariation = [
                { s: { c: 0, r: 0 }, e: { c: 1, r: 0 } }
              ];


              let resultProduct = createWorkSheet(
                Array.isArray(product) ? product : [],
                `Produtos`,
                mergeSummary,
                [['ID', 'Detalhes', '', '', '', '', '', '', '', 'Dados Fiscais', '', 'Dimensões']]
              );

              let resultVariation = createWorkSheet(
                Array.isArray(productList) ? variation : [],
                `Variações`,
                mergeSummaryVariation,
                [['ID']]
              );

              let instructions = createWorkSheet(
                [],
                `Instruções`,
                null,
                [
                  ['Kit:, Somentes PRODUTOS SEM VARIAÇÃO ou VARIAÇÕES podem ser transformadas em KIT'],
                  ['* Campos Obrigatórios'],
                  ['** Campos obrigatórios em determinadas condições'],
                  ['PREÇO e ESTOQUE na aba de PRODUTO é obrigatório quando o Produto não possuir Variação (Produto Simples)'],
                  ['Imagens:'],
                  ['deverão ser preenchidos com link público (repositório http) separado por vírgula'],
                  ['as imagens serão copiadas para nosso storage não precisando serem mantidas no repositório original'],
                  ['links inválidos serão ignorados'],
                  ['caso não possua um repositório público de http as imagens podem ser enviadas diretamente pela tela de detalhe de produto'],
                  ['Atributos:'],
                  ['É necessário preencher pelo menos 1 atributo na variação para identificação por exemplo (Lado, Cor, Tamanho, etc)']
                ]
              );


              workSheets.push(instructions, resultProduct, resultVariation);

              writeXLSX('RelatorioProdutos.xlsx', workSheets);

              workSheets = [];

              setIsLoading(false);
            };
          }
        },
        (err) => enqueueSnackbar(handleError(err), { variant: 'error' } && setIsLoading(false)),
        {

        },
        { params: { ...gridFilter, limit: 5000, offset } }
      )
    }
  }, [report]);


  return (
    <Grid
      container
      justifyContent="flex-end"
      spacing={1}
      style={{paddingLeft: 10, paddingRight: 10}}
    >
      <ProductUpload isOpen={isOpen} setIsOpen={setIsOpen} />

      <Grid item>
        <ButtonDefault
          onClick={(e) => history.push(`${'product'}/${'new'}`)}
          icon={'add'}
          label={'Novo Produto'}
        />
      </Grid>

      <Grid item>
        <ButtonGroupComponent
          size='small'
          buttons={buttonGroup}
        />
      </Grid>

    </Grid>
  )

}

export default ProductActions;
