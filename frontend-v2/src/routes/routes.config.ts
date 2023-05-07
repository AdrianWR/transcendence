import { FCWithLayout } from '../App';
import About from '../pages/About';
import ChatPage from '../pages/Chat';
import MatchmakerPage from '../pages/Game';
import GamePage from '../pages/Game/game';
import Home from '../pages/Home';
import Login from '../pages/Login';
import LoginSuccess from '../pages/Login/Success';
import Profile from '../pages/Profile';

export interface IRoutesConfig {
  name: string;
  path: string;
  component: FCWithLayout;
  isPrivate?: boolean; // route needs user authenticated
  showOnNavbar?: boolean; // show this route on navbar
  noLayout?: boolean; // the page does not have a default layout (navbar, image background and footer)
  navPath?: string; // sometimes navbar path might be different from routes (e.g. when you route params)
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
    path: '/profile/:userId',
    component: Profile,
    isPrivate: true,
    showOnNavbar: true,
    navPath: '/profile/me',
  },
  {
    name: 'Login',
    path: '/login',
    component: Login,
  },
  {
    name: 'Login Success',
    path: '/login/success',
    component: LoginSuccess,
    noLayout: true,
  },
  {
    name: 'Chat',
    path: '/chat',
    component: ChatPage,
    isPrivate: true,
    showOnNavbar: true,
  },
  {
    name: 'Play!',
    path: '/game',
    component: MatchmakerPage,
    isPrivate: true,
    showOnNavbar: true,
  },
  {
    name: 'Game',
    path: '/game/:gameId',
    component: GamePage,
    isPrivate: true,
  },
];

export default routesConfig;
