import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.component.DataGrid';

const dataGridMessages = defineMessages({
  noMatch: {
    id: `${scope}.body.noMatch`,
    defaultMessage: 'Sem registros para mostrar',
  },
  toolTip: {
    id: `${scope}.body.toolTip`,
    defaultMessage: 'Ordenar',
  },
  next: {
    id: `${scope}.pagination.next`,
    defaultMessage: 'Próxima Página',
  },
  previous: {
    id: `${scope}.pagination.previous`,
    defaultMessage: 'Página Anterior',
  },
  rowsPerPage: {
    id: `${scope}.pagination.rowsPerPage`,
    defaultMessage: 'Linhas por Página:',
  },
  displayRows: {
    id: `${scope}.pagination.displayRows`,
    defaultMessage: 'de',
  },
  jumpToPage: {
    id: `${scope}.pagination.jumpToPage`,
    defaultMessage: 'Pular para página:',
  },
  search: {
    id: `${scope}.toolbar.search`,
    defaultMessage: 'Buscar',
  },
  downloadCsv: {
    id: `${scope}.toolbar.downloadCsv`,
    defaultMessage: 'Download CSV',
  },
  print: {
    id: `${scope}.toolbar.print`,
    defaultMessage: 'Imprimir',
  },
  viewColumns: {
    id: `${scope}.toolbar.viewColumns`,
    defaultMessage: 'Ver Colunas',
  },
  filterTable: {
    id: `${scope}.toolbar.filterTable`,
    defaultMessage: 'Filtrar Tabela',
  },
  all: {
    id: `${scope}.filter.all`,
    defaultMessage: 'Todos',
  },
  title: {
    id: `${scope}.filter.title`,
    defaultMessage: 'Filtros',
  },
  reset: {
    id: `${scope}.filter.reset`,
    defaultMessage: 'Limpar',
  },
  titleAria: {
    id: `${scope}.viewColumns.titleAria`,
    defaultMessage: 'Linha(s) selecionadas',
  },
  title: {
    id: `${scope}.viewColumns.title`,
    defaultMessage: 'Mostrar Colunas',
  },
  text: {
    id: `${scope}.selectedRows.text`,
    defaultMessage: 'Linha(s) selecionadas',
  },
  delete: {
    id: `${scope}.selectedRows.delete`,
    defaultMessage: 'Apagar',
  },
  deleteAria: {
    id: `${scope}.selectedRows.deleteAria`,
    defaultMessage: 'Apagar linhas selecionadas',
  },

})

const dataGridTexts = (intl) => {
  return {
    body: {
      noMatch: intl.formatMessage(dataGridMessages.noMatch) ,
      toolTip: intl.formatMessage(dataGridMessages.toolTip),
    },
    pagination: {
      next: intl.formatMessage(dataGridMessages.next),
      previous: intl.formatMessage(dataGridMessages.previous),
      rowsPerPage: intl.formatMessage(dataGridMessages.rowsPerPage),
      displayRows: intl.formatMessage(dataGridMessages.displayRows),
      jumpToPage: intl.formatMessage(dataGridMessages.jumpToPage),
    },
    toolbar: {
      search: intl.formatMessage(dataGridMessages.search),
      downloadCsv: intl.formatMessage(dataGridMessages.downloadCsv),
      print: intl.formatMessage(dataGridMessages.print),
      viewColumns: intl.formatMessage(dataGridMessages.viewColumns),
      filterTable: intl.formatMessage(dataGridMessages.filterTable),
    },
    filter: {
      all: intl.formatMessage(dataGridMessages.all),
      title: intl.formatMessage(dataGridMessages.title),
      reset: intl.formatMessage(dataGridMessages.reset),
    },
    viewColumns: {
      title: intl.formatMessage(dataGridMessages.title),
      titleAria: intl.formatMessage(dataGridMessages.titleAria),
    },
    selectedRows: {
      text: intl.formatMessage(dataGridMessages.text),
      delete: intl.formatMessage(dataGridMessages.delete),
      deleteAria: intl.formatMessage(dataGridMessages.deleteAria),
    },
  };
};

export { dataGridTexts, dataGridMessages}