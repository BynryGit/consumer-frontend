import React, { useState, useMemo } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import NotesTab, { Note } from '@shared/components/NotesTab';
import TimelineTab, { TimelineItem } from '@shared/components/TimelineTab';
import { useRequestDetail, useActivityLog, useAddNote, useNotes } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

interface DisconnectionPageProps {
  DisconnectionPage?: string;
}

const DisconnectionPage = ({DisconnectionPage}: DisconnectionPageProps) => {
  const [newNote, setNewNote] = useState('');
  const params = useParams();
  const navigate = useNavigate();
  const requestId = params.id;

  const { remoteUtilityId } = getLoginDataFromStorage();
  const {data} = useRequestDetail({
      remote_utility_id: remoteUtilityId,
    id: requestId,
  });
  
  // Add the useActivityLog hook
  const { data: activitylog } = useActivityLog({
    remote_utility_id: remoteUtilityId,
    id: requestId, // Use requestId instead of hardcoded value
    module: "cx"
  });
  
  // Add useNotes hook
  const { data: notesData, refetch: refetchNotes } = useNotes({
    remote_utility_id: remoteUtilityId,
    request_id: requestId,
      source:"consumer_web"
  });
  
  // Add the useAddNote hook
  const addNoteMutation = useAddNote();
  
  console.log("disconnection data", data);
  console.log("activity log data", activitylog);
  console.log("notes data", notesData);
  
  // Transform API data to TimelineItem format
  const transformedTimeline: TimelineItem[] = useMemo(() => {
    if (!activitylog?.results) return [];
    
    return activitylog.results.map((item: any, index: number) => ({
      id: item.data?.id || index,
      action: item.title || "Activity",
      description: item.description || "No description available",
      timestamp: item.date && item.time 
        ? `${item.date} ${item.time}` 
        : item.date || new Date().toISOString(),
      status: "completed" // You can add logic here to determine status based on your business rules
    }));
  }, [activitylog]);

  // Transform notes data to notes format
  const notes: Note[] = useMemo(() => {
    if (!notesData?.result) return [];
    
    return notesData.result
      .filter((item: any) => item.isActive) // Only show active notes
      .map((item: any, index: number) => ({
        id: index + 1,
        author: item.createdBy || "",
        content: item.note || "",
        timestamp: item.createdDate ? 
          new Date(item.createdDate).toISOString() :  
          new Date().toISOString(),
      }));
  }, [notesData]);
  
  // Mock data for the disconnection details
  const request = {
    id: requestId,
    status:  data?.result?.statusDisplay ||"NA",
    createdAt: data?.result?.utilitySupportRequest?.createdDate ||"NA",
  };

  const disconnectionDetails = {
    reasonName: 'Relocation Disconnection',
    reasonCode:  data?.result?.utilitySupportRequest?.configurationCode ||"NA",
   preferredDate:  data?.result?.requestDate ||"NA",
    preferredTime: data?.result?.prefferedTimeSlotDisplay ||"NA",
    description:  data?.result?.utilitySupportRequest?.longDescription ||"NA",
    additionalInfo: 'Please ensure final meter reading is taken and all pending bills are settled before disconnection.'
  };

const consumerMappingData = data?.result?.consumer?.consumerMappingData || [];

const serviceInfo: Record<string, any> = {};

consumerMappingData.forEach(service => {
  const serviceType = service?.utilityService?.toLowerCase();
  if (serviceType) {
    serviceInfo[serviceType] = {
      deviceNo: service.meterDetails?.deviceNo || 'N/A',
      meterNo: service.meterDetails?.meterNumber || 'N/A',
      lastReading: service.meterDetails?.lastReading || 'N/A',
      lastReadingDate: service.meterDetails?.lastReadingDate || 'N/A'
    };
  }
});

  // Updated handleAddNote function to use the API and refetch
  const handleAddNote = async (noteContent: string) => {
    if (noteContent.trim() && requestId && remoteUtilityId) {
      const payload = {
        source: 1,
        request_id: parseInt(requestId),
        remote_utility_id: remoteUtilityId,
        notes: {
          note: noteContent.trim()
        }
      };
      
      try {
        await addNoteMutation.mutateAsync(payload);
        // Refetch notes after successfully adding a note
        await refetchNotes();
      } catch (error) {
        console.error('Error adding note:', error);
      }
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
      component: (
        <NotesTab 
          notes={notes} 
          onAddNote={handleAddNote} 
          title="Disconnection Communication" 
          idPrefix="disconnection"
          isLoading={addNoteMutation.isPending}
        />
      ),
      count: notes.length,
      shortLabel: 'Notes'
    },
    timeline: {
      label: 'Timeline',
      icon: <Clock className="h-4 w-4" />,
      component: (
        <TimelineTab
          timeline={transformedTimeline}
          title="Disconnection Activity Timeline"
          idPrefix="disconnection"
        />
      ),
      shortLabel: 'Timeline',
      count: transformedTimeline.length,
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
                  <p className="font-semibold">{request.createdAt}</p>
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
  {Object.entries(serviceInfo).map(([serviceType, info]) => (
    <Card key={serviceType} className={`bg-blue-50/30 border-blue-100`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {serviceType === 'water' && <Droplets className="h-5 w-5 text-blue-600" />}
          {serviceType === 'electricity' && <Zap className="h-5 w-5 text-yellow-600" />}
          {serviceType === 'hot water' && <Droplets className="h-5 w-5 text-red-600" />}
          {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Device No</p>
            <p className="font-semibold">{info.deviceNo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Meter No</p>
            <p className="font-semibold">{info.meterNo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Reading</p>
            <p className="font-semibold">{info.lastReading}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reading Date</p>
            <p className="font-semibold">{info.lastReadingDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
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
             tabsListClassName="grid grid-cols-2 w-full"
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