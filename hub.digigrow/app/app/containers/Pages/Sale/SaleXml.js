import React, { useEffect, useState } from 'react';
import ViewDialog from 'digi-components/Dialog/ViewDialog';
import format from "xml-formatter";
import { getLinkStorage } from '../../../utils/s3';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';

export function SaleXml(props) {
  const { orderId } = props;
  const [isOpen, setIsOpen] = useState(false)
  const [xml, setXml] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (orderId) {
      if (orderId.labelMode) {
        getLinkStorage(
          orderId.invoice.xml, 
          (content) => {
            setXml(format(content))
          }, 
          (err) => {
            enqueueSnackbar(handleError(err), { variant: 'error' })
          }
        )
      } else {
        setXml(format(orderId.invoice.xml))
      }

      setIsOpen(true);
    }
  }, [orderId])


  return (
    <ViewDialog
      isOpen={isOpen}
      title="XML"
      description={(<pre>{xml}</pre>)}
      handleClose={() => { 
        setXml('');
        setIsOpen(false) 
      }}
      customActions={(
        <Button onClick={() => window.open(orderId.invoice.xml)} color="primary" autoFocus>
          Baixar XML
        </Button>
      )}
    />
  )
}