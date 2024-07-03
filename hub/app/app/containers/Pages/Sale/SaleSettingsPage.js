import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Badge, Grid, Paper } from '@material-ui/core';
import SalePage from './SalePage';
import NotFound from '../../NotFound/NotFound';
import MessagePage from '../Message/MessagePage';
import LogisticaPage from '../Logistica/LogisticaPage';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import { promisseApi } from '../../../api/api';
import { handleError } from '../../../utils/error';
import { useSnackbar } from 'notistack';
import SaleDetail from './SaleDetail';
import { useHistory } from "react-router-dom";
import MediationSalePage from './MediationSalePage';
import MediationDetail from './MediationDetail';
import PageTitle from '../../../components/Header/PageTitle';

export function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const { enqueueSnackbar } = useSnackbar();



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

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -15,
    top: 12,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);

export default function SaleSettingsPage(property) {
  const history = useHistory();
  const [value, setValue] = useState();

  useEffect(() => {
    let activeTab = ['message', 'general', 'logistica', 'mediation'].indexOf(location.pathname.split('/')[2]);
    setValue(activeTab == -1 ? 1 : activeTab)

  }, []);

  let paths = location.pathname.split('/');
  if (paths.length == 2) { history.push(`${location.pathname}/general`) }
  const [orderId, setOrderId] = useState(paths.length > 3 && paths[3] ? paths[3] : undefined);

  paths = paths.length > 3 && paths[3] ? paths[3] : undefined;
  if (paths != orderId) setOrderId(paths);




  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        history.push(`/sale/message`);
        break;
      case 1:
        history.push(`/sale/general`);
        break;
      case 2:
        history.push(`/sale/logistica`);
        break
      case 3:
        history.push(`/sale/mediation`);
        break;
    }


  };
  const [countQuestion, setCountQuestion] = useState(0);
  const [badge, setBadge] = useState(0);


  useEffect(() => {

    promisseApi(
      'get',
      '/order/medlist',
      data => {
        setBadge(data.items.length);
      },
      (err) => enqueueSnackbar(handleError(err), { variant: 'error' }),
    )




    promisseApi(
      'get',
      '/messages/count',
      (data) => {
        setCountQuestion(data.questionsCount)
        setNelson()
      },
      (err) => enqueueSnackbar(err, { variant: 'error' }),
      {

      }
    );

    let interval = setInterval(() => {

      promisseApi(
        'get',
        '/messages/count',
        (data) => {
          setCountQuestion(data.questionsCount)
        },
        (err) => enqueueSnackbar(err, { variant: 'error' }),
        {

        }
      );

    }, 20000);

    return () => {
      clearInterval(interval)
    }
  }, []);



  return (
    <Grid container spacing={2}>
      {!orderId && (
        <Grid item xs={12} >

          <PageTitle icon={'insights'} label={'Vendas'} />

          <Paper>
            <Tabs
              orientation={"horizontal"}
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Menu Configurações"

            >
              <Tab

                label={(
                  <div>
                    <StyledBadge
                      color="primary"
                      style={{ marginBottom: 27, marginRight: 30 }}
                      badgeContent={countQuestion}
                      max={99}
                    />
                    Perguntas

                  </div>)} {...a11yProps(0)} />

              <Tab label={(<div>Vendas Geral</div>)}
                {...a11yProps(1)} />
              <Tab
                label={(<div>Logistica</div>)}
                {...a11yProps(2)}
              />

              <Tab

                label={(
                  <div>
                    {/* <Hidden smDown> */}
                    <StyledBadge
                      color="primary"
                      style={{ marginBottom: 27, marginRight: 30 }}
                      badgeContent={badge}
                      max={99}
                    />Mediação

                  </div>)} {...a11yProps(3)} />

            </Tabs>
            <TabPanel value={value} index={1} >
              <SalePage property={property} />
            </TabPanel>
            <TabPanel value={value} index={0} >
              <MessagePage setCountQuestion={setCountQuestion} />
            </TabPanel>
            <TabPanel value={value} index={2} >
              <LogisticaPage />

            </TabPanel>
            {/* <TabPanel value={value} index={3} >
              <NotFound />
            </TabPanel> */}
            <TabPanel value={value} index={3} >
              <MediationSalePage />
            </TabPanel>
          </Paper>

        </Grid>
      )}

      {orderId && value == 1 &&
        (
          <Grid item xs={12}>
            <SaleDetail
              orderId={orderId}
            />
          </Grid>
        )
      }

      {orderId && value == 2 &&
        (
          <Grid item xs={12}>
            <MediationDetail
              orderId={orderId}
            />
          </Grid>
        )
      }
    </Grid >
  );
}
