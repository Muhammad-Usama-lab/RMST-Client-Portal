import axios from 'utils/axios';
import { getToken } from './auth';

export const getUsageStats = async () => {
  const response = await axios.get('/company/getUsageStats', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};


export const getLivelinessLogs = async () => {
  const response = await axios.get('/company/getLivelinessStats', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
};

export const getActiveServices = async () => {
  const response = await axios.get('/company/getActiveServices', {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return response.data;
}
