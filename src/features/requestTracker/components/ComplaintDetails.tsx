import React, { useState } from 'react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs } from '@shared/ui/tabs'; // Your shared tab service
import { 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  MessageSquare, 
  Send, 
  Hash, 
  FileText, 
  Tag, 
  User, 
  Paperclip, 
  CheckCircle, 
  Download, 
  Eye, 
  Image, 
  File,
  ArrowLeft,
  MoreVertical
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import NotesTab, { Note } from '@shared/components/NotesTab';
import TimelineTab, { TimelineItem } from '@shared/components/TimelineTab';

interface ComplaintPageProps {
  complaintId?: string;
}

const ComplaintPage = ({ complaintId }: ComplaintPageProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const idFromUrl = params.id;
  const [newNote, setNewNote] = useState('');

  // Mock data for the complaint details
  const complaintDetails = {
    id: idFromUrl || complaintId || "REQ-2025-0408",
    subject: 'Billing Dispute Resolution',
    status: 'in_progress',
    createdAt: '2025-04-08T14:30:00',
    lastUpdated: '2025-04-08T16:45:00',
    complaintName: 'Billing Dispute Resolution',
    complaintCode: 'BD-2025-0408',
    category: 'Billing',
    subCategory: 'Overcharge Dispute',
    incidentDate: '2025-04-05',
    description: 'Customer reporting unexpectedly high charges on March billing statement despite normal usage patterns.',
    expectedResolution: 'Resolution expected within 5-7 business days after billing records review is completed.'
  };

  // Mock evidence data
  const evidenceFiles = [
    {
      id: 1,
      name: 'March_2025_Bill_Statement.pdf',
      type: 'file',
      size: '245 KB',
      uploadedAt: '2025-04-08T14:30:00',
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400'
    },
    {
      id: 2,
      name: 'Meter_Reading_Photo.jpg',
      type: 'image',
      size: '1.2 MB',
      uploadedAt: '2025-04-08T14:35:00',
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400'
    },
    {
      id: 3,
      name: 'Previous_Bills_Comparison.xlsx',
      type: 'file',
      size: '89 KB',
      uploadedAt: '2025-04-08T14:40:00',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'
    },
    {
      id: 4,
      name: 'Usage_Pattern_Screenshot.png',
      type: 'image',
      size: '456 KB',
      uploadedAt: '2025-04-08T14:45:00',
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'
    }
  ];

  // Mock notes data
  const notes = [
    {
      id: 1,
      author: 'Sarah Johnson (Agent)',
      content: 'Initial review completed. Escalating to billing department for detailed analysis.',
      timestamp: '2025-04-08T15:30:00',
      type: 'staff'
    },
    {
      id: 2,
      author: 'You',
      content: 'Please expedite the review as this is affecting my monthly budget planning.',
      timestamp: '2025-04-08T16:45:00',
      type: 'customer'
    }
  ];

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      action: 'Complaint Filed',
      description: 'Customer submitted billing dispute complaint',
      timestamp: '2025-04-08T14:30:00',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Initial Review',
      description: 'Customer service agent conducted preliminary assessment',
      timestamp: '2025-04-08T15:00:00',
      status: 'completed'
    },
    {
      id: 3,
      action: 'Department Assignment',
      description: 'Case escalated to billing department for detailed review',
      timestamp: '2025-04-08T15:30:00',
      status: 'current'
    },
    {
      id: 4,
      action: 'Investigation',
      description: 'Billing records and usage analysis',
      timestamp: '2025-04-09T09:00:00',
      status: 'pending'
    },
    {
      id: 5,
      action: 'Resolution',
      description: 'Final decision and corrective action',
      timestamp: '2025-04-12T17:00:00',
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
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleFileDownload = (file: typeof evidenceFiles[0]) => {
    console.log('Downloading file:', file.name);
  };

  const handleFilePreview = (file: typeof evidenceFiles[0]) => {
    console.log('Previewing file:', file.name);
  };

  // Evidence & Attachments Tab Content
  const EvidenceContent = () => (
    <Card className="bg-green-50/30 border-green-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Evidence & Attachments ({evidenceFiles.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evidenceFiles.map(file => (
            <div key={file.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {file.type === 'image' ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center">
                      <File className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{file.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {file.size} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleFilePreview(file)} className="h-8 px-3">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)} className="h-8 px-3">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Tab configuration for your shared tab service
  const tabComponents = {
    evidence: {
      label: 'Evidence & Attachments',
      icon: <Paperclip className="h-4 w-4" />,
      component: <EvidenceContent />,
      count: evidenceFiles.length,
      shortLabel: 'Evidence'
    },
    notes: {
      label: 'Notes',
      icon: <MessageSquare className="h-4 w-4" />,
      component: <NotesTab notes={notes} onAddNote={handleAddNote} title="Complaint Communication" idPrefix="complaint" />,
      count: notes.length,
      shortLabel: 'Notes'
    },
    timeline: {
      label: 'Timeline',
      icon: <Clock className="h-4 w-4" />,
      component: <TimelineTab timeline={timeline} title="Complaint Activity Timeline" idPrefix="complaint" />,
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
                <h1 className="text-lg font-semibold text-gray-900">
                  {complaintDetails.complaintName}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  {complaintDetails.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(complaintDetails.status)}
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
          {/* Complaint Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-red-50/50 border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Complaint Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Complaint Code</p>
                  <p className="font-semibold">{complaintDetails.complaintCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">{new Date(complaintDetails.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/50 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{complaintDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sub Category</p>
                  <p className="font-semibold">{complaintDetails.subCategory}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/50 border-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Incident Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="font-semibold">{complaintDetails.incidentDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{new Date(complaintDetails.lastUpdated).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complaint Description */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Complaint Description</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {complaintDetails.description}
            </p>
          </div>

          {/* Expected Resolution */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Expected Resolution</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {complaintDetails.expectedResolution}
            </p>
          </div>

          {/* Tabs Section using your shared tab service */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Tabs
              defaultValue="evidence"
              tabComponents={tabComponents}
              urlMapping={{
                evidence: 'evidence',
                notes: 'notes', 
                timeline: 'timeline'
              }}
              tabsListClassName="mb-6"
              tabsListFullWidth={true}
              idPrefix="complaint"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;