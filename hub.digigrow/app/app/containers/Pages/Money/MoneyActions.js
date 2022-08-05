import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import {
  Button,
  CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid
} from '@material-ui/core';
import { promisseApi } from '../../../api/api';
import { createWorkSheet, writeXLSX } from '../../../utils/xlsx';
import { Form, useForm } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls'
import { useSnackbar } from 'notistack';
import ButtonDefault from '../../../components/Button/ButtonDefault';


function MoneyActions(props) {
  let { months } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [chosenMonth, setChosenMonth] = useState(false);
  const [reportFilter, setReportFilter] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [sellerSelectList, setSellerSelectList] = useState([]);

  const handleReportOpen = (isOpen) => {
    setReportOpen(isOpen);
    if (isOpen) {
      promisseApi(
        'get',
        `/selectlist/sellerId`,
        (data) => {
          setSellerSelectList(data)
        },
      )
    }
  }


  const submit = () => {
    setIsLoading(true);

    if (values.monthSelected || values.sellerId) {

      let parsedDate = (JSON.parse(values.monthSelected));
      let params = {}
      params.month = parsedDate.month;
      params.year = parsedDate.year;
      params.day = parsedDate.day;
      params.paymentStatus = parsedDate.checked ? values.paymentStatus : undefined;
      if(values.paymentStatus == undefined && !chosenMonth) params.paymentStatus = ['pending', 'received']

      promisseApi(
        'get',
        '/ordermoney/report',
        (data) => {
          let workSheets = [
            createWorkSheet(data.Recebido ? data.Recebido : [], 'Previsto'),
            createWorkSheet(data.Pendente ? data.Pendente : [], 'Sem previsão'),
            createWorkSheet(data.Concluído ? data.Concluído : [], 'Fechamentos anteriores'),
          ];
          writeXLSX('RelatorioFinanceiro.xlsx', workSheets);
          setIsLoading(false);
          handleReportOpen(false)
        },
        (err) => {
          enqueueSnackbar(err, { variant: 'error' });
          setIsLoading(false)
        },
        {},
        {
          headers: { sellerId: values.sellerId },
          params
        }
      )
    }
  }

  const {
    values,
    errors,
    handleInputChange,
    handleSubmit
  } = useForm(reportFilter, true, submit, []);

  const validateStatus = (a) => {
    let confirmMonth = a.target.value.includes('day') ? true : false;
    setChosenMonth(confirmMonth)
  }

  return (<>

    <Grid container spacing={2} justifyContent={'flex-end'} style={{ marginTop: 10 }} >

      <ButtonDefault
        icon={'download'}
        label={'Relatório'}
        onClick={() => handleReportOpen(true)}
      />

    </Grid>
    <Dialog
      open={reportOpen}
      onClose={() => { handleReportOpen(false) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Form onSubmit={handleSubmit} >
        <DialogTitle id="alert-dialog-title">Gerar Relatório de Fechamento</DialogTitle>
        <DialogContentText style={{ padding: 25 }} id="alert-dialog-description">
          O relatório de Fechamento contém o extrato de movimentações.
        </DialogContentText>
        <DialogContent>
          <Controls.Select
            noEmpty
            label="Período"
            name="monthSelected"
            onChange={(e) => { handleInputChange(e); validateStatus(e) }}
            options={months.map(m => {
              return {
                id: JSON.stringify(m),
                title: m.year ? `${m.day}/${new Date(m.year, m.month - 1).toLocaleString('default', { month: 'long' })}/${m.year} | ${m.value}` : 'Próximo Fechamento'
              }
            })}
            value={values.monthSelected}
            error={errors.monthSelected}
          />
        </DialogContent>
        { !chosenMonth && values.monthSelected &&(
          <DialogContent>
            <Controls.MultiSelect
              name="paymentStatus"
              label="Status"
              value={values.paymentStatus}
              onChange={handleInputChange}
              options={[
                {
                  id: 'received',
                  title: 'Previsto',
                  checked: 'false',

                },
                {
                  id: 'pending',
                  title: 'Sem previsão',
                  checked: 'false',

                }
              ]}

              error={errors.paymentStatus}
            />
          </DialogContent>
        )}
        <DialogContent>
          <Controls.Select
            disabled={props.disabled}
            name="sellerId"
            label="Empresa"
            value={values.sellerId}
            onChange={handleInputChange}
            options={sellerSelectList}
            error={errors.sellerId}
          />
        </DialogContent>

        <DialogActions>
          {isLoading && <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />}
          <Button type='submit' color="primary" autoFocus>
            Gerar
          </Button>

          <Button onClick={() => handleReportOpen(false)} color="primary" autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>

  </>
  );
}

export default injectIntl(MoneyActions);
