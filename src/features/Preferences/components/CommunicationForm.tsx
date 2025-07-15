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

const communicationSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  billingReminders: z.boolean(),
  outageAlerts: z.boolean(),
  usageReports: z.boolean(),
  promotions: z.boolean(),
  contactTime: z.string(),
  frequencyBilling: z.string(),
  frequencyUsage: z.string()
});
type CommunicationFormValues = z.infer<typeof communicationSchema>;
const CommunicationForm = () => {
  const {
    toast
  } = useToast();
  const defaultValues: CommunicationFormValues = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    billingReminders: true,
    outageAlerts: true,
    usageReports: true,
    promotions: false,
    contactTime: 'anytime',
    frequencyBilling: 'weekly',
    frequencyUsage: 'monthly'
  };
  const form = useForm<CommunicationFormValues>({
    resolver: zodResolver(communicationSchema),
    defaultValues
  });
  const onSubmit = (data: CommunicationFormValues) => {
    toast({
      title: 'Preferences Updated',
      description: 'Your communication preferences have been saved.'
    });
    console.log('Form submitted:', data);
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField control={form.control} name="emailNotifications" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                    </FormItem>} />
                
                <FormField control={form.control} name="smsNotifications" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
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
                    </FormItem>} />
                
                <FormField control={form.control} name="pushNotifications" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>App Push Notifications</FormLabel>
                        <FormDescription>
                          Receive push notifications on your device
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>} />
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
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <FormField control={form.control} name="billingReminders" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Billing & Payment Reminders</FormLabel>
                        <FormDescription>
                          Upcoming bills, payment confirmations, and past due reminders
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>} />
                
                <FormField control={form.control} name="outageAlerts" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Service Outage Alerts</FormLabel>
                        <FormDescription>
                          Notifications about outages affecting your service area
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>} />
                
                <FormField control={form.control} name="usageReports" render={({
                field
              }) => <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Usage Reports & Insights</FormLabel>
                        <FormDescription>
                          Regular updates on your consumption patterns and efficiency tips
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>} />
                
                <FormField control={form.control} name="promotions" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Promotional Offers</FormLabel>
                      <FormDescription>
                        Special offers, discounts, and energy efficiency programs
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </div>
              
              <div className="space-y-4 pt-4">
                <FormField control={form.control} name="contactTime" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Preferred Contact Time
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred contact time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="anytime">Anytime</SelectItem>
                        <SelectItem value="morning">Morning (8 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      When would you prefer to receive non-urgent communications?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="frequencyBilling" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Reminder Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing reminder frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often would you like billing reminders before due dates?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="frequencyUsage" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Report Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage report frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How often would you like to receive detailed usage reports?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default CommunicationForm;
