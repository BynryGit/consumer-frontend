import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@shared/hooks/use-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Switch } from '@shared/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { Bell, Mail, Phone, Save, Clock } from 'lucide-react';
import { useAddPreferences } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';


const communicationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  billingReminders: z.boolean(),
  outageAlerts: z.boolean(),
  usageReports: z.boolean(),
});

type CommunicationFormValues = z.infer<typeof communicationSchema>;

const CommunicationForm = () => {
    const { consumerId } = getLoginDataFromStorage();
  const { toast } = useToast();
  const updatePreferencesMutation = useAddPreferences();

  const defaultValues: CommunicationFormValues = {
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    billingReminders: false,
    outageAlerts: false,
    usageReports: false,
  };

  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationSchema),
    defaultValues
  });

  // Helper function to map form data to API payload
  const transformFormDataToPayload = (data: CommunicationFormValues) => {
    // Map communication channels
    const communication: string[] = [];
    if (data.emailNotifications) communication.push("email");
    if (data.smsNotifications) communication.push("phone");
    if (data.pushNotifications) communication.push("push");



    return {
      additional_data: {
        communication,
        preferences: {
          is_billing_and_payment: data.billingReminders,
          is_service_outage: data.outageAlerts,
          is_usage_insights: data.usageReports,
        },
      }
    };
  };

  const onSubmit = async (data: CommunicationFormValues) => {
    const payload = transformFormDataToPayload(data);
    
    console.log('Form submitted:', data);
    console.log('API Payload:', payload);

    // Call the API
    await updatePreferencesMutation.mutateAsync({
      id: consumerId,
      payload
    });

    toast({
      title: 'Preferences Updated',
      description: 'Your communication preferences have been saved.'
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Communication Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="space-y-4">
                <FormField 
                  control={form.control} 
                  name="emailNotifications" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive notifications and alerts via email
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="smsNotifications" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          SMS Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive text messages for important notifications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="pushNotifications" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>App Push Notifications</FormLabel>
                        <FormDescription>
                          Receive push notifications on your device
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
              <div className="space-y-4">
                <FormField 
                  control={form.control} 
                  name="billingReminders" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Billing & Payment Reminders</FormLabel>
                        <FormDescription>
                          Upcoming bills, payment confirmations, and past due reminders
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="outageAlerts" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Service Outage Alerts</FormLabel>
                        <FormDescription>
                          Notifications about outages affecting your service area
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
                
                <FormField 
                  control={form.control} 
                  name="usageReports" 
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Usage Reports & Insights</FormLabel>
                        <FormDescription>
                          Regular updates on your consumption patterns and efficiency tips
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="ml-auto flex items-center gap-2 mt-4"
                disabled={updatePreferencesMutation.isPending}
              >
                <Save className="h-4 w-4 " />
                {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CommunicationForm;