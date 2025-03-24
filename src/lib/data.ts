import { 
  MessageCircle, 
  Home, 
  Wrench, 
  CreditCard, 
  Settings, 
  User, 
  LogOut
} from "lucide-react";

// Navigation menu data
export const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    title: "Maintenance",
    icon: Wrench,
    href: "/maintenance",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    href: "/messages",
  },
  {
    title: "Payments",
    icon: CreditCard,
    href: "/payments",
  },
];

export const userNavItems = [
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Log out",
    icon: LogOut,
    href: "#",
  },
];

// User data storage
const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: 'renttalk_current_user',
  LANDLORD: 'renttalk_landlord',
  MAINTENANCE_REQUESTS: 'renttalk_maintenance_requests',
  MESSAGES: 'renttalk_messages',
  PAYMENTS: 'renttalk_payments'
};

// Default data for first-time initialization
const defaultCurrentUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://i.pravatar.cc/300?img=12",
  role: "tenant",
  property: "Apartment 3B, Maple Residences",
};

const defaultLandlord = {
  id: "l1",
  name: "Morgan Smith",
  email: "morgan@propertymanagement.com",
  avatar: "https://i.pravatar.cc/300?img=8",
  phone: "(555) 123-4567",
};

// Data types
export type RequestStatus = "pending" | "in_progress" | "completed";
export type RequestPriority = "low" | "medium" | "high";

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
  created: string;
  updated: string;
  tenant: {
    id: string;
    name: string;
  };
  images?: string[];
  timeline: {
    date: string;
    status: string;
    note?: string;
  }[];
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Payment {
  id: string;
  tenant: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "due" | "overdue";
  type: "rent" | "deposit" | "fee";
}

// Helper functions to get and set data
export function getCurrentUser() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : defaultCurrentUser;
}

export function setCurrentUser(user: typeof defaultCurrentUser) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getLandlord() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.LANDLORD);
  return data ? JSON.parse(data) : defaultLandlord;
}

export function setLandlord(landlord: typeof defaultLandlord) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.LANDLORD, JSON.stringify(landlord));
}

export function getMaintenanceRequests(): MaintenanceRequest[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.MAINTENANCE_REQUESTS);
  return data ? JSON.parse(data) : [];
}

export function setMaintenanceRequests(requests: MaintenanceRequest[]) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE_REQUESTS, JSON.stringify(requests));
}

export function addMaintenanceRequest(request: MaintenanceRequest) {
  const requests = getMaintenanceRequests();
  requests.unshift(request); // Add to beginning of array
  setMaintenanceRequests(requests);
  return request;
}

export function getMessages(): Message[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.MESSAGES);
  return data ? JSON.parse(data) : [];
}

export function setMessages(messages: Message[]) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

export function addMessage(message: Message) {
  const messages = getMessages();
  messages.push(message);
  setMessages(messages);
  return message;
}

export function getPayments(): Payment[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEYS.PAYMENTS);
  return data ? JSON.parse(data) : [];
}

export function setPayments(payments: Payment[]) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
}

export function addPayment(payment: Payment) {
  const payments = getPayments();
  payments.push(payment);
  setPayments(payments);
  return payment;
}

// Initialize data on first load if empty
export function initializeDefaultData() {
  // Initialize current user if not exists
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER)) {
    setCurrentUser(defaultCurrentUser);
  }

  // Initialize landlord if not exists
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.LANDLORD)) {
    setLandlord(defaultLandlord);
  }

  // Initialize maintenance requests if not exists
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.MAINTENANCE_REQUESTS)) {
    const defaultRequests: MaintenanceRequest[] = [
      {
        id: "req1",
        title: "Leaking Kitchen Faucet",
        description: "The kitchen faucet has been leaking for two days. Water is pooling around the base.",
        category: "Plumbing",
        priority: "medium",
        status: "in_progress",
        created: "2023-09-15T14:30:00Z",
        updated: "2023-09-16T10:15:00Z",
        tenant: {
          id: "u1",
          name: "Alex Johnson",
        },
        images: [
          "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVha2luZyUyMGZhdWNldHxlbnwwfHwwfHx8MA%3D%3D",
        ],
        timeline: [
          {
            date: "2023-09-15T14:30:00Z",
            status: "submitted",
            note: "Request submitted by tenant",
          },
          {
            date: "2023-09-15T16:45:00Z",
            status: "reviewed",
            note: "Request reviewed by landlord",
          },
          {
            date: "2023-09-16T10:15:00Z",
            status: "scheduled",
            note: "Plumber scheduled for 9/18",
          },
        ],
      },
      {
        id: "req2",
        title: "Broken Air Conditioning",
        description: "The A/C unit is not cooling the apartment. It's running but only blowing warm air.",
        category: "HVAC",
        priority: "high",
        status: "pending",
        created: "2023-09-14T09:20:00Z",
        updated: "2023-09-14T09:20:00Z",
        tenant: {
          id: "u1",
          name: "Alex Johnson",
        },
        timeline: [
          {
            date: "2023-09-14T09:20:00Z",
            status: "submitted",
            note: "Request submitted by tenant",
          },
        ],
      },
      {
        id: "req3",
        title: "Light Fixture Replacement",
        description: "The ceiling light in the dining room needs to be replaced. It flickers and sometimes doesn't turn on.",
        category: "Electrical",
        priority: "low",
        status: "completed",
        created: "2023-09-10T11:05:00Z",
        updated: "2023-09-13T15:30:00Z",
        tenant: {
          id: "u1",
          name: "Alex Johnson",
        },
        timeline: [
          {
            date: "2023-09-10T11:05:00Z",
            status: "submitted",
            note: "Request submitted by tenant",
          },
          {
            date: "2023-09-10T14:20:00Z",
            status: "reviewed",
            note: "Request reviewed by landlord",
          },
          {
            date: "2023-09-12T09:00:00Z",
            status: "scheduled",
            note: "Electrician scheduled for 9/13",
          },
          {
            date: "2023-09-13T15:30:00Z",
            status: "completed",
            note: "Light fixture replaced and tested",
          },
        ],
      },
    ];
    setMaintenanceRequests(defaultRequests);
  }

  // Initialize messages if not exists
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.MESSAGES)) {
    const defaultMessages: Message[] = [
      // {
      //   id: "msg1",
      //   sender: "l1",
      //   recipient: "u1",
      //   content: "Hello Alex, I wanted to follow up on the maintenance request for your kitchen faucet. The plumber is scheduled to come on Monday between 9am-12pm. Will you be available?",
      //   timestamp: "2023-09-16T11:30:00Z",
      //   read: true,
      // },
      // {
      //   id: "msg2",
      //   sender: "u1",
      //   recipient: "l1",
      //   content: "Hi Morgan, yes I'll be available during that time. Thanks for scheduling it so quickly.",
      //   timestamp: "2023-09-16T12:15:00Z",
      //   read: true,
      // },
      // {
      //   id: "msg3",
      //   sender: "l1",
      //   recipient: "u1",
      //   content: "Great! Also, just a reminder that we'll be doing annual HVAC maintenance in the building next week. The technicians will need access to all units.",
      //   timestamp: "2023-09-16T12:22:00Z",
      //   read: true,
      // },
      // {
      //   id: "msg4",
      //   sender: "u1",
      //   recipient: "l1",
      //   content: "Thanks for letting me know. What day will they be coming?",
      //   timestamp: "2023-09-16T12:45:00Z",
      //   read: false,
      // },
    ];
    setMessages(defaultMessages);
  }

  // Initialize payments if not exists
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.PAYMENTS)) {
    const defaultPayments: Payment[] = [
      {
        id: "pay1",
        tenant: "u1",
        amount: 1200,
        dueDate: "2023-09-01T00:00:00Z",
        paidDate: "2023-08-29T10:15:00Z",
        status: "paid",
        type: "rent",
      },
      {
        id: "pay2",
        tenant: "u1",
        amount: 1200,
        dueDate: "2023-10-01T00:00:00Z",
        status: "due",
        type: "rent",
      },
      {
        id: "pay3",
        tenant: "u1",
        amount: 50,
        dueDate: "2023-09-15T00:00:00Z",
        paidDate: "2023-09-15T09:30:00Z",
        status: "paid",
        type: "fee",
      },
    ];
    setPayments(defaultPayments);
  }
}

// Issue categories for form
export const issueCategories = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Flooring",
  "Other",
];

// Call initialization - this ensures data is populated on first load
initializeDefaultData();

// Export references to the current data
export const currentUser = getCurrentUser();
export const landlord = getLandlord();
export const maintenanceRequests = getMaintenanceRequests();
export const messages = getMessages();
export const payments = getPayments();
