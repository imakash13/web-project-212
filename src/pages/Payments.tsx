
import React, { useState, useEffect } from 'react';
import { AuthNavBar } from '@/components/layout/AuthNavBar';
import { Payment, getPayments } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  
  useEffect(() => {
    // Load payments from localStorage
    setPayments(getPayments());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavBar />
      <div className="container mx-auto py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>
              Here you can view all your payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <Table>
                <TableCaption>A list of your recent payments.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {payment.status === "paid" ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>
                        ) : payment.status === "due" ? (
                          <Badge variant="secondary">Due</Badge>
                        ) : (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payments;
