
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Payment } from '@/lib/data';
import { paymentService } from '@/services/paymentService';
import { useDataFetch } from '@/hooks/useDataService';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { CreditCard, Check, AlertCircle, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PaymentTracker() {
  const today = new Date();
  
  const nextPayment = payments.find(payment => payment.status === 'due');
  
  const futureDates = Array.from({ length: 6 }).map((_, i) => {
    const date = addMonths(today, i);
    const firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return {
      date: firstOfMonth,
      amount: 1200,
      status: isSameMonth(firstOfMonth, today) ? 'due' : 'upcoming',
    };
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const upcomingPayments = allPayments.filter(payment => payment.status === 'due');
  const paidPayments = allPayments.filter(payment => payment.status === 'paid');
  
  const renderPaymentCard = (payment: Payment) => {
    const isPaid = payment.status === 'paid';
    const dueDate = parseISO(payment.dueDate);
    const paidDate = payment.paidDate ? parseISO(payment.paidDate) : null;
    
    return (
      <Card key={payment.id} className="mb-4 overflow-hidden">
        <div className={cn(
          "h-1",
          isPaid ? "bg-green-500" : "bg-blue-500"
        )}></div>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-2 rounded-full",
                  isPaid ? "bg-green-100" : "bg-blue-100"
                )}>
                  {isPaid ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{payment.type === 'rent' ? 'Monthly Rent' : 'Service Fee'}</h3>
                  <p className="text-muted-foreground text-sm">
                    {isPaid
                      ? `Paid on ${format(paidDate!, 'MMMM d, yyyy')}`
                      : `Due on ${format(dueDate, 'MMMM d, yyyy')}`
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-medium text-lg">{formatCurrency(payment.amount)}</div>
              {!isPaid && (
                <Button
                  onClick={() => handleMakePayment(payment.id)}
                  disabled={paymentLoading}
                  className="mt-2"
                  size="sm"
                >
                  Pay Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="animate-fade-up">
      <Tabs 
        defaultValue="upcoming" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingPayments.length > 0 ? (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Payment Reminder</h4>
                  <p className="text-amber-700 text-sm">
                    Your next rent payment is due on {format(parseISO(upcomingPayments[0].dueDate), 'MMMM d, yyyy')}.
                    Please ensure your payment is made on time to avoid late fees.
                  </p>
                </div>
              </div>
              
              {upcomingPayments.map(renderPaymentCard)}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No Upcoming Payments</h3>
              <p className="text-muted-foreground mt-1">
                You don't have any pending payments at the moment.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          {paidPayments.length > 0 ? (
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Payment Summary</h4>
                    <p className="text-muted-foreground text-sm">
                      Total paid in {new Date().getFullYear()}: {formatCurrency(
                        paidPayments.reduce((sum, payment) => sum + payment.amount, 0)
                      )}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download Records
                  </Button>
                </div>
              </div>
              
              {paidPayments.map(renderPaymentCard)}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No Payment History</h3>
              <p className="text-muted-foreground mt-1">
                Your payment history will appear here once you've made payments.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
