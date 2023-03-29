import { FC } from 'react';
import { Route, RouteProps, Routes } from 'react-router-dom';
import { FCWithLayout } from '../App';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import routesConfig from './routes.config';

const MyRoutes: FC<RouteProps> = () => {
  // Use the layout defined at the page level, if available
  const getLayout = (Page: FCWithLayout, noLayout = false) => {
    if (noLayout) return <Page />;

    return Page.getLayout ? (
      Page.getLayout(<Page />)
    ) : (
      <Layout>
        <Page />
      </Layout>
    );
  };

  return (
    <Routes>
      {routesConfig.map(({ name, path, isPrivate, component, noLayout }) => {
        if (isPrivate) {
          return (
            <Route key={name} element={<RequireAuth />}>
              <Route path={path} element={getLayout(component, noLayout)} />
            </Route>
          );
        }
        return <Route key={name} path={path} element={getLayout(component, noLayout)} />;
      })}

      {/* Catch All */}
    </Routes>
  );
};

export default MyRoutes;
