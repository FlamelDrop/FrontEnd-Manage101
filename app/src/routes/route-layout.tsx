import React, { lazy } from 'react';

// import LD from 'src/layouts/DocsLayout';
// import LM from 'src/layouts/MainLayout';
// import LA from 'src/layouts/DashboardLayout';

import LA from 'src/layouts/MainLayout'

import routesApp from './route-layout-app';
// import routesDoc from './route-layout-docs';
// import routesMain from './route-layout-main';

import GA from './guard.authen';
import GG from './guard.guest';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Crypto from 'src/services/crypto';
import { IStates } from 'src/stores/root.reducer';
import routeLink from './route-link';

const exact = true;

interface IToModule {
  url: string;
}
export const ToModule = (props: IToModule) => {
  const { token } = useSelector((state: IStates) => state.authenReducer);
  const tokenEncrypt = Crypto.encrypt(`${token}`);
  setTimeout(() => {
    window.location.href = window.encodeURI(`${props.url}?i=${tokenEncrypt}`);
  }, 500);
  return <div>Redirecting...</div>;
};

export default [
  { exact, path: '/', component: () => <Redirect to={routeLink.admin.login} />, guard: GA },
  { exact, path: '/admin', component: () => <Redirect to={routeLink.admin.login} />, guard: GG },
  { exact, path: routeLink.admin.login, component: lazy(() => import('src/pages/login')), guard: GG },
  { exact, path: routeLink.logout, component: lazy(() => import('src/pages/logout')), guard: GA },
  { exact, path: routeLink.error404, component: lazy(() => import('src/pages/error/error-404')) },
  { path: routeLink.admin.admin, routes: [...routesApp], layout: LA, guard: GA },
  { component: () => <Redirect to={routeLink.error404} /> },
];
