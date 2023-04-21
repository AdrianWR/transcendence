import { AxiosError } from 'axios';
import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { updateUser } = useAuthContext();

  const logout = async () => {
    // Remove http-only cookies
    try {
      await api.get('auth/logout');
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error('Failed to call logout endpoint. Continuing');
      }
    }

    updateUser(null);
    localStorage.removeItem('user');
  };

  return { logout };
};
