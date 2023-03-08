import { FC, ReactNode } from 'react';
import { Navigate, Route, RouteProps, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import RequireAuth from '../components/RequireAuth';
import { useAuthContext } from '../hooks/useAuthContext';
import About from '../pages/About';
import Home from '../pages/Home';

const MyRoutes: FC<RouteProps> = () => {
  // Use the layout defined at the page level, if available
  const getLayout = (page: ReactNode) => <Layout>{page}</Layout>;
import Login from '../pages/Login';
import Profile from '../pages/Profile';

const MyRoutes: FC<RouteProps> = () => {
  const { user } = useAuthContext();

  console.log('User from Router: ', user);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path='/profile' element={<Profile />} />
        </Route>

        {/* Catch All */}
      </Route>
    </Routes>
  );
};

export default MyRoutes;
