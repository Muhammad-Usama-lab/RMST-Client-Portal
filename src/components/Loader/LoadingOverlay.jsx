import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--bs-primary)', // Using Bootstrap primary color variable
        animation: 'pulse 1.5s infinite ease-in-out',
      }}></div>
    </div>
  );
};

export default LoadingOverlay;
