import React, { useState, useEffect } from 'react';
import { Grid, Paper, Tab, Tabs } from '@material-ui/core';
import MoneyList from './MoneyList';
import MoneySummary from './MoneySummary';
import { Helmet } from 'react-helmet';
import brand from 'digi-api/dummy/brand';
import { TabPanel } from '../Sale/SaleSettingsPage';
import PageTitle from '../../../components/Header/PageTitle';
import { useHistory } from "react-router-dom";


export default function MoneyPage(props) {
  const title = `Financeiro`;
  const history = useHistory();
  const description = brand.desc;
  let paths = location.pathname.split('/');
  const [value, setValue] = useState(paths.length > 2 && paths[2] == 'list' ? 1 : 0);
  const [filter, setFilter] = useState([]);

  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
  useEffect(() => {
    let activeTab = ['resume', 'list'].indexOf(location.pathname.split('/')[2]);
    setValue(activeTab == -1 ? 1 : activeTab)

  }, []);

  const handleChanges = (event, newValue, filter) => {
    setValue(newValue);
    setFilter(filter);
    switch (newValue) {
      case 0:
        history.push(`/money/resume`);
        break;
      case 1:
        history.push(`/money/list`);
        break;
    }

  };

  const handleReportOpen = (isOpen) => {
    setReportOpen(isOpen);
    if (isOpen) {
      promisseApi(
        'get',
        `/selectlist/sellerId`,
        (data) => {
          setSellerSelectList(data)
        },
      )
    }
  }


  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>

      <PageTitle icon={'monetization_on'} label={'Financeiro'} />

      <Paper>
        <Grid container >

          <Grid item xs={12} >

            <Tabs
              orientation={"horizontal"}
              variant="scrollable"
              value={value}
              onChange={handleChanges}
              aria-label="Menu Configurações"
            >

              <Tab
                label="Resumo"
                {...a11yProps(0)}
              />
              <Tab
                label="Lista"
                {...a11yProps(1)}
              />

            </Tabs>
          </Grid>

          <Grid item xs={12} >
            <TabPanel value={value} index={0} >
              <MoneySummary/>
            </TabPanel>
            <TabPanel value={value} index={1} >
              < MoneyList {...props}/>
            </TabPanel>

          </Grid>

        </Grid>
      </Paper>
    </>
  );
}
