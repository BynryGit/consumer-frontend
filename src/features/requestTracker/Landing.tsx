import React, { useState } from 'react';

import { 
  Card,  
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import {    
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@shared/ui/dialog';
import { 
  FileText, 
  ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { RequestTrackerKPICards } from './components/RequestTrackerKpiCards';
import { RequestTrackerTable } from './components/RequestTrackerList';
import ComplaintPage from './components/ComplaintDetails';


// Request interface
interface Request {
  id: string;
  subject: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
  lastUpdated: string;
}

const RequestTracker = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewRequest = (request: Request) => {
    switch (request.type) {
      case 'complaint':
        navigate(`/complaints/${request.id}`);
        break;
      case 'transfer':
        navigate(`/transfer/${request.id}`);
        break;
      case 'reconnection':
        navigate(`/reconnection/${request.id}`);
        break;
      case 'disconnection':
        navigate(`/disconnection/${request.id}`);
        break;
      case 'service':
        navigate(`/service-request/${request.id}`);
        break;
      default:
        setSelectedRequest(request);
        setDialogOpen(true);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Open</span>;
      case 'in_progress':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
      case 'waiting':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Waiting</span>;
      case 'resolved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'closed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Closed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const renderDialog = () => {
    if (!selectedRequest) return null;

    switch (selectedRequest.type) {
      case 'service':
        return <ComplaintPage  />;
      case 'complaint':
        return <ComplaintPage />;
      case 'disconnection':
        return <ComplaintPage />;
      case 'reconnection':
        return <ComplaintPage />;
      case 'transfer':
        return <ComplaintPage  />;
      default:
        return (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Details
              </DialogTitle>
              <DialogDescription>Request ID: {selectedRequest.id}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="mt-1">{selectedRequest.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1 capitalize">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className="mt-1 capitalize">{selectedRequest.priority}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created</p>
                  <p className="mt-1">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="mt-1">{new Date(selectedRequest.lastUpdated).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
                <Button>
                  Update Request
                </Button>
              </div>
            </div>
          </DialogContent>
        );
    }
  };

  return (

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2">
              <Link to="/service">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Service Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Request Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Monitor the progress of all your service requests, complaints, and utility service changes in one centralized location.
            </p>
          </div>
          <Button asChild>
            <Link to="/service/new">
              <FileText className="mr-2 h-4 w-4" />
              New Request
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <RequestTrackerKPICards />
        
        {/* Requests Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="pb-2">Service Requests</CardTitle>
            <CardDescription>
              View and track the status of all your service requests
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <RequestTrackerTable 
              onViewRequest={handleViewRequest}
            />
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {renderDialog()}
        </Dialog>
      </div>
    
  );
};

export default RequestTracker;