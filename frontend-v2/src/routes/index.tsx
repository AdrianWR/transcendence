import { FC, ReactNode } from 'react';
import { Navigate, Route, RouteProps, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import { useAuthContext } from '../hooks/useAuthContext';
import About from '../pages/About';
import Home from '../pages/Home';
import Login from '../pages/Login';
import { LoginSuccess } from '../pages/Login/Success';
import Profile from '../pages/Profile';

const MyRoutes: FC<RouteProps> = () => {
  // Use the layout defined at the page level, if available
  const getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
  const { user } = useAuthContext();

  console.log('User from Router: ', user);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/' element={Home.getLayout ? Home.getLayout(<Home />) : getLayout(<Home />)} />
      <Route path='/about' element={<About />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
      <Route path='/login/success' element={<LoginSuccess />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path='/profile' element={<Profile />} />
      </Route>

      {/* Catch All */}
    </Routes>
  );
};

export default MyRoutes;
