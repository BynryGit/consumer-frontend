import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { CreditCard, Receipt, Wrench, AlertTriangle, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDownloadBillTemplate } from '@features/billingPayment/hooks';
import { useToast } from '@shared/hooks/use-toast';


const QuickActions = ({ consumerBillData }) => {
  const { toast } = useToast(); 
  const navigate = useNavigate();
  const downloadBillTemplate = useDownloadBillTemplate();
console.log("billlllllDownloadID",consumerBillData)
  const handleDownloadLatestBill = () => {
    // Get the first bill from the array (most recent)
    const latestBill = consumerBillData?.result?.billData?.[0];
    
    if (!latestBill) {
      return; // No bills available - do nothing
    }

    downloadBillTemplate.mutate({
      billId: latestBill.id,
    }, {
      onSuccess: () => {
toast({
  title: "Success!",
  description: "Bill downloaded successfully",
});
      },
      onError: (error) => {
    toast({
  title: "Download Failed", 
  description: "Failed to download bill. Please try again.",
  variant: "destructive"
});
      }
    });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Bill
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleDownloadLatestBill}
        >
          <Receipt className="mr-2 h-4 w-4" />
          Download Latest Bill
        </Button>
         <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/service/newservice">
           <Wrench className="mr-2 h-4 w-4" />
           Request Service
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/service/complaint">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Register Complaint
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/request-tracker">
            <Search className="mr-2 h-4 w-4" />
            Track Request
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;