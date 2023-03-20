import Home from '../pages/Home';
import About from '../pages/About';
import Profile from '../pages/Profile';
import Profile2 from '../pages/Profile2';
import Login from '../pages/Login';
import LoginSuccess from '../pages/Login/Success';
import { FCWithLayout } from '../App';

export interface IRoutesConfig {
  name: string;
  path: string;
  component: FCWithLayout;
  isPrivate?: boolean; // route needs user authenticated
  showOnNavbar?: boolean; // show this route on navbar
  noLayout?: boolean; // the page does not have a default layout (navbar, image background and footer)
}

const routesConfig: IRoutesConfig[] = [
  {
    name: 'Home',
    path: '/',
    component: Home,
    showOnNavbar: true,
  },
  {
    name: 'About',
    path: '/about',
    component: About,
    showOnNavbar: true,
  },
  {
    name: 'Profile',
    path: '/profile',
    component: Profile,
    isPrivate: true,
    showOnNavbar: true,
  },
  {
    name: 'Profile2',
    path: '/profile2',
    component: Profile2,
    isPrivate: true,
    showOnNavbar: true,
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
  },
  {
    name: 'LoginSuccess',
    path: '/login/success',
    component: LoginSuccess,
    noLayout: true,
  },
];

export default routesConfig;
