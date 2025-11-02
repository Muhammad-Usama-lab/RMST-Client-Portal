import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-1">404</h1>
      <h5 className="mb-3">Page Not Found</h5>
      <p className="lead mb-4">
        The page you are looking for does not exist.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;