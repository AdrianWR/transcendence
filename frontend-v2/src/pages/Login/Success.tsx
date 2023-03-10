import { useEffect } from 'react';

export const LoginSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);
  return <div>Thanks for logging in! You will be redirected soon...</div>;
};
