// components/RedirectIfAuth.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const token =  localStorage.getItem('token');
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

export default PublicRouteWrapper;
