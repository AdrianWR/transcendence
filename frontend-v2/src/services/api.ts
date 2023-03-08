import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default api;
