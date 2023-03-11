import { AxiosError } from 'axios';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    // Remove http-only cookies
    try {
      await api.get('auth/logout');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log('Failed to call logout endpoint. Continuing');
      }
    }

    // Remove user from local storage
    localStorage.removeItem('user');

    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
