
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { CreditCard, Receipt, Wrench, AlertTriangle, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleServiceRequest = () => {
    // Simulate service request submission
    const requestId = 'SR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    navigate('/service/success', { 
      state: { 
        type: 'service',
        id: requestId,
        data: { priority: 'standard', category: 'general' }
      } 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/billing">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Bill
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Receipt className="mr-2 h-4 w-4" />
          Download Latest Bill
        </Button>
        <Button variant="outline" className="w-full justify-start" onClick={handleServiceRequest}>
          <Wrench className="mr-2 h-4 w-4" />
          Request Service
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/service/complaint">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Register Complaint
          </Link>
        </Button>
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link to="/service/tracker">
            <Search className="mr-2 h-4 w-4" />
            Track Request
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
