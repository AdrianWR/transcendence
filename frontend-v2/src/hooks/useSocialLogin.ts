import { AxiosError } from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { alert, success } from '../components/Notifications';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export const useSocialLogin = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    setError('');

    try {
      // Authenticate with SSO and wait for server cookies
      await redirectToSsoLogin(authUrl);

      const response = await api.get('users/me');
      const json = response.data;

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      success('Your user was logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('No Server Response');
      }
    }
    setIsLoading(false);
  };

  return { socialLogin, isLoading, error };
};
