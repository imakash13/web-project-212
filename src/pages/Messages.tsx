import React, { useState, useEffect } from 'react';
import { AuthNavBar } from '@/components/layout/AuthNavBar';
import { messageService } from "@/services/messageService";
import { Message, currentUser, landlord } from "@/lib/data";
import { MessageThread } from "@/components/messaging/MessageThread";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await messageService.getAll();
        setMessages(data || []); // Ensure we always have an array
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive"
        });
        setMessages([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AuthNavBar />
        <div className="container mx-auto py-8 flex justify-center items-center flex-1">
          <div>Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavBar />
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              Chat with your property manager. AI-powered support is available 24/7.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <div className="mt-6">
          <MessageThread />
        </div>
      </div>
    </div>
  );
};

export default Messages;
