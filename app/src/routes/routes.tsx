/* eslint-disable react/no-array-index-key */
import React, { Suspense, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { LoadingScreen } from 'src/components';
import RouteLayout from './route-layout';

// ------------ render  ------------
const renderRoutes = (routes: any) =>
  routes ? (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {routes.map((route: any, i: number) => {
          const Guard = route.guard || Fragment;
          const Layout = route.layout || Fragment;
          const Component = route.component;
          return (
            <Route
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props: any) => (
                // <Guard>
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Component {...props} />}</Layout>
                // </Guard>
              )}
            />
          );
        })}
      </Switch>
    </Suspense>
  ) : null;

function Routes() {
  return renderRoutes(RouteLayout);
}

export default Routes;
