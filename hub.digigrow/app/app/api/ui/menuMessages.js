/*
 * Sidebar Component
 *
 * This contains all the text for the Sidebar Componen.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.components.Sidebar';

export default defineMessages({
  online: {
    id: `${scope}.status.online`,
    defaultMessage: 'Online',
  },
  idle: {
    id: `${scope}.status.idle`,
    defaultMessage: 'Idle',
  },
  bussy: {
    id: `${scope}.status.bussy`,
    defaultMessage: 'Bussy',
  },
  offline: {
    id: `${scope}.status.offline`,
    defaultMessage: 'Offline',
  },
  seller: {
    id: `${scope}.seller`,
    defaultMessage: 'Empresas',
  },
});
