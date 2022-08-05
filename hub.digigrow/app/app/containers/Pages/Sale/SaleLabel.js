import React, { useEffect, useRef, useState } from 'react';
import ViewDialog from 'digi-components/Dialog/ViewDialog';
import { Button } from '@material-ui/core';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import { getZPLImage } from '../../../utils/zpl';
import { getLinkStorage } from '../../../utils/s3';

export function SaleLabel(props) {
  const { orderId } = props;
  const [isOpen, setIsOpen] = useState(false)
  const [label, setLabel] = useState('');
  const { enqueueSnackbar } = useSnackbar();


  const getImage = (content) => getZPLImage(
    content,
    setLabel,
    (err) => enqueueSnackbar(handleError(err), { variant: 'error' })
  )

  useEffect(() => {
    if (orderId) {
      if (orderId.labelMode) {
        getLinkStorage(
          orderId.label,
          getImage,
          (err) => {
            enqueueSnackbar(handleError(err), { variant: 'error' })
          }
        )
      } else {
        getImage(orderId.label)
      }

      setIsOpen(true);
    }
  }, [orderId])


  const labelRef = useRef(null);

  const printLabel = (labelImage) => {

    let mywindow = window.open('', 'PRINT');
    mywindow.document.write(`<img width='350' src='data:image/jpeg;charset=utf-8;base64,${labelImage}' />`);
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }

  return (
    <div>
      <ViewDialog
        isOpen={isOpen}
        title="Etiqueta"
        description={(
          <div ref={labelRef}>
            <img src={`data:image/jpeg;charset=utf-8;base64,${label}`} />
          </div>
        )}
        handleClose={() => {
          setLabel('');
          setIsOpen(false);
        }}
        customActions={(
          <Button onClick={() => printLabel(label)} color="primary" autoFocus>
            Imprimir Etiqueta
          </Button>
        )}
      >
      </ViewDialog>
    </div >
  )
}