
import React from 'react';
import { Dashboard } from '@/components/layout/Dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { currentUser, maintenanceRequests, payments } from '@/lib/data';
import { RequestCard } from '@/components/maintenance/RequestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Home, Wrench, MessageCircle, CreditCard, Plus, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { AuthNavBar } from '@/components/layout/AuthNavBar';

const Index = () => {
  const navigate = useNavigate();
  
  const activeRequests = maintenanceRequests.filter(
    req => req.status === 'pending' || req.status === 'in_progress'
  );
  
  const nextPayment = payments.find(payment => payment.status === 'due');
  const dueDate = nextPayment ? parseISO(nextPayment.dueDate) : null;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <Dashboard>
      <div className="animate-fade-up">
        <header className="mb-8">
          <h1 className="text-3xl font-medium">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your apartment status
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="overflow-hidden">
            <div className="h-2 bg-blue-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">Maintenance</h3>
                  <p className="text-muted-foreground text-sm">
                    {activeRequests.length} active requests
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => navigate('/maintenance')}
                  className="text-blue-600 group bg-blue-50 hover:bg-blue-100 gap-1 w-full"
                  >
                  <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                  New Request
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-2 bg-indigo-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">Messages</h3>
                  <p className="text-muted-foreground text-sm">
                    2 unread messages
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <MessageCircle className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  onClick={() => navigate('/messages')}
                  className="text-indigo-600 group bg-indigo-50 hover:bg-indigo-100 gap-1 w-full"
                  >
                  View Messages
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-2 bg-green-500"></div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">Next Rent</h3>
                  <p className="text-muted-foreground text-sm">
                    {dueDate ? format(dueDate, 'MMMM d, yyyy') : 'No payments due'}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                {nextPayment && (
                  <Button 
                  onClick={() => navigate('/payments')}
                  className="text-green-600 group bg-green-50 hover:bg-green-100 gap-1 w-full"
                  >
                    Pay {formatCurrency(nextPayment.amount)}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Recent Maintenance Requests</h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/maintenance')}
              >
              View All
            </Button>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="all">All Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeRequests.length > 0 ? (
                  activeRequests.slice(0, 2).map(request => (
                    <RequestCard
                    key={request.id}
                    request={request}
                    onClick={() => navigate('/maintenance')}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground">No active maintenance requests</p>
                    <Button 
                      onClick={() => navigate('/maintenance')} 
                      className="mt-4"
                      >
                      Create a Request
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="all" className="animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {maintenanceRequests.slice(0, 4).map(request => (
                  <RequestCard
                  key={request.id}
                  request={request}
                  onClick={() => navigate('/maintenance')}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Property Information</h2>
          </div>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-lg font-medium">{currentUser.property}</h3>
                  <p className="text-gray-300 mt-1">Leased since: January 2023</p>
                  
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      <p>Lease expires: December 31, 2023</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                      <p>Parking spot: #B12</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                      <p>Building hours: 7AM - 11PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 md:text-right">
                  <div className="inline-block bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <h4 className="text-gray-100 font-medium mb-1">Property Manager</h4>
                    <p className="text-lg">{currentUser.role === 'tenant' ? 'Akash Srivastava' : 'You'}</p>
                    <p className="text-sm text-gray-300 mt-2">Contact:</p>
                    <p className="text-sm text-gray-100">8905743350</p>
                    <p className="text-sm text-gray-100">manager@example.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>          
    </Dashboard>
  );
};

export default Index;
