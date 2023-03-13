import { useEffect } from 'react';
import { FCWithLayout } from '../../App';

const LoginSuccess: FCWithLayout = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);
  return <div>Thanks for logging in! You will be redirected soon...</div>;
};

export default LoginSuccess;
