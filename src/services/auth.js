import axios from '../utils/axios';

export const login = (accessToken) => {
  return axios.post('/auth/session', { access_token: accessToken });
};

export const storeToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const storeItem = (key, value) => {
  localStorage.setItem(key, value);
};

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};
