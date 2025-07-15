import React, { useState } from 'react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs } from '@shared/ui/tabs'; // Your shared tab service
import { 
  Power, 
  CalendarDays, 
  Clock, 
  FileText, 
  Tag, 
  User, 
  Hash, 
  MessageSquare, 
  Send, 
  CheckCircle,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotesTab, { Note } from '@shared/components/NotesTab';
import TimelineTab, { TimelineItem } from '@shared/components/TimelineTab';

interface ReconnectionPageProps {
  requestId?: string;
}

const ReconnectionPage = ({ requestId = "REC-2025-0404" }: ReconnectionPageProps) => {
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  // Mock data for the reconnection details
  const request = {
    id: requestId,
    subject: 'Payment Cleared Reconnection',
    status: 'in_progress',
    createdAt: '2025-04-03T11:30:00',
    lastUpdated: '2025-04-04T11:15:00'
  };

  const reconnectionDetails = {
    reasonName: 'Payment Cleared Reconnection',
    reasonCode: 'PAY-001',
    preferredDate: '2025-04-05',
    preferredTime: '9:00 AM - 11:00 AM',
    description: 'Reconnection request after payment clearance and account settlement.',
    additionalInfo: 'Service reconnection required urgently for business operations.'
  };

  // Mock notes data
  const notes = [
    {
      id: 1,
      author: 'Sarah Johnson (Agent)',
      content: 'Payment verification completed. Scheduling reconnection team for service restoration.',
      timestamp: '2025-04-04T10:30:00',
      type: 'staff'
    },
    {
      id: 2,
      author: 'You',
      content: 'Please confirm the exact time of reconnection as we need to coordinate access.',
      timestamp: '2025-04-04T11:15:00',
      type: 'customer'
    }
  ];

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      action: 'Reconnection Request Submitted',
      description: 'Customer submitted reconnection request after payment clearance',
      timestamp: '2025-04-03T11:30:00',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Payment Verification',
      description: 'Finance team verified payment and account settlement',
      timestamp: '2025-04-03T14:00:00',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Reconnection Scheduled',
      description: 'Field team scheduled for service reconnection',
      timestamp: '2025-04-04T09:00:00',
      status: 'completed'
    },
    {
      id: 4,
      action: 'Service Reconnection',
      description: 'Physical reconnection of utility services',
      timestamp: '2025-04-04T15:45:00',
      status: 'current'
    },
    {
      id: 5,
      action: 'Service Activation',
      description: 'Service activation and billing resumption',
      timestamp: '2025-04-05T09:00:00',
      status: 'pending'
    }
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Tab configuration for your shared tab service
  const tabComponents = {
    notes: {
      label: 'Notes',
      icon: <MessageSquare className="h-4 w-4" />,
      component: <NotesTab notes={notes} onAddNote={handleAddNote} title="Reconnection Communication" idPrefix="reconnection" />,
      count: notes.length,
      shortLabel: 'Notes'
    },
    timeline: {
      label: 'Timeline',
      icon: <Clock className="h-4 w-4" />,
      component: <TimelineTab timeline={timeline} title="Reconnection Activity Timeline" idPrefix="reconnection" />,
      shortLabel: 'Timeline'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => navigate('/request-tracker')}>
                <ArrowLeft className="h-4 w-4" />
                Back to Requests
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Power className="h-5 w-5 text-green-500" />
                  {reconnectionDetails.reasonName}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {request.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(request.status)}
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Reconnection Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Reason Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-semibold">{reconnectionDetails.reasonName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason Code</p>
                  <p className="font-semibold">{reconnectionDetails.reasonCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 border-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Schedule Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Date</p>
                  <p className="font-semibold">{reconnectionDetails.preferredDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Time</p>
                  <p className="font-semibold">{reconnectionDetails.preferredTime}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Description</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reconnectionDetails.description}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Additional Information</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {reconnectionDetails.additionalInfo}
            </p>
          </div>

          {/* Tabs Section using your shared tab service */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Tabs
              defaultValue="notes"
              tabComponents={tabComponents}
              urlMapping={{
                notes: 'notes',
                timeline: 'timeline'
              }}
              tabsListClassName="mb-6"
              tabsListFullWidth={true}
              idPrefix="reconnection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReconnectionPage;