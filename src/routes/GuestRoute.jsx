import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../services/auth';

const GuestRoute = () => {
  const isAuthenticated = getToken();

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default GuestRoute;
