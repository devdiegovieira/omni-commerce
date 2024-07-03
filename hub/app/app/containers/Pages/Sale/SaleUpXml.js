import { Icon, makeStyles } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import { promisseApi } from '../../../api/api';
import Axios from 'axios';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import Dropzone from 'react-dropzone';

const useStyles = makeStyles((theme) => ({

  input: {
    display: 'none',
  },
}));



export default function SaleUpXml(props) {
  const { orderId, intl } = props;
  const classes = useStyles();
  const [filesUp, setFilesUp] = useState("")
  const { enqueueSnackbar } = useSnackbar();


  const handleFiles = input => {
    let xml = input.target ? input.target.files : input;

    let xmlUrl = URL.createObjectURL(xml[0])

    input.map(file =>
      setFilesUp(file.path)
    )


    Axios.get(xmlUrl)
      .then((response) => {
        promisseApi(
          'post',
          `/order/invoice`,
          () => { },
          (err) => enqueueSnackbar(err, { variant: 'error' }),
          response.data,
          {
            headers: {
              'Content-Type': 'text/xml',
              orderId
            },

          }
        )
      })



      .catch(err => {
        enqueueSnackbar('Não foi possivel ler o arquivo.', { variant: 'error' });
      })
  }

  const rejectFiles = () => {
    enqueueSnackbar('Arquivo não suportado!', { variant: 'error' });
  }

  return (
    <Dropzone
      accept={[".xml"]}
      onDropRejected={rejectFiles}
      onChange={handleFiles}
      onDrop={handleFiles}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <section className={classes.section}>
          <div 
            {...getRootProps()} 
            style={{ 
              textAlign: "center", 
              marginTop: 25, 
              width: "100%",
              height: "20%",
              border: "3px dashed lightGray",
              padding: 10
            }} 
          >
            <input accept=".xml,image/*,.txt,.pdf"
              {...getInputProps()} />
            <div className={classes.newPic} >
              <label>
                {!isDragActive ? <Icon fontSize={'large'}>file_upload</Icon> :
                  <Icon fontSize={'large'}>save_alt</Icon>}
                <p  > {isDragActive ? 'Solte os arquivos' : 'Arraste os arquivos aqui'}</p>
              </label>
              <p className={classes.p} >{filesUp}</p>
            </div>
            <input
              accept=".xml,image/*,.txt,.pdf"
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={handleFiles}
            />
          </div>
        </section>
      )}
    </Dropzone>
  );
}



