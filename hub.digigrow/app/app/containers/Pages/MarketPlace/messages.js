/*
 * Blank Page Messages
 *
 * This contains all the text for the Blank Page.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.MarketPlace';




export default defineMessages({
  title: {
    id: `${scope}.title`,
    defaultMessage: 'Contas',
  },
  paperTitle: {
    id: `${scope}.paper.title`,
    defaultMessage: 'Contas',
  },
  paperSubtitle: {
    id: `${scope}.paper.subtitle`,
    defaultMessage: 'Gerencie o cadastro das suas empresas',
  },
  content: {
    id: `${scope}.paper.content`,
    defaultMessage: 'Content',
  },
  gridId: {
    id: `${scope}.grid.id`,
    defaultMessage: 'Id Markeplace',
  },
  gridName: {
    id: `${scope}.grid.name`,
    defaultMessage: 'Nome',
  },
  gridSellerId: {
    id: `${scope}.grid.sellerId`,
    defaultMessage: 'Id Empresa',
  },
  gridSellerName: {
    id: `${scope}.grid.sellerName`,
    defaultMessage: 'Empresa',
  },
  gridPlatformId: {
    id: `${scope}.grid.platformaId`,
    defaultMessage: 'Id Plataforma',
  },
  gridPlatformaName: {
    id: `${scope}.grid.platformName`,
    defaultMessage: 'Plataforma',
  },
  gridActive: {
    id: `${scope}.grid.active`,
    defaultMessage: 'Ativo',
  },
  gridGetOrder: {
    id: `${scope}.grid.getOrder`,
    defaultMessage: 'Integração de pedido',
  },
  gridGetShippLabel: {
    id: `${scope}.grid.getShippLabel`,
    defaultMessage: 'Integração de etiqueta',
  },
  gridputOthers: {
    id: `${scope}.grid.putOthers`,
    defaultMessage: 'Integração de outros',
  },
  gridputPrice: {
    id: `${scope}.grid.putPrice`,
    defaultMessage: 'Integração de preço',
  },
  gridputStock: {
    id: `${scope}.grid.putStock`,
    defaultMessage: 'Integração de estoque',
  },
  gridputOrderStatus: {
    id: `${scope}.grid.putOrderStatus`,
    defaultMessage: 'Integração de status',
  },
  gridputlastDateGetOrder: {
    id: `${scope}.grid.putlastDateGetOrder`,
    defaultMessage: 'Periodo de integração de pedido',
  },
  gridfreightCallback: {
    id: `${scope}.grid.freightCallback`,
    defaultMessage: 'Endpoint para callback de frete',
  },
});
