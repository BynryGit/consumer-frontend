import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@shared/ui/form';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select';
import { useToast } from '@shared/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CreditCard, DollarSign, Building, Shield } from 'lucide-react';

const paymentFormSchema = z.object({
  amount: z.string().min(1, { message: "Amount is required" }),
  paymentMethod: z.string().min(1, { message: "Payment method is required" }),
  // Credit card fields
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
  // Bank account fields
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = () => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: '',
      paymentMethod: 'credit-card',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      accountNumber: '',
      routingNumber: '',
    },
  });

  function onSubmit(data: PaymentFormValues) {
    // Simulate payment processing
    toast({
      title: "Payment Processing",
      description: `Processing $${data.amount} payment...`,
    });
    
    // Simulate successful payment after delay
    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Your payment of $${data.amount} was processed successfully.`,
        variant: "default",
      });
      form.reset();
    }, 2000);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
          <CardDescription>
            Choose your preferred payment method and amount.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Amount ($)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="0.00"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setPaymentMethod(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="credit-card">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Credit/Debit Card</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="bank-account">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span>Bank Account</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMethod === 'credit-card' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardCVC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'bank-account' && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Account Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Routing Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button type="submit" className="w-full">Process Payment</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted.</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>
            Important information about your payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Current Balance</h3>
            <p className="text-2xl font-bold text-primary">$78.45</p>
            <p className="text-sm text-muted-foreground">Due on April 15, 2025</p>
          </div>
          
          <div>
            <h3 className="font-medium">Payment Methods</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span>Credit/Debit Cards: Visa, Mastercard, American Express</span>
              </li>
              <li className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>Bank Accounts: Checking or Savings</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium">Processing Time</h3>
            <p className="text-sm">Credit/Debit Card payments process immediately.</p>
            <p className="text-sm">Bank Account payments may take 2-3 business days.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm; 
