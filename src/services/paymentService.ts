import { ApiService } from './api';
import { Payment, payments } from '@/lib/data';

class PaymentService extends ApiService<Payment> {
  constructor() {
    super('payments');
    this.initializeData();
  }
  
  async initializeData() {
    await this.seed(payments);
  }
  
  async getUpcomingPayment(): Promise<Payment | null> {
    const allPayments = await this.getAll();
    return allPayments.find(payment => payment.status === 'due') || null;
  }
  
  async makePayment(paymentId: string): Promise<Payment | null> {
    const payment = await this.getById(paymentId);
    
    if (!payment) return null;
    
    return this.update(paymentId, {
      status: 'paid',
      paidDate: new Date().toISOString(),
    });
  }
  
  // Generate future expected payments based on current data
  async generateFuturePayments(count = 6): Promise<Payment[]> {
    const existingPayments = await this.getAll();
    const rentAmount = existingPayments.find(p => p.type === 'rent')?.amount || 1200;
    
    const lastPayment = existingPayments.sort((a, b) => 
      new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )[0];
    
    const futurePayments: Payment[] = [];
    let lastDate = lastPayment ? new Date(lastPayment.dueDate) : new Date();
    
    for (let i = 0; i < count; i++) {
      // Move to next month
      lastDate = new Date(lastDate);
      lastDate.setMonth(lastDate.getMonth() + 1);
      lastDate.setDate(1); // First of the month
      
      const newPayment: Omit<Payment, 'id'> = {
        tenant: 'u1',
        amount: rentAmount,
        dueDate: lastDate.toISOString(),
        status: 'due',
        type: 'rent',
      };
      
      const created = await this.create(newPayment);
      futurePayments.push(created);
    }
    
    return futurePayments;
  }
}

export const paymentService = new PaymentService();
