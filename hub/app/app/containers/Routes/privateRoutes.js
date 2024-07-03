import React, { useContext, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import Dashboard from '../Templates/Dashboard';
import { AppContext } from './ThemeWrapper';



import {
  DashboardPage,
  MarketPlacePage,
  NotFound,
  PriceRulePage,
  QueuePage,
  SellerPage,
  SaleSettingsPage,
  PublishPage,
  ProductPage,
  CategoryPage,
  AutoMessage,
  MessagePage,
  SettingsPage,
  MoneyPage,
  LogisticaPage,
  UsersPage,
  PublishCompabilities,

} from '../pageListAsync';


import { isAuthorized } from '../../utils/auth';



const doLogOut = () => {
  localStorage.removeItem('userToken');
  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (

    isAuthorized(props.location.pathname) ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: '/logout', state: { from: props.location } }} />
    )
  )} />
)

const LogOutRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    doLogOut() ? (
      <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    ) : (
      <Redirect to={{ pathname: '/', state: { from: props.location } }} />
    )
  )} />
)

function Application(props) {
  const { history } = props;
  const changeMode = useContext(AppContext);



  return (
    <Dashboard history={history} changeMode={changeMode}>
      <Switch>
        <PrivateRoute path="/category" component={CategoryPage} />
        <PrivateRoute exact path="/" component={DashboardPage} />
        <PrivateRoute path="/publish" component={PublishPage} />
        <PrivateRoute path="/seller" component={SellerPage} />
        <PrivateRoute path="/queue" component={QueuePage} />
        <PrivateRoute path="/pricerule" component={PriceRulePage} />
        <PrivateRoute path="/marketplace" component={MarketPlacePage} />
        <PrivateRoute path="/product" component={ProductPage} />
        <PrivateRoute path="/sale" component={SaleSettingsPage} />
        <PrivateRoute path="/automessage" component={AutoMessage} />
        <PrivateRoute path="/message" component={MessagePage} />
        <PrivateRoute path="/settings" component={SettingsPage} />
        <PrivateRoute path="/money" component={MoneyPage} />
        <PrivateRoute path="/expedition" component={LogisticaPage} />
        <LogOutRoute path="/logout" />
        <PrivateRoute path="/users" component={UsersPage} />
        <Route path="/compatibilities" component={PublishCompabilities} />
        <LogOutRoute path="/logout" />
        <PrivateRoute component={NotFound} />
      </Switch >
    </Dashboard >
  );
}

Application.propTypes = {
  history: PropTypes.object.isRequired
};

export default Application;
