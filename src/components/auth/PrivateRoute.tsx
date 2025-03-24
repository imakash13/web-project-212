import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('PrivateRoute - Authentication status:', isAuthenticated);
    console.log('PrivateRoute - Current location:', location.pathname);
  }, [isAuthenticated, location]);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to sign-in');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log('Authenticated, rendering children');
  return <>{children}</>;
};

export default PrivateRoute;
