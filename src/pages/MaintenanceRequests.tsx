import React, { useState, useEffect } from 'react';
import { AuthNavBar } from '@/components/layout/AuthNavBar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  issueCategories, 
  MaintenanceRequest, 
  RequestPriority, 
  RequestStatus,
  getMaintenanceRequests,
  addMaintenanceRequest,
  currentUser
} from '@/lib/data';
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Calendar } from "@/components/ui/calendar"

const MaintenanceRequests = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Load maintenance requests from localStorage on component mount
  useEffect(() => {
    setRequests(getMaintenanceRequests());
  }, []);

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const requestSchema = z.object({
    title: z.string().min(3, {
      message: "Title must be at least 3 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    category: z.string().min(1, {
      message: "Please select a category.",
    }),
    priority: z.enum(["low", "medium", "high"]),
    created: z.date(),
  })

  type RequestSchemaType = z.infer<typeof requestSchema>;

  const form = useForm<RequestSchemaType>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: "medium",
      created: new Date(),
    },
  })

  function onSubmit(values: RequestSchemaType) {
    const newRequest: MaintenanceRequest = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      category: values.category,
      priority: values.priority,
      status: "pending",
      updated: new Date().toISOString(),
      created: values.created.toISOString(),
      tenant: {
        id: currentUser.id,
        name: currentUser.name,
      },
      timeline: [
        {
          date: new Date().toISOString(),
          status: "submitted",
          note: "Request submitted by tenant",
        },
      ],
    };

    // Add the new request to localStorage and update state
    addMaintenanceRequest(newRequest);
    setRequests(getMaintenanceRequests());
    
    // Reset form and close dialog
    form.reset();
    setDialogOpen(false);
    
    toast({
      title: "Success!",
      description: "Your maintenance request has been submitted.",
    });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <Input
            type="search"
            placeholder="Search requests..."
            className="max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Maintenance Request</DialogTitle>
                <DialogDescription>
                  Fill in the details for your maintenance request.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the issue..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {issueCategories.map((category) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="created"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Created Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          The date the issue was created.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableCaption>A list of your maintenance requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.title}</TableCell>
                <TableCell>{request.category}</TableCell>
                <TableCell>{request.priority}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>{new Date(request.created).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenanceRequests;
