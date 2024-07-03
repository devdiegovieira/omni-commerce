import { PaperBlock } from 'digi-components';
import React, { useEffect, useState } from 'react';
import { Grid, Button, List, ListItem, Chip, Switch, IconButton, Icon, Tooltip, Divider } from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import MarketPlacePriceRuleDetail from './MarketPlacePriceRuleDetail';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

export default function MarketPlacePriceRule(props) {
  let { marketPlace } = props;

  const [priceRuleList, setPriceRuleList] = useState([]);
  const [priceRuleId, setPriceRuleId] = useState({});
  const { enqueueSnackbar } = useSnackbar();


  const [deleteOpen, setDeleteOpen] = useState(false);
  const [priceRuleIdDelete, setPriceRuleIdDelete] = useState(false);


  const handleDelete = (confirm) => {

    if (confirm) {
      promisseApi(
        'delete',
        '/pricerule',
        (data) => {
          enqueueSnackbar('Registro(s) deletado(s) com sucesso!', { variant: 'success' });
          getDetailData();
        },
        (err) => {
          enqueueSnackbar(handleError(err), { variant: 'error' }) 
        },
        {},
        { params: { priceruleid: priceRuleIdDelete } }
      )

    }
    setDeleteOpen(false);

  }


  const getDetailData = () => {
    if (marketPlace._id)
      promisseApi(
        'get',
        `/marketplace/${marketPlace._id}/pricerules`,
        (data) => setPriceRuleList(data.map(m => {
          let operation;

          if (m.operation == '*' || m.operation == '/') {
            operation = (1 - m.value).toLocaleString('pt-BR', { style: 'percent', minimumFractionDigits: 0 });
          } else { operation = `${m.operation} ${m.value.toLocaleString('pt-BR')}`; }

          return {
            ...m,
            operation
          };
        })),
        (err) => {
          enqueueSnackbar(handleError(err), { variant: 'error' })
        }
      )
  }

  useEffect(() => {
    if (marketPlace) {
      getDetailData();
    }

  }, [marketPlace])


  return (
    <PaperBlock
      title="Regras de Preço"
      icon="price_change"
      desc="Regras de preço para integração"

    >
      <Grid container justifyContent='flex-end'>
        <Button
          onClick={() => {
            setPriceRuleId({
              isOpen: true,
              platformId: marketPlace.platformId,
              marketPlaceId: marketPlace._id,
              sellerId: marketPlace.sellerId
            })
          }
          }
          startIcon={<Icon>add</Icon>}
        >
          Adicionar Regra de Preço
        </Button>
      </Grid>

      {Array.isArray(priceRuleList) && priceRuleList.length > 0 && (
        <List>
          <Divider />
          {priceRuleList.map(m => {
            const diff = Math.round((new Date(m.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <>
                <ListItem>
                  <Grid container>

                    <Grid item xs={9}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          {m.title}
                        </Grid>
                        <Grid item xs={12}>

                          <IconButton
                            size="small"
                          >
                            <Icon
                              fontSize="small"
                              style={{
                                color: m.value >= 1 ? 'lime' : 'red'
                              }}
                            >
                              {m.value >= 1 ? 'arrow_upward' : 'arrow_downward'}
                            </Icon>
                          </IconButton>
                          {m.operation}



                          <Tooltip title={diff > 0 ? 'Ativo' : 'Inativo'}>
                            <Chip
                              label={diff > 0 ? `${diff} dias` : `${diff * - 1} dias`}
                              style={{
                                color: diff > 0 ? 'lime' : 'red',
                                border: `1px solid ${diff > 0 ? 'lime' : 'red'} `,
                                backgroundColor: 'transparent !important',
                                marginLeft: 10,
                                marginRight: 10,
                              }}
                              variant="outlined"
                            />
                          </Tooltip>

                          {m.publishFilters.map(m => {
                            let filterTitle;
                            switch (m.field) {
                              case 'listingType':
                                filterTitle = 'Destaque';
                                break;
                              case 'shipMode':
                                filterTitle = 'Tipo de Envio';
                                break;
                              case 'condition':
                                filterTitle = 'Condição'
                                break;
                              case 'oficialStore':
                                filterTitle = 'Loja Oficial'
                                break;
                              default:
                                filterTitle = 'Nenhum'
                            }

                            return (
                              <Tooltip title={filterTitle}>
                                <Chip
                                  style={{}}
                                  label={`${filterTitle}: ${Array.isArray(m.values) && m.values.map(m => {
                                    let value;
                                    switch (m) {
                                      case 'gold_pro':
                                        value = 'Premium';
                                        break;
                                      case 'gold_special':
                                        value = 'Clássico';
                                        break;
                                      case 'me1':
                                        value = 'Mercado Envio 1';
                                        break;
                                      case 'me2':
                                        value = 'Mercado Envio 2';
                                        break;
                                      case 'new':
                                        value = 'Novo';
                                        break;
                                      case 'used':
                                        value = 'Usado';
                                        break;
                                      case 'oficialStore':
                                        value = 'Loja Oficial';
                                        break;
                                      default:
                                        value = 'Nenhum'

                                    }
                                    return value;
                                  }).join(', ')
                                    }`}
                                  style2={{
                                    backgroundColor: 'transparent !important',
                                    margin: 5
                                  }}
                                  variant="outlined"
                                />
                              </Tooltip>
                            );
                          })}


                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={3} style={{ marginTop: 10 }}>
                      <Grid container justifyContent='flex-end'>
                        <div style={{ marginTop: 4 }}>
                          <Switch
                            disabled
                            label=""
                            name="active"
                            checked={m.active}
                          />

                        </div>
                        <IconButton onClick={() => {
                          setPriceRuleId({ isOpen: true, id: m._id })
                        }} >
                          <Icon>edit</Icon>
                        </IconButton>
                        <IconButton onClick={() => {
                          setDeleteOpen(true);
                          setPriceRuleIdDelete(m._id);
                        }} >
                          <Icon>delete</Icon>
                        </IconButton>
                      </Grid>

                    </Grid>

                  </Grid>
                </ListItem>
                <Divider />


              </>
            )
          })}

        </List>

      )}

      <MarketPlacePriceRuleDetail priceRuleId={priceRuleId} afterClose={getDetailData} />

      <AlertDialog
        isOpen={deleteOpen}
        title="Deletar Registro(s)"
        description="Deseja mesmo deletar o(s) registro(s) selecionado(s)?"
        handleClose={handleDelete}
      />

    </PaperBlock>
  )

}