/* eslint-disable */

import React from 'react';
import Loading from 'digi-components/Loading';
import loadable from '../utils/loadable';

export const Login = loadable(() =>
  import('./Pages/Users/Login'), {
  fallback: <Loading />,
});
export const Register = loadable(() =>
  import('./Pages/Users/Register'), {
  fallback: <Loading />,
});
export const ResetPassword = loadable(() =>
  import('./Pages/Users/ResetPassword'), {
  fallback: <Loading />,
});
export const NotFound = loadable(() =>
  import('./NotFound/NotFound'), {
  fallback: <Loading />,
});
export const Error = loadable(() =>
  import('./Pages/Error'), {
  fallback: <Loading />,
});
export const Maintenance = loadable(() =>
  import('./Pages/Maintenance'), {
  fallback: <Loading />,
});
export const NotFoundDedicated = loadable(() =>
  import('./Pages/Standalone/NotFoundDedicated'), {
  fallback: <Loading />,
});
export const DashboardPage = loadable(() =>
  import('./Pages/Dashboard/DashboardPage'), {
  fallback: <Loading />,
});

export const SellerPage = loadable(() =>
  import('./Pages/Seller/SellerPage'), {
  fallback: <Loading />,
});

export const MarketPlacePage = loadable(() =>
  import('./Pages/MarketPlace/MarketPlacePage'), {
  fallback: <Loading />,
});
export const SaleSettingsPage = loadable(() =>
  import('./Pages/Sale/SaleSettingsPage'), {
  fallback: <Loading />,
});
export const PublishPage = loadable(() =>
  import('./Pages/Publish/PublishPage'), {
  fallback: <Loading />,
});
export const ProductPage = loadable(() =>
  import('./Pages/Product/ProductPage'), {
  fallback: <Loading />,
});

export const MessagePage = loadable(() =>
  import('./Pages/Message/MessagePage'), {
  fallback: <Loading />,
});
export const SettingsPage = loadable(() =>
  import('./Pages/Configurate/SettingsPage'), {
  fallback: <Loading />,

});
export const MoneyPage = loadable(() =>
  import('./Pages/Money/MoneyPage'), {
  fallback: <Loading />,
});
export const LogisticaPage = loadable(() =>
  import('./Pages/Logistica/LogisticaPage'), {
  fallback: <Loading />,
});
export const ExtTalaoVendasPage = loadable(() =>
  import('./Pages/Ext/TalaoVendasPage'), {
  fallback: <Loading />,
});
export const UsersPage = loadable(() =>
  import('./Pages/Users/UsersPage'), {
  fallback: <Loading />,
});
export const PublishCompabilities = loadable(() =>
  import('./Pages/Publish/PublishCompabilities'), {
  fallback: <Loading />,
});