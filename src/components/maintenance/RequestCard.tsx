import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MaintenanceRequest } from '@/lib/data';
import { Clock, MessageCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RequestCardProps {
  request: MaintenanceRequest;
  onClick?: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 shadow-subtle hover:shadow-hover",
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg md:text-xl font-medium">{request.title}</CardTitle>
            <CardDescription className="flex items-center mt-1 gap-2">
              <Badge variant="outline">{request.category}</Badge>
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
              </Badge>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status === 'in_progress' ? 'In Progress' : 
             request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {request.description}
        </p>
        {request.images && request.images.length > 0 && (
          <div className="mt-3 flex space-x-2 overflow-x-auto pb-1">
            {request.images.map((image, index) => (
              <div key={index} className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-secondary">
                <img
                  src={image}
                  alt={`Issue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center text-xs text-muted-foreground gap-1">
          <Clock className="h-3 w-3" /> 
          <span>
            Updated {formatDate(request.updated)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          <MessageCircle className="h-3 w-3" /> 
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="text-xs gap-1">
          View Details <ChevronRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
