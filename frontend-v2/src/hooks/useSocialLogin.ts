import { AxiosError } from 'axios';
import { useState } from 'react';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export const useSocialLogin = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const redirectToSsoLogin = async (authUrl: string) => {
    let timer: NodeJS.Timeout | null = null;
    const newWindow = window.open(authUrl, '_blank', 'width=500,height=600');

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          if (timer) clearInterval(timer);
          return;
        }
      }, 1000);
    }
  };

  const socialLogin = async (authUrl: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Authenticate with SSO and wait for server cookies
      await redirectToSsoLogin(authUrl);

      const response = await api.get('users/me');
      const json = await response.data;

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      } else {
        setError('No Server Response');
      }
    }
    setIsLoading(false);
  };

  return { socialLogin, isLoading, error };
};
