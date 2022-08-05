import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { promisseApi } from '../../../api/api';
import { Form, } from '../../../components/Forms/useForm';
import { Hidden, Icon, Typography } from '@material-ui/core';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';

export default function ListAccess(props) {
  const { userChecked } = props;
  const useStyles = makeStyles((theme) => ({
    root: {
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 200,
      height: 290,
      backgroundColor: theme.palette.background.paper,
      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }));


  



  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a, b) {
    return [...a, ...not(b, a)];
  }


  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [appMenu, setAppMenu] = React.useState([]);


  useEffect(() => {
    promisseApi(
      'get',
      "/access/listmenuuser",
      (data) => {
        setRight(data.map(m => m.name))
      },
      (err) => { enqueueSnackbar(err, {variant:'error'}) },
      {},
      {
        headers: {
          userIds: userChecked.join(',')
        }
      }
    )
  }, [userChecked])

  useEffect(() => {
    promisseApi(
      'get',
      "/access/listmenu",
      (left) => {
        setAppMenu(left)
        setLeft(left.filter(f => f.name != right.find(r => r == f.name)).map(m => m.name))
      },
      (err) => { enqueueSnackbar(err, {variant:'error'}) }
    )
  }, [right])

  const submitKey = () => {
    setLoading(true);
    let teste = appMenu.filter(f => right.includes(f.name)).map(m => m.key);
    promisseApi(
      'put',
      '/access/menulist',
      (data) => {
        setLoading(false);
        enqueueSnackbar({ message: 'Permissões concedidas/retiradas com sucesso!', variant: 'success' });
      },

      (err)=> enqueueSnackbar(err, { variant: 'error' })
      ,
      teste,
      {
        headers: {
          userIds: userChecked.join(',')
        }
      }
    )
  }





  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selecionados`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((m) => {
          const labelId = `transfer-list-all-item-${m}-label`;

          return (
            <ListItem key={m} role="listitem" button onClick={handleToggle(m)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(m) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={m} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <>

      <Form onSubmit={() => { }}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item justfyContent="space-between" xl={5} lg={5} md={10} sm={12} xs={12}>{customList('Disponíveis', left)}</Grid>
          <Grid item xl={2} lg={2} md={10} sm={12} xs={12}>
            <Grid container direction="column" alignItems="center">
              <Hidden only={['xs', 'sm', 'md']}>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Hidden>

              <Hidden only={['lg', 'xl']}>
              <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                >
                  <Icon>expand_less</Icon>
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                ><Icon>expand_more</Icon>
                </Button>
                
              </Hidden>
            </Grid>
          </Grid>
          <Grid item xl={5} lg={5} md={10} sm={12} xs={12}>{customList('Selecionadas', right)}</Grid>
        </Grid>
      </Form>
      <Grid>
        <Typography align='right'   >
          <Button onClick={submitKey}>Salvar</Button>
        </Typography>
      </Grid>
    </>
  );
}