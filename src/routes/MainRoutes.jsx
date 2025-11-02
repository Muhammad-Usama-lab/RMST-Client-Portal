import { lazy } from 'react';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import GuestRoute from './GuestRoute';
import PrivateRoute from './PrivateRoute';

const DashboardSales = lazy(() => import('../views/dashboard/DashSales/index'));

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));

const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/login'));
const Register = lazy(() => import('../views/auth/register'));


const ServiceReports = lazy(() => import('../views/reports/ServiceReports'));
const LivelinessLogs = lazy(() => import('../views/reports/LivelinessLogs'));
const NotFound = lazy(() => import('../views/NotFound'));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <PrivateRoute />,
      children: [
        {
          path: '/',
          element: <AdminLayout />,
          children: [
            {
              path: '/dashboard',
              element: <DashboardSales />
            },
            {
              path: '/material',
              element: <MaterialIcon />
            },
            {
              path:"/typo",
              element:<Typography />
            },
            {
              path: '/reports/service-reports',
              element: <ServiceReports />
            },
            {
              path: '/reports/logs',
              element: <LivelinessLogs />
            },
            {
              path: '*',
              element: <NotFound />
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <GuestRoute />,
      children: [
        {
          path: '/',
          element: <GuestLayout />,
          children: [
            {
              path: '/login',
              element: <Login />
            },
            {
              path: '*',
              element: <NotFound />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
