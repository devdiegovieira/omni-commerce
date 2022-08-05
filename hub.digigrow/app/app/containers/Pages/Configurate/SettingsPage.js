import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Grid, Hidden, Paper } from '@material-ui/core';
import Perfil from './Perfil';
import PasswordChange from './PasswordChange';
import Access from './Access';
import QueuePage from '../Queue/QueuePage';
import { useSnackbar } from 'notistack';
import { promisseApi } from '../../../api/api';
import { useHistory } from "react-router-dom";
import PageTitle from '../../../components/Header/PageTitle';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({

  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));




export default function SettingsPage() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState({});
  useEffect(() => {
    promisseApi('get', '/user/superuser', (data) => setUser(data), (err) => enqueueSnackbar(handleError(err), { variant: 'error' }));
  }, []);

  useEffect(() => {
    let activeTab = ['profile', 'login', '' ,'queue'].indexOf(location.pathname.split('/')[2]);
    setValue(activeTab == -1 ? 1 : activeTab)

  }, []);


  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        history.push(`/settings/profile`);
        break;
      case 1:
        history.push(`/settings/login`);
        break;
      case 3:
        history.push(`/settings/queue`);
        break;
    }
  };

  return (
    <>
      <Grid container>
        <Grid item sm={12} xs={12} >

          <Grid item lg={12}>
            <PageTitle icon={'settings'} label={'Configurações'} />
          </Grid>

          <Paper>
            <Grid item sm={12} xs={12} >
              <Tabs
                orientation={"horizontal"}
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Menu Configurações"
                lassName={classes.tabs}
              >
                <Tab label="Perfil" {...a11yProps(0)} />
                <Tab label="Login" {...a11yProps(2)} />
                <Tab disabled label="Acesso" {...a11yProps(1)} />
                {
                  user &&
                  <Tab label="Fila de Integração" {...a11yProps(3)} />}
              </Tabs>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={value} index={0} >
                <Perfil />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <PasswordChange />
              </TabPanel>

              <TabPanel value={value} disabled index={2}>
                <Access />
              </TabPanel>
              {
                user &&
                <TabPanel value={value} index={3}>
                  <QueuePage />
                </TabPanel>
              }
            </Grid >
          </Paper >
        </Grid >

      </Grid >

    </>
  );
}
