const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Base URL for API calls - replace with your real API endpoint when ready
const API_BASE_URL = 'http://localhost:3000/api';

// Whether to use real API or localStorage simulation
const USE_REAL_API = false; // Set to true when your backend is ready

// Generic API class to handle CRUD operations with persistence
export class ApiService<T extends { id: string }> {
  private storageKey: string;
  private resourceEndpoint: string;
  
  constructor(resourceName: string) {
    this.storageKey = `app_${resourceName}`;
    this.resourceEndpoint = `/${resourceName}`;
  }
  
  // Get all items
  async getAll(): Promise<T[]> {
    if (USE_REAL_API) {
      try {
        const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("API fetch error:", error);
        // Fallback to localStorage if API fails
        return this.getFromLocalStorage();
      }
    } else {
      // Simulate network delay
      await delay(600);
      return this.getFromLocalStorage();
    }
  }
  
  // Get item by id
  async getById(id: string): Promise<T | null> {
    if (USE_REAL_API) {
      try {
        const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}/${id}`);
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error(`API error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error("API fetch error:", error);
        // Fallback to localStorage if API fails
        const items = await this.getFromLocalStorage();
        return items.find(item => item.id === id) || null;
      }
    } else {
      await delay(400);
      const items = await this.getFromLocalStorage();
      return items.find(item => item.id === id) || null;
    }
  }
  
  // Create new item
  async create(item: Omit<T, 'id'>): Promise<T> {
    if (USE_REAL_API) {
      try {
        const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
      } catch (error) {
        console.error("API create error:", error);
        // Fallback to localStorage if API fails
        return this.createInLocalStorage(item);
      }
    } else {
      await delay(800);
      return this.createInLocalStorage(item);
    }
  }
  
  // Update existing item
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    if (USE_REAL_API) {
      try {
        const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (!response.ok) {
          if (response.status === 404) return null;
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("API update error:", error);
        // Fallback to localStorage if API fails
        return this.updateInLocalStorage(id, updates);
      }
    } else {
      await delay(600);
      return this.updateInLocalStorage(id, updates);
    }
  }
  
  // Delete item
  async delete(id: string): Promise<boolean> {
    if (USE_REAL_API) {
      try {
        const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok && response.status !== 404) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return response.ok;
      } catch (error) {
        console.error("API delete error:", error);
        // Fallback to localStorage if API fails
        return this.deleteFromLocalStorage(id);
      }
    } else {
      await delay(500);
      return this.deleteFromLocalStorage(id);
    }
  }
  
  // Initialize with seed data (if storage is empty)
  async seed(data: T[]): Promise<void> {
    const existingData = await this.getAll();
    
    if (existingData.length === 0) {
      if (USE_REAL_API) {
        try {
          // Some APIs have a bulk create endpoint
          const response = await fetch(`${API_BASE_URL}${this.resourceEndpoint}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (!response.ok) {
            // If bulk endpoint fails, try adding items one by one
            for (const item of data) {
              await this.create(item as Omit<T, 'id'>);
            }
          }
        } catch (error) {
          console.error("API seed error:", error);
          // Fallback to localStorage
          localStorage.setItem(this.storageKey, JSON.stringify(data));
        }
      } else {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      }
    }
  }
  
  // Helper methods for localStorage operations
  private getFromLocalStorage(): T[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }
  
  private createInLocalStorage(item: Omit<T, 'id'>): T {
    const items = this.getFromLocalStorage();
    const newItem = {
      ...item,
      id: `${Date.now()}`,
    } as T;
    
    localStorage.setItem(this.storageKey, JSON.stringify([...items, newItem]));
    return newItem;
  }
  
  private updateInLocalStorage(id: string, updates: Partial<T>): T | null {
    const items = this.getFromLocalStorage();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return updatedItem;
  }
  
  private deleteFromLocalStorage(id: string): boolean {
    const items = this.getFromLocalStorage();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    localStorage.setItem(this.storageKey, JSON.stringify(filteredItems));
    return true;
  }
}

// Example of a backend implementation guide
/*
To implement a real backend:

1. Create a server using Express.js, NestJS, or similar
2. Set up a database like MongoDB, PostgreSQL, or MySQL
3. Create API endpoints matching the patterns in this service
4. Set USE_REAL_API to true and update API_BASE_URL

Sample Express server setup:

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Example for maintenance requests
app.get('/api/maintenance_requests', async (req, res) => {
  // Get from database
  const requests = await db.collection('maintenance_requests').find().toArray();
  res.json(requests);
});

app.post('/api/maintenance_requests', async (req, res) => {
  // Save to database
  const newRequest = {
    ...req.body,
    id: new ObjectId().toString(),
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  };
  
  await db.collection('maintenance_requests').insertOne(newRequest);
  res.status(201).json(newRequest);
});

// Add other endpoints for GET /:id, PATCH /:id, DELETE /:id

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
*/
