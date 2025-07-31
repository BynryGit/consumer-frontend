import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import { DollarSign, FileText, Wrench } from 'lucide-react';

interface CreditApplication {
  dateApplied: string;
  type: 'Bill' | 'Service';
  reference: string;
  description: string;
  amount: number;
  appliedBy: string;
}

interface CreditNoteDialogProps {
  creditNote: {
    id: string;
    consumer: string;
    consumerId: string;
    amount: number;
    remaining: number;
    reason: string;
    status: string;
    createdDate: string;
    linkedPayment: string;
    isPaymentConsiled: boolean; // Added this field
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const CreditNoteDialog = ({ creditNote, isOpen, onClose }: CreditNoteDialogProps) => {
  if (!creditNote) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Active</Badge>;
      case 'Applied':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Applied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch(type) {
      case 'Bill':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Bill
        </Badge>;
      case 'Service':
        return <Badge className="bg-teal-100 text-teal-800 border-teal-200 flex items-center gap-1">
          <Wrench className="h-3 w-3" />
          Service
        </Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // New logic based on isPaymentConsiled
  const appliedAmount = creditNote.isPaymentConsiled ? creditNote.amount : 0;
  const remainingBalance = creditNote.isPaymentConsiled ? 0 : creditNote.amount;
  const usagePercentage = creditNote.isPaymentConsiled ? '100.0' : '0.0';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Credit Note Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about credit note {creditNote.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Financial Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Original Credit Amount</label>
                  <p className="text-2xl font-bold text-green-600">${creditNote.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Remaining Balance</label>
                  <p className="text-2xl font-bold text-green-600">${remainingBalance}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied Amount</label>
                  <p className="text-lg font-semibold text-blue-600">
                    ${appliedAmount}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Usage Percentage</label>
                  <p className="text-lg font-semibold">{usagePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Credit Note Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Credit Note Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p className="text-sm font-semibold mt-1">{creditNote.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created By</label>
                  <p className="text-sm font-semibold mt-1">{creditNote.consumer}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Linked Payment</label>
                  <p className="text-sm font-mono font-semibold mt-1 text-blue-600">
                    {creditNote.linkedPayment}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-2">{getStatusBadge(creditNote.status)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

         
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteDialog;