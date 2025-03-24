
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthNavBar } from '@/components/layout/AuthNavBar';
import { useAuth } from '@/contexts/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {isAuthenticated && <AuthNavBar />}
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Page not found</p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
