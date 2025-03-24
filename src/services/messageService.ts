import { ApiService } from './api';
import { Message, messages } from '@/lib/data';
import { currentUser, landlord } from '@/lib/data';

class MessageService extends ApiService<Message> {
  constructor() {
    super('messages');
    this.initializeData();
  }
  
  async initializeData() {
    await this.seed(messages);
  }
  
  async sendMessage(content: string): Promise<Message> {
    const message: Omit<Message, 'id'> = {
      sender: currentUser.id,
      recipient: landlord.id,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    const sentMessage = await this.create(message);
    
    // Automatically generate an AI response after a short delay
    this.generateAIResponse(content);
    
    return sentMessage;
  }
  
  private async generateAIResponse(userMessage: string): Promise<Message | null> {
    try {
      // Simulate typing delay (1-3 seconds)
      const typingDelay = 1000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      // Generate AI response based on user's message
      const aiResponse = await this.createAIResponse(userMessage);
      
      // Create the landlord message with the AI response
      const message: Omit<Message, 'id'> = {
        sender: landlord.id,
        recipient: currentUser.id,
        content: aiResponse,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      return this.create(message);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return null;
    }
  }
  
  private async createAIResponse(userMessage: string): Promise<string> {
    // Simple rule-based responses
    const userMessageLower = userMessage.toLowerCase();
    
    // Maintenance related queries
    if (userMessageLower.includes('maintenance') || userMessageLower.includes('repair') || userMessageLower.includes('fix')) {
      return "I see you have a maintenance concern. You can submit a formal request through the Maintenance Requests section, or provide more details about the issue here, and I'll help you address it.";
    }
    
    // Payment related queries
    if (userMessageLower.includes('payment') || userMessageLower.includes('rent') || userMessageLower.includes('bill') || userMessageLower.includes('fee')) {
      return "Regarding your payment inquiry: You can view all payment details in the Payments section. If you have specific questions about your balance or due dates, please let me know.";
    }
    
    // Lease related queries
    if (userMessageLower.includes('lease') || userMessageLower.includes('contract') || userMessageLower.includes('agreement')) {
      return "For lease-related questions: Your current lease is available for review in your account settings. I'm happy to clarify any specific terms or conditions you're unsure about.";
    }
    
    // Greetings
    if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
      return "Hello! How can I assist you with your property today?";
    }
    
    // Thanks
    if (userMessageLower.includes('thank') || userMessageLower.includes('thanks') || userMessageLower.includes('appreciate')) {
      return "You're welcome! I'm here to help. Is there anything else you need assistance with?";
    }
    
    // Default responses
    const defaultResponses = [
      "Thank you for your message. I'll look into this and get back to you shortly.",
      "I've received your inquiry. Let me check the details and I'll respond with more information.",
      "Thanks for reaching out. I'll review this matter and provide you with an update as soon as possible.",
      "I appreciate your question. Let me gather the relevant information to address your concern properly.",
      "Your message has been received. I'll handle this matter promptly and keep you informed."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  async simulateLandlordResponse(delay = 2000): Promise<Message> {
    const responses = [
      "Thanks for your message. I'll look into this right away.",
      "I've received your request and will get back to you shortly.",
      "Thanks for letting me know. I'll schedule a time to address this.",
      "I appreciate you reaching out. Let me check on this for you.",
      "I'll make a note of this and get back to you with more information."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const message: Omit<Message, 'id'> = {
      sender: landlord.id,
      recipient: currentUser.id,
      content: randomResponse,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    return this.create(message);
  }
  
  async getUnreadCount(): Promise<number> {
    const allMessages = await this.getAll();
    return allMessages.filter(msg => msg.recipient === currentUser.id && !msg.read).length;
  }
  
  async markAsRead(id: string): Promise<Message | null> {
    return this.update(id, { read: true });
  }
}

export const messageService = new MessageService();
