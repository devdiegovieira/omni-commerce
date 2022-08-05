import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { promisseApi } from '../../../api/api';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { Card, CardHeader, Checkbox, Divider, Grid, IconButton, List, ListItemSecondaryAction, TextField } from '@material-ui/core';
import { PaperBlock } from 'digi-components';
import ListAccess from './ListAccess';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({

  list: {

    maxHeight: 300,

    overflow: 'auto'
  },

  root: {

    height: 425,
    // width: 300,
    overflow: 'auto'
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },

}));

export default function Access(props) {
  const classes = useStyles();
  const [listData, setListData] = useState([]);
  const [listDataFind, setListDataFind] = useState([]);
  const { enqueueSnackbar } = useSnackbar();



  useEffect(() => {
    promisseApi(
      'get',
      '/user/userlist',
      (data) => {
        setListData(data);
        setListDataFind(data)
        setOpenDetail(true);
      },
     (err)=> enqueueSnackbar(err, { variant: 'error' }),
      {},
    )

  }, [])


  const [userChecked, setUserChecked] = React.useState([]);

  const handleToggle = (value) => () => {
    const currentIndex = userChecked.indexOf(value);
    const newChecked = [...userChecked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setUserChecked(newChecked);
  };

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  const numberOfChecked = (items) => intersection(userChecked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setUserChecked(not(userChecked, items));
    } else {
      setUserChecked(union(userChecked, items));
    }
  };

  const [filterText, setFilterText] = useState('');

  const searchUser = (e) => {
    setFilterText(e.target.value);
  }

  useEffect(() => {
    setListData(listDataFind.filter(item => item.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1));
  }, [filterText])


  return (
    <>

      <Grid container spacing={2}>
        <Grid item xl={4} lg={4} md={4} sm={12} xs={12} >
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="standard"
                value={filterText}
                onChange={searchUser}
                placeholder="Buscar…"
                style={{padding:15}}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" style={{marginLeft: 10}} />,
                  endAdornment: (
                    <IconButton
                      title="Clear"
                      aria-label="Clear"
                      size="small"
                      style={{ visibility: filterText != '' ? 'visible' : 'hidden' }}
                      onClick={e => setFilterText('')}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  className={classes.cardHeader}
                  avatar={
                    <Checkbox
                      onClick={handleToggleAll(listData.map(m => m._id))}
                      checked={numberOfChecked(listData.map(m => m._id)) === listData.length && listData.length !== 0}
                      indeterminate={numberOfChecked(listData.map(m => m._id)) !== listData.length && numberOfChecked(listData.map(m => m._id)) !== 0}
                      disabled={listData.length === 0}
                      inputProps={{ 'aria-label': 'all items selected' }}
                    />
                  }
                  title={'Usuários'}
                  subheader={`${numberOfChecked(listData.map(m => m._id))}/${listData.length} selecionados`}
                />
                <Divider />
                <List dense className={classes.root}>

                  
                  {listData.map(m => {
                    const labelId = `checkbox-list-secondary-label-${m.name}`;

                    return (

                      <ListItem key={m.name} button>
                        <ListItemAvatar>
                          <Avatar
                            alt={`Avatar n°${m.name + 1}`}
                            src={m.picture}
                          />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={m.name.substring(0, 15)} secondary={m.document} />
                        <ListItemSecondaryAction>

                          <Checkbox
                            edge="end"
                            onChange={handleToggle(m._id)}
                            checked={userChecked.indexOf(m._id) !== -1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </Card>
            </Grid>
          </Grid>


        </Grid>

        {userChecked.length > 0 && (
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12} >
            <PaperBlock
              icon='security'
              title='Menu de acesso'
              desc='Faça a gestão de acesso de usuários'
              style={{justfyContent:"space-between"}}
            >
              <ListAccess userChecked={userChecked} />
            </PaperBlock>
          </Grid>

        )}

      </Grid>
    </>

  );

}

