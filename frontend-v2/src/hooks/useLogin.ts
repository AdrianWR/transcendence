import { AxiosError } from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { alert, success } from '../components/Notifications';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export type LoginUserDto = {
  username: string;
  password: string;
};

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const login = async (loginUserDto: LoginUserDto) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/local/signin', loginUserDto);
      const json = await response.data;

      localStorage.setItem('user', JSON.stringify(json));
      dispatch({ type: 'LOGIN', payload: json });
      setIsLoading(false);
      success('Your user was logged in successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof AxiosError) {
        alert(err.response?.data.message);
      } else {
        alert('No Server Response');
      }
    }
  };

  return { login, isLoading };
};
