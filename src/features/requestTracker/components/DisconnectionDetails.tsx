import React, { useState } from 'react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs } from '@shared/ui/tabs'; // Your shared tab service
import { 
  PowerOff, 
  CalendarDays, 
  Clock, 
  FileText, 
  Tag, 
  User, 
  Hash, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Zap, 
  Droplets,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotesTab, { Note } from '@shared/components/NotesTab';
import TimelineTab, { TimelineItem } from '@shared/components/TimelineTab';

interface DisconnectionPageProps {
  requestId?: string;
}

const DisconnectionPage = ({ requestId = "DIS-2025-0408" }: DisconnectionPageProps) => {
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  // Mock data for the disconnection details
  const request = {
    id: requestId,
    subject: 'Relocation Disconnection',
    status: 'waiting',
    createdAt: '2025-04-08T14:30:00',
    lastUpdated: '2025-04-08T16:45:00'
  };

  const disconnectionDetails = {
    reasonName: 'Relocation Disconnection',
    reasonCode: 'REL-001',
    preferredDate: '2025-04-15',
    preferredTime: '10:00 AM - 12:00 PM',
    description: 'Customer relocating to new property and requires service disconnection at current address.',
    additionalInfo: 'Please ensure final meter reading is taken and all pending bills are settled before disconnection.'
  };

  // Mock service information
  const serviceInfo = {
    water: {
      deviceNo: 'WD-789456',
      meterNo: 'WM-123789',
      lastReading: '2,450 gallons',
      lastReadingDate: '2025-04-01'
    },
    electricity: {
      deviceNo: 'ED-456123',
      meterNo: 'EM-987654',
      lastReading: '1,850 kWh',
      lastReadingDate: '2025-04-01'
    }
  };

  // Mock notes data
  const notes = [
    {
      id: 1,
      author: 'Mike Chen (Agent)',
      content: 'Disconnection request received and validated. Scheduling final meter reading.',
      timestamp: '2025-04-08T15:30:00',
      type: 'staff'
    },
    {
      id: 2,
      author: 'You',
      content: 'Please confirm the final reading date as I need to plan my moving schedule accordingly.',
      timestamp: '2025-04-08T16:45:00',
      type: 'customer'
    }
  ];

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      action: 'Disconnection Request Submitted',
      description: 'Customer submitted disconnection request for relocation',
      timestamp: '2025-04-08T14:30:00',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Request Validation',
      description: 'Customer service team validated request details',
      timestamp: '2025-04-08T15:00:00',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Final Reading Scheduled',
      description: 'Final meter reading appointment scheduled',
      timestamp: '2025-04-08T15:30:00',
      status: 'current'
    },
    {
      id: 4,
      action: 'Service Disconnection',
      description: 'Physical disconnection of water and electricity services',
      timestamp: '2025-04-15T11:00:00',
      status: 'pending'
    },
    {
      id: 5,
      action: 'Final Settlement',
      description: 'Final bill processing and account closure',
      timestamp: '2025-04-20T17:00:00',
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
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      case 'waiting':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Waiting</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Tab configuration for your shared tab service
  const tabComponents = {
    notes: {
      label: 'Notes',
      icon: <MessageSquare className="h-4 w-4" />,
      component: <NotesTab notes={notes} onAddNote={handleAddNote} title="Disconnection Communication" idPrefix="disconnection" />,
      count: notes.length,
      shortLabel: 'Notes'
    },
    timeline: {
      label: 'Timeline',
      icon: <Clock className="h-4 w-4" />,
      component: <TimelineTab timeline={timeline} title="Disconnection Activity Timeline" idPrefix="disconnection" />,
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
                  <PowerOff className="h-5 w-5 text-orange-500" />
                  {disconnectionDetails.reasonName}
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
          {/* Disconnection Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-orange-50/50 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Reason Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-semibold">{disconnectionDetails.reasonName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason Code</p>
                  <p className="font-semibold">{disconnectionDetails.reasonCode}</p>
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
                  <p className="font-semibold">{disconnectionDetails.preferredDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Time</p>
                  <p className="font-semibold">{disconnectionDetails.preferredTime}</p>
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
              {disconnectionDetails.description}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Additional Information</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {disconnectionDetails.additionalInfo}
            </p>
          </div>

          {/* Service Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50/30 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Water Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Device No</p>
                    <p className="font-semibold">{serviceInfo.water.deviceNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meter No</p>
                    <p className="font-semibold">{serviceInfo.water.meterNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Reading</p>
                    <p className="font-semibold">{serviceInfo.water.lastReading}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reading Date</p>
                    <p className="font-semibold">{serviceInfo.water.lastReadingDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50/30 border-yellow-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Electricity Service
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Device No</p>
                    <p className="font-semibold">{serviceInfo.electricity.deviceNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meter No</p>
                    <p className="font-semibold">{serviceInfo.electricity.meterNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Reading</p>
                    <p className="font-semibold">{serviceInfo.electricity.lastReading}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reading Date</p>
                    <p className="font-semibold">{serviceInfo.electricity.lastReadingDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              idPrefix="disconnection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisconnectionPage;