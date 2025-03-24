import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { issueCategories } from '@/lib/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Camera, Upload, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  category: z.string({
    required_error: 'Please select a category.',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Please select a priority level.',
  }),
});

export function RequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('details');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log(values, uploadedImages);
      toast.success('Maintenance request submitted successfully!', {
        description: 'Your landlord has been notified.',
      });
      setIsSubmitting(false);
      form.reset();
      setUploadedImages([]);
      setActiveTab('details');
    }, 1500);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setUploadedImages([...uploadedImages, ...newImages]);
    
    toast.success(`${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
  };

  const nextStep = () => {
    if (activeTab === 'details') {
      const detailsValid = form.trigger(['title', 'description', 'category']);
      if (detailsValid) {
        setActiveTab('priority');
      }
    } else if (activeTab === 'priority') {
      const priorityValid = form.trigger(['priority']);
      if (priorityValid) {
        setActiveTab('photos');
      }
    }
  };

  const prevStep = () => {
    if (activeTab === 'priority') {
      setActiveTab('details');
    } else if (activeTab === 'photos') {
      setActiveTab('priority');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-card animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl">New Maintenance Request</CardTitle>
        <CardDescription>
          Report a maintenance issue in your apartment. The more details you provide, the faster we can address it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="details" className="flex items-center gap-1">
              <span className="rounded-full h-5 w-5 flex items-center justify-center bg-primary/10 text-xs font-medium text-primary">1</span>
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="priority" className="flex items-center gap-1">
              <span className="rounded-full h-5 w-5 flex items-center justify-center bg-primary/10 text-xs font-medium text-primary">2</span>
              <span>Priority</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-1">
              <span className="rounded-full h-5 w-5 flex items-center justify-center bg-primary/10 text-xs font-medium text-primary">3</span>
              <span>Photos</span>
            </TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="animate-fade-up">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Leaking Faucet, Broken Heater" 
                            {...field} 
                            className="form-input"
                          />
                        </FormControl>
                        <FormDescription>
                          A short title describing the issue.
                        </FormDescription>
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
                          <SelectContent className="bg-white">
                            {issueCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Categorizing helps assign the right maintenance personnel.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the issue in detail. When did you first notice it? Is it getting worse? Any relevant details help us resolve it faster."
                            className="resize-none h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be as specific as possible about the issue.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="priority" className="animate-fade-up">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="space-y-6">
                      <FormLabel>Priority Level</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                              field.value === 'low'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => field.onChange('low')}
                          >
                            {field.value === 'low' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="p-2 rounded-full bg-green-100">
                                <Check className="h-5 w-5 text-green-600" />
                              </div>
                              <h3 className="font-medium">Low</h3>
                              <p className="text-xs text-muted-foreground">Non-urgent issues that can be scheduled.</p>
                            </div>
                          </div>
                          
                          <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                              field.value === 'medium'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => field.onChange('medium')}
                          >
                            {field.value === 'medium' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="p-2 rounded-full bg-blue-100">
                                <AlertTriangle className="h-5 w-5 text-blue-600" />
                              </div>
                              <h3 className="font-medium">Medium</h3>
                              <p className="text-xs text-muted-foreground">Issues that need attention soon.</p>
                            </div>
                          </div>
                          
                          <div
                            className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                              field.value === 'high'
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => field.onChange('high')}
                          >
                            {field.value === 'high' && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center gap-2">
                              <div className="p-2 rounded-full bg-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                              </div>
                              <h3 className="font-medium">High</h3>
                              <p className="text-xs text-muted-foreground">Urgent issues requiring immediate attention.</p>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Select the priority level that best describes your issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="photos" className="animate-fade-up">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Upload Photos (Optional)</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add photos of the issue to help us understand the problem better.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {uploadedImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-video rounded-md overflow-hidden border"
                        >
                          <img 
                            src={image} 
                            alt={`Uploaded image ${index + 1}`} 
                            className="object-cover w-full h-full"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-secondary/30 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG or GIF (MAX. 10MB)
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          multiple 
                          onChange={handleImageUpload} 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex justify-between mt-6">
                {activeTab !== 'details' ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {activeTab !== 'photos' ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
