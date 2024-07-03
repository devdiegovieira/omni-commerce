import { Box, CircularProgress, Grid, LinearProgress, List, ListItem, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { promisseApi } from '../../../api/api';
import ButtonDefault from '../../../components/Button/ButtonDefault';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';
import { chunkArray } from '../../../utils/javaScript';
import { readXLSX } from '../../../utils/xlsx';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function PublishCompatibilities() {

  const [file, setFile] = useState();
  const [publishList, setPublishList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returns, setReturns] = useState([])
  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {

    if (file) {

      try {

      setPublishList([]);
      setLoading(false);
      setReturns([])
      setTotal(0);
      setProgress(0);


        const fileReader = new FileReader();
        fileReader.onload = (e) => {

          let pubs = readXLSX(e.target.result, [0]);
          setTotal(pubs[0].length - 1);
          pubs[0].shift();
          setPublishList(chunkArray(pubs[0], 100));
          setLoading(false);
        }
        fileReader.readAsArrayBuffer(file[0].file);


      } catch (error) {
        console.log(error);
      }
    }

  }, [file])

  const updateStatus = () => {
    publishList.shift();
    let nextProgress = 100 - (100 / (total / publishList.length))
    setProgress(nextProgress)
    setPublishList([...publishList])
  }


  useEffect(() => {
    if (publishList && publishList.length) {
      promisseApi(
        'post',
        '/publish/compatibilities',
        (data) => {
          if (Array.isArray(data.rets) && data.rets.length) {
            returns.push(data);
            setReturns([...returns]);
          }
          updateStatus();
        },
        (errors) => {
          console.log(errors)
          updateStatus()
        },
        publishList[0]
      )
    }
  }, [publishList])


  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <b>Compatibilidades</b>
          </Grid>

          <Grid item >

            <UploadFilesPreview accept={['.xlsx']} singleFile onFileChange={(a, b) =>  setFile(a, b)} files={file} label={'Selecionar Planilha'} />
          </Grid>

          {loading && <b><CircularProgress size={13} style={{ marginRight: 5, marginTop: 2 }} />Aguarde...</b>}

          <Grid item>
            <p>Arquivo: <b>{file && file.name}</b></p>
            <p>Total: <b>{total}</b></p>
            <p>Pendentes: <b>{publishList.length && publishList.length - 1}</b></p>
            {total > 0 && publishList.length >= 0 && (
              <>
                {progress != 100 && <p><CircularProgress size={13} style={{ marginRight: 5, marginTop: 2 }} />Aguarde processando...</p>}
                <LinearProgressWithLabel value={(progress)} />
              </>
            )}
          </Grid>

        </Grid>
      </Grid>


      <Grid item xs={12}>
        <List>
          {returns.map(publishies => {

            return (
              <ListItem>
                <Grid container>
                  <Grid item xs={3}>
                    <p>Anúncio: <b>{publishies.publishId}</b></p>
                  </Grid>
                  <Grid item xs={9}>
                    Mensagems:{publishies.rets.map(ret => {
                        return (
                          <p><b>{JSON.stringify(ret)}</b></p>
                        )
                      })}

                  </Grid>
                </Grid>
              </ListItem>
            )
          })}


        </List>
      </Grid>

    </Grid>
  )

};
