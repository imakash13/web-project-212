import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const storedUsers = localStorage.getItem('demoUsers');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    setIsFirstTime(users.length === 0);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const storedUsers = localStorage.getItem('demoUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const user = users.find(
        (user: any) => user.email === email && user.password === password
      );
      if (user) {
        const authUser = { email: user.email, name: user.name, id: user.id };
        login(authUser);
        toast.success('Successfully signed in!');
        navigate(from, { replace: true });
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToSignUp = () => {
    navigate('/signup');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      {isFirstTime ? (
        <CardContent className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
            <h3 className="font-medium mb-1">Welcome to RentTalkConnect!</h3>
            <p className="text-sm">It looks like you're new here. Please sign up to create an account first.</p>
          </div>
          <Button 
            className="w-full" 
            onClick={handleRedirectToSignUp}
          >
            Go to Sign Up
          </Button>
        </CardContent>
      ) : (
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      )}
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground text-center">
          Don't have an account?{' '}
          <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
