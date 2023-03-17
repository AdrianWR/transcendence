import { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { alert, success } from '../components/Notifications';
import { IUser } from '../context/AuthContext';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export type LoginUserDto = {
  username: string;
  password: string;
};

export type TwoFactorAuthenticationDto = {
  code: string;
};

export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const redirectToSsoLogin = async (authUrl: string) => {
    let timer: NodeJS.Timeout | null = null;
    const newWindow = window.open(authUrl, '_blank', 'width=500,height=600');

    if (newWindow) {
      return new Promise((resolve, reject) => {
        timer = setInterval(() => {
          if (newWindow.closed) {
            if (timer) clearInterval(timer);
            return resolve('OK');
          }
        }, 1000);
      });
    }
  };

  const socialLogin = async (authUrl: string) => {
    try {
      // Authenticate with SSO and wait for server cookies
      await redirectToSsoLogin(authUrl);

      const response = await api.get<IUser>('users/me');
      const user = response.data;

      return user;
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('No Server Response');
      }
    }
  };

  const login = async (loginUserDto: LoginUserDto) => {
    try {
      const response = await api.post<IUser>('/auth/local/signin', loginUserDto);
      const user = response.data;
      return user;
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('No Server Response');
      }
    }
  };

  const login2fa = async (code: TwoFactorAuthenticationDto) => {
    try {
      const response = await api.post<IUser>('auth/2fa/login', code);

      const user = response.data;

      saveUser(user);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status) {
        alert(err.response?.data?.message);
      } else {
        alert('No server response. Try again in a few seconds.');
      }
    }
  };

  const saveUser = async (user: IUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: user });
    success('Your user was logged in successfully!');
    navigate(from, { replace: true });
  };

  return { login, socialLogin, login2fa, saveUser };
};
