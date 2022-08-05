import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import Dropzone from 'react-dropzone';
import { Grid, Icon, IconButton } from '@material-ui/core';
import AlertDialog from 'digi-components/Dialog/AlertDialog';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    // borderRadius: '5px',
  },
  imageList: {
    flexWrap: 'nowrap',
    // padding: 5
  },
  input: {
    display: 'none',
  },
  newPic: {
    textAlign: 'center',
    padding: '15% 10% 10% 10%',
    width: 175
  },
  p: {
    color: '#cdcdcd',
    fontSize: '8pt',
    marginBottom: 0
  },
  section: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  }
}));

export default function UploadFilesPreview(props) {
  const classes = useStyles();

  const {
    accept = ['.jpg', '.jpeg', '.png'],
    singleFile,
    onFileChange = () => {},
    field,
    files = [],
    sizeLimit,
    label = 'Arraste os arquivos aqui',
    iconCheck
  } = props;

  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteImage, setDeleteImage] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (fileList != files) {
      let newList = files.map(m => {
        if (typeof m == 'string')
          return {
            url: m,
            new: false
          }
        else
          return m
      });
      setFileList(newList);
    } 
      
  }, [files])


  const getValidFiles = (files) => {
    let newFiles = files.map(m => {
      let extension = `.${m.path.split(".")[m.path.split(".").length - 1]}`;

      let error;
      if (!accept.includes(extension)) {
        error = `Formato inválido ${m.name}`;
      }

      if (sizeLimit && m.size > sizeLimit) {
        error = `Arquivo ${m.name} maior do que o tamanho permitido. ${sizeLimit / 1024}mb`;
      }


      return {
        file: m,
        url: URL.createObjectURL(m),
        error: error != undefined,
        errorMsg: error,
        new: true
      }
    })

    if (newFiles.find(f => f.error))
      enqueueSnackbar(newFiles.map(m => m.errorMsg).join(', '), { variant: 'success' });

    return newFiles.filter(f => !f.error);
  }

  const handleFiles = input => {
    let newFiles = getValidFiles(input.target ? input.target.files : input);

    if (singleFile)
      setFileName(newFiles[0].file.name);

    setFileList([...fileList, ...newFiles ]);
    onFileChange([...fileList, ...newFiles ], field)
  }

  const downloadImage = (item) => {
    window.open(item);
  }

  const removeImage = (data) => {
    setDeleteImage(data);
    setDeleteOpen(true);
  }

  const handleDelete = (confirm) => {
    if (confirm) {
      
      fileList.map(m => {
        if (m == deleteImage)
          m.deleted = true;
      })
    
      setFileList([...fileList.filter(f => !f.deleted || (f.deleted && !f.new))]);
      onFileChange([...fileList.filter(f => !f.deleted || (f.deleted && !f.new))], field);
    }

    setDeleteOpen(false);
  };

  return (
    <div className={classes.root}>
      <AlertDialog
        isOpen={deleteOpen}
        title="Deletar Registro(s)"
        description="Deseja mesmo deletar o(s) registro(s) selecionado(s)?"
        handleClose={handleDelete}
      />

      <Grid container justifyContent="center">
        <ImageList className={classes.imageList} cols={0}>

          <ImageListItem style={{

            border: "1px dashed lightGray",
            borderRadius: 5,
            padding: 10,
            cursor: 'pointer'
          }} >

            <Dropzone onDrop={handleFiles}>
              {({ getRootProps, getInputProps, isDragActive }) => (
                <section className={classes.section}
                  accept={accept} multiple={!singleFile} >
                  <div {...getRootProps()} >
                    <input {...getInputProps()} />
                    <div className={classes.newPic} >
                      <label>
                        {!isDragActive ? <Icon fontSize={'large'}>file_upload</Icon> :
                          <Icon fontSize={'large'}>save_alt</Icon>}
                        <p style={{ marginBottom: 0 }}><b> {isDragActive ? 'Solte os arquivos' : label}</b></p>
                        {iconCheck && <Icon style={{ color: 'green', fontSize: 30 }} >check</Icon>}


                      </label>
                      <p className={classes.p} >{!singleFile ? '(Ou arraste para o lado para vizualizar os arquivos)' : 'Arrasque ou clique para selecionar'}</p>
                      <b>{fileName}</b>
                    </div>
                    <input
                      accept={accept}
                      className={classes.input}
                      id="contained-button-file"
                      multiple={!singleFile}
                      type="file"
                      onChange={handleFiles}
                    />
                  </div>
                </section>
              )}
            </Dropzone>


          </ImageListItem>

          {!singleFile && Array.isArray(fileList) && fileList.filter(f => !f.deleted).map((item) => (

            <ImageListItem key={item}>
              <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={accept.filter(f => f == '.jpg' || f == '.jpeg' || f == '.png').length > 0 ? item.url : accept.filter(f => f == '.pdf').length > 0 ? 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg' : item.url} alt={item.url} />
              <ImageListItemBar
                title={''}
                style={{ background: 'none' }}
                actionIcon={
                  <IconButton title='Download' aria-label={`star ${item.url}`} style={{ background: '#4a4a4a', height: 20, width: 20, marginBottom: 110, marginRight: 5, marginBlockStart: -160 }} >
                    <Icon style={{ color: '#fff', fontSize: '13pt' }} onClick={() => downloadImage(item.url)} >download</Icon>
                  </IconButton>
                }
              />
              <ImageListItemBar
                title={''}
                style={{ background: 'none' }}
                actionIcon={
                  <IconButton title='Delete' aria-label={`star ${item}`} style={{ background: '#4a4a4a', height: 20, width: 20, marginRight: 5, marginTop: 15 }} >
                    <Icon style={{ color: '#fff', fontSize: '12pt' }} onClick={() => removeImage(item)} >delete</Icon>
                  </IconButton>
                }
              />
            </ImageListItem>

          ))}


        </ImageList>
      </Grid>
    </div>
  );
}
