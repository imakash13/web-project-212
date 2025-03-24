This document provides guidance on how to implement a real backend for the apartment management application.

## Technology Options

1. **Node.js with Express**: Lightweight and easy to set up
2. **NestJS**: Full-featured framework with TypeScript support
3. **Django or Flask**: Python-based alternatives
4. **Ruby on Rails**: Rapid development with conventions

## Database Options

1. **MongoDB**: NoSQL database, good for flexible schema
2. **PostgreSQL**: Robust relational database with JSON support
3. **MySQL/MariaDB**: Popular relational database
4. **Firebase**: Managed NoSQL database with real-time capabilities

## Implementation Steps

1. Set up a new server project
2. Install dependencies
3. Configure your database connection
4. Create models/schemas matching the data structures in the frontend
5. Implement CRUD API endpoints for each resource
6. Add authentication and authorization
7. Deploy your backend to a hosting service

## Sample API Implementation

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/apartment_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const maintenanceSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  priority: String,
  status: String,
  created: Date,
  updated: Date,
  tenant: {
    id: String,
    name: String,
  },
  images: [String],
  timeline: [{
    date: Date,
    status: String,
    note: String,
  }],
});

// Create models
const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceSchema);

// API endpoints for maintenance requests
app.get('/api/maintenance_requests', async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/maintenance_requests/:id', async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/maintenance_requests', async (req, res) => {
  try {
    const newRequest = new MaintenanceRequest({
      ...req.body,
      created: new Date(),
      updated: new Date(),
    });
    
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/api/maintenance_requests/:id', async (req, res) => {
  try {
    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated: new Date() },
      { new: true }
    );
    
    if (!updatedRequest) return res.status(404).json({ error: 'Request not found' });
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/maintenance_requests/:id', async (req, res) => {
  try {
    const deletedRequest = await MaintenanceRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ error: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add similar endpoints for other resources: messages, payments, etc.

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Integration Steps

1. Create your backend following the pattern above
2. Deploy it to a hosting service (Heroku, Vercel, DigitalOcean, etc.)
3. Update the frontend code:
   - Set `USE_REAL_API = true` in src/services/api.ts
   - Update `API_BASE_URL` with your deployed backend URL
4. Ensure proper CORS configuration on your backend

## Authentication

For user authentication, consider:
1. JWT (JSON Web Tokens)
2. OAuth 2.0
3. Firebase Authentication
4. Auth0

## Data Migration

To migrate from localStorage to your database:
1. Create a script to extract data from localStorage
2. Transform the data to match your database schema
3. Import the data into your database
4. Test thoroughly before switching

## Additional Features to Consider

With a real backend, you can implement:
1. Real-time notifications (using WebSockets or Server-Sent Events)
2. Email/SMS notifications 
3. Payment processing (Stripe, PayPal)
4. File uploads and storage
5. Advanced reporting and analytics
