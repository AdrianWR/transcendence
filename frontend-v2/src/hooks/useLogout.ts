import api from '../services/api';
import { useAuthContext } from './useAuthContext';

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    await api.get('auth/logout');
    // Remove user from local storage
    localStorage.removeItem('user');

    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
