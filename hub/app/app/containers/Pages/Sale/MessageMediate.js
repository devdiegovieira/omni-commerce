import React, { useEffect, useRef, useState } from 'react';

import { AppBar, Avatar, Button, Dialog, DialogActions, DialogContent, Grid, Icon, IconButton, ImageList, ImageListItem, ImageListItemBar, List, ListItem, ListItemAvatar, ListItemText, makeStyles, Paper, Toolbar, Typography } from '@material-ui/core';
import { Form } from '../../../components/Forms/useForm';
import Controls from '../../../components/Forms/controls';
import UploadFilesPreview from '../../../components/Image/UploadFilesPreview';




const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,

  },
  imageList: {
    flexWrap: 'nowrap',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

export function MessageMediate(props) {
  const { saleData, values, handleSubmit, handleInputChange, fileChange } = props;
  const scrollRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [imgDialog, setImgDialog] = useState({});

  const opsImage = (picEx) => {
    setOpenImg(!openImg)
    setImgDialog(picEx)
  }

  const ops = () => {
    setOpen(!open)
  }


  const classes = useStyles();

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);


  return (
    <Paper style={{ padding: 25 }} elevation={2} >

      <Dialog
        open={openImg}
      >
        <AppBar style={{ position: 'relative' }}>

          <Toolbar style={{ minWidth: 400 }} >
            <Grid item xs={12}>
              <Typography>Imagens</Typography>
            </Grid>

          </Toolbar>

        </AppBar>

        <DialogContent style={{ padding: 20 }} >
          <img src={imgDialog} alt={imgDialog} style={{ maxHeight: 400, width: '100%', height: '100%', objectFit: 'cover' }} />
        </DialogContent>



        <DialogActions>

          <Button variant='contained' style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }} startIcon={<Icon>close</Icon>}
            onClick={() => setOpenImg(false)} color="primary" autoFocus>
            Fechar
          </Button>

        </DialogActions>
      </Dialog>
      <Grid container>
        <Grid item xs={12}>
          <p style={{ margin: 0 }}><Icon>chat_bubble_outline_icon</Icon> <b style={{ paddingBottom: 20 }}> Mensagens</b></p>
          <hr style={{ margin: 0 }} />
        </Grid>

        <Grid item xs={12} ref={scrollRef} >
          <List style={{ overflow: 'auto', height: 450 }} >

            {saleData && Array.isArray(saleData.conversation) && saleData.conversation.map(m => {
              return (

                <ListItem >
                  <Grid container justifyContent={saleData.iOwnMySelf == m.user ? 'flex-end' : 'flex-start'}>



                    <Grid item >
                      <Grid container justifyContent={saleData.iOwnMySelf == m.user ? 'flex-end' : 'flex-start'}>
                        <Avatar alt={m.userName} src={m.userPic} style={{ margin: 10 }} />
                      </Grid>
                    </Grid>


                    <Grid item>
                      <Grid container justifyContent={saleData.iOwnMySelf == m.user ? 'flex-end' : 'flex-start'}>
                        <Paper style={{ padding: 10, paddingTop: 2, paddingBottom: 2, backgroundColor: saleData.iOwnMySelf == m.user ? 'rgba(132, 73, 144, 0.3)' : 'rgba(215, 172, 223, 0.3)' }}>

                          <ListItemText
                            primary={m.userName}
                            secondary={<b style={{ fontSize: 15, }} >{m.message}</b>}
                          />
                          {m.picture && (

                            <ImageList className={classes.imageList} cols={0}>
                              {m.picture.map((item) => (
                                <ImageListItem key={item}>

                                  <img onClick={() => opsImage(item)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={item} alt={item} />

                                </ImageListItem>
                              ))}
                            </ImageList>

                          )}
                          <Grid item>
                            <Grid container justifyContent={saleData.iOwnMySelf == m.user ? 'flex-end' : 'flex-start'}>
                              <p style={{ fontSize: 10, opacity: '0.3', fontWeight: 'bolder', paddingTop: 7 }}>{m.newDate}</p>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>

                  </Grid>



                </ListItem>

              )
            })}


          </List>

        </Grid>

        <Grid item xs={12}>

          <Form onSubmit={handleSubmit}>
            <Grid container>
              {open && (
                <Grid item xs={12}>
                  <Grid container justifyContent='center'>
                  <UploadFilesPreview
                      field="picture"
                      onFileChange={fileChange}
                      label='Adicione as imagens'
                      files={values.picture}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </Grid>
                </Grid>)}

              <Grid item xs={12} style={{ padding: 5, paddingTop: 0 }} >
                <Controls.Input

                  label="Digite aqui..."
                  name="message"
                  value={values.message}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                />
              </Grid>
              <Grid container spacing={1} justifyContent='flex-end'>
                <Grid item >

                  <Button
                    startIcon={<Icon>send</Icon>}
                    variant='contained'
                    size="small"
                    color="primary"
                    type="submit"
                    style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }}

                    onClick={() => { setOpen(false); }}
                  >
                    Enviar
                  </Button>

                </Grid>
                <Grid item >

                  <Button
                    startIcon={<Icon>attachment</Icon>}
                    variant='contained'
                    size="small"
                    color="primary"
                    onClick={() => ops()}
                    style={{ borderRadius: 3, textTransform: 'none', fontSize: 11 }}

                  >
                    Anexar imagem
                  </Button>

                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Grid>

      </Grid>

    </Paper >

  )
}
