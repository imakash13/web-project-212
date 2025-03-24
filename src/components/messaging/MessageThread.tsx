import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { currentUser, landlord, Message } from '@/lib/data';
import { messageService } from '@/services/messageService';
import { Send, Image, Paperclip, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDataFetch } from '@/hooks/useDataService';
import { toast } from 'sonner';

export function MessageThread() {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [], setData: setMessages } = useDataFetch(() => messageService.getAll());

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await messageService.sendMessage(newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');

      setIsTyping(true);
      
      const randomDelay = 1000 + Math.random() * 2000;
      const response = await messageService.simulateLandlordResponse(randomDelay);
      
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper functions for formatting message dates and times
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const formatMessageDate = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
  };

  const groupMessagesByDate = () => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';
    
    // Add null check for messages array
    if (!messages || messages.length === 0) {
      return groups;
    }
    
    messages.forEach(message => {
      const messageDate = formatMessageDate(message.timestamp);
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: currentDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });
    
    return groups;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col shadow-card animate-scale-in">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={landlord.avatar} alt={landlord.name} />
            <AvatarFallback>{landlord.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{landlord.name}</CardTitle>
            <CardDescription>Property Manager</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {groupMessagesByDate().map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4">
              <div className="relative flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground relative z-10">
                  {group.date}
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
              </div>
              
              {group.messages.map((message) => {
                const isCurrentUser = message.sender === currentUser.id;
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "flex items-end gap-2 max-w-[80%]",
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    )}>
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={landlord.avatar} alt={landlord.name} />
                          <AvatarFallback>{landlord.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div>
                        <div
                          className={cn(
                            "rounded-2xl px-4 py-2 text-sm",
                            isCurrentUser
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-secondary text-secondary-foreground rounded-tl-none"
                          )}
                        >
                          {message.content}
                        </div>
                        <div
                          className={cn(
                            "text-xs mt-1 text-muted-foreground",
                            isCurrentUser ? "text-right" : "text-left"
                          )}
                        >
                          {formatMessageTime(message.timestamp)}
                        </div>
                      </div>
                      
                      {isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={landlord.avatar} alt={landlord.name} />
                  <AvatarFallback>{landlord.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="rounded-2xl px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-tl-none">
                    <span className="flex space-x-1">
                      <span className="animate-pulse">•</span>
                      <span className="animate-pulse delay-75">•</span>
                      <span className="animate-pulse delay-150">•</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-3">
        <div className="flex items-end w-full gap-2">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 min-h-[40px] resize-none"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="h-9 w-9 rounded-full p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
