
import axios from 'axios';
import { logout } from '../services/auth';

const instance = axios.create({
  baseURL: 'https://rmstservices.com' // Replace with your API base URL
  // baseURL: 'http://localhost:8000' 
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth/session')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);

export default instance;

