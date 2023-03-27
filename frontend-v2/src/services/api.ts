import axios, { AxiosError, HttpStatusCode } from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const refreshToken = () => {
  return axios.get('auth/jwt/refresh', {
    baseURL: BASE_URL,
    withCredentials: true,
  });
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error?.config;

    if (error?.response?.status === HttpStatusCode.Unauthorized && !originalConfig?._retry) {
      error.config._retry = true;

      try {
        await refreshToken();
        return api(originalConfig);
      } catch (err) {
        if (err instanceof AxiosError) {
          localStorage.clear();
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
