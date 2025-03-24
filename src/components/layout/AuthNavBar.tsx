import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navItems, userNavItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border transition-all duration-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-medium"
            >
              <span className="text-primary">RentTalk</span>
              <span className="text-accent">Connect</span>
            </Link>
          </div>

          {isAuthenticated && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.title}
                    to={item.href}
                    className={cn(
                      "nav-item",
                      isActive ? "nav-item-active" : "nav-item-inactive"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white z-50">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userNavItems.map((item) => (
                      <DropdownMenuItem key={item.title} asChild>
                        <Link to={item.href} className="cursor-pointer flex items-center">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => navigate('/signin')}>Sign In</Button>
                <Button onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}

            {isAuthenticated && (
              <div className="flex md:hidden">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && isAuthenticated && (
        <div className="md:hidden animate-fade-in">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive 
                      ? "bg-secondary text-foreground" 
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
