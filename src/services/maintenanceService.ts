import { ApiService } from './api';
import { MaintenanceRequest, maintenanceRequests } from '@/lib/data';

class MaintenanceRequestService extends ApiService<MaintenanceRequest> {
  constructor() {
    super('maintenance_requests');
    this.initializeData();
  }
  
  async initializeData() {
    await this.seed(maintenanceRequests);
  }
  
  async getActiveRequests(): Promise<MaintenanceRequest[]> {
    const requests = await this.getAll();
    return requests.filter(req => req.status === 'pending' || req.status === 'in_progress');
  }
  
  async updateStatus(id: string, status: 'pending' | 'in_progress' | 'completed', note?: string): Promise<MaintenanceRequest | null> {
    const request = await this.getById(id);
    
    if (!request) return null;
    
    const now = new Date().toISOString();
    const timelineEntry = {
      date: now,
      status,
      note: note || `Status updated to ${status}`,
    };
    
    const timeline = [...request.timeline, timelineEntry];
    
    return this.update(id, {
      status,
      updated: now,
      timeline,
    });
  }
}

export const maintenanceService = new MaintenanceRequestService();
