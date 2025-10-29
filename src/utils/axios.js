import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000' // Replace with your API base URL
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

export default instance;
