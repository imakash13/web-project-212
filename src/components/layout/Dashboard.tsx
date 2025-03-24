
import React from 'react';
import { NavBar } from './NavBar';
import { cn } from '@/lib/utils';

interface DashboardProps {
  children: React.ReactNode;
  className?: string;
}

export function Dashboard({ children, className }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      <main className={cn("flex-1 pb-12 pt-6", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
