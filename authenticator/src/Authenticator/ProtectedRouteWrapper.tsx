// components/ProtectedRouteWrapper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRouteWrapper;
