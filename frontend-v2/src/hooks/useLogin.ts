import { AxiosError } from 'axios';
import { useState } from 'react';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export type LoginUserDto = {
  username: string;
  password: string;
};

export const useLogin = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const login = async (loginUserDto: LoginUserDto) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/local/signin', loginUserDto);
      const json = await response.data;

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message);
      } else {
        setError('No Server Response');
      }
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
