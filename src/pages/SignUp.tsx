import React from 'react';
import SignUp from '@/components/auth/SignUp';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">RentTalk</span>
            <span className="text-accent">Connect</span>
          </h1>
          <p className="text-muted-foreground">Create an account to get started</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
};

export default SignUpPage;
