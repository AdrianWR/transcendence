import { AxiosError } from 'axios';
import { useState } from 'react';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export type CreateUserDto = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export const useSignUp = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { updateUser } = useAuthContext();

  const signUp = async (createUserDto: CreateUserDto) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/local/signup', createUserDto);
      const json = await response.data;

      localStorage.setItem('user', JSON.stringify(json));
      updateUser(json);
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

  return { signUp, isLoading, error };
};
