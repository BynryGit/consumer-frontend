import React, { useState, useMemo } from 'react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Textarea } from '@shared/ui/textarea';
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Tabs } from '@shared/ui/tabs'; // Your shared tab service
import { 
  CalendarDays, 
  Clock,  
  DollarSign, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  Hash, 
  FileText, 
  Tag, 
  User, 
  CreditCard, 
  Info, 
  AlertTriangle,
  ArrowLeft,
  MoreVertical,
  Wrench
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import NotesTab, { Note } from '@shared/components/NotesTab';
import TimelineTab, { TimelineItem } from '@shared/components/TimelineTab';
import { useRequestDetail, useActivityLog, useAddNote, useNotes } from '../hooks';

interface ServiceRequestPageProps {
  serviceId?: string;
}

const ServiceRequestPage = ({ serviceId }: ServiceRequestPageProps) => {
  const [newNote, setNewNote] = useState('');
   const params = useParams();
   const navigate = useNavigate();
   const requestId = params.id;
 
   const { remoteUtilityId } = getLoginDataFromStorage();
   const { data } = useRequestDetail({
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
   
   console.log("service request data", data);
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

  // Mock data for the service request details
  const request = {
    id: requestId,
    status:  data?.result?.statusDisplay ||"NA",
    createdAt: data?.result?.utilitySupportRequest?.createdDate ||"NA",
    lastUpdated: data?.result?.lastModifiedDate ||"NA",
  };  

  const serviceDetails = {
    serviceName: data?.result?.utilitySupportRequest?.name ||"NA",
    serviceCode: data?.result?.utilitySupportRequest?.configurationCode ||"NA",
  category: data?.result?.utilitySupportRequest?.supportRequestType ||"NA",
    subCategory: data?.result?.utilitySupportRequest?.supportRequestSubtype ||"NA",
    serviceDescription:  data?.result?.utilitySupportRequest?.longDescription ||"NA",
    additionalInfo: 'Please ensure access to main electrical panel is available during service visit',
    preferredDate:  data?.result?.requestDate ||"NA",
    preferredTime: data?.result?.prefferedTimeSlotDisplay ||"NA",
    serviceFees:  data?.result?.utilitySupportRequest?.extraData?.serviceCharge ||"NA",
    paymentStatus: data?.result?.additionalData?.transactionStatusDisplay ||"NA",
    rejectionReason: request.status === 'rejected' ? 'Service request rejected due to incomplete documentation. Please provide proof of property ownership and electrical permit before resubmitting.' : null
  };

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
      case 'in_progress':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
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
          title="Service Request Communication" 
          idPrefix="service-request"
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
          title="Request Activity Timeline"
          idPrefix="service-request"
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
                  <Wrench className="h-5 w-5 text-blue-500" />
                  {serviceDetails.serviceName}
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
          {/* Service Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Service Code</p>
                  <p className="font-semibold">{serviceDetails.serviceCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">{request.createdAt}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50/50 border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Classification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">{serviceDetails.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sub Category</p>
                  <p className="font-semibold">{serviceDetails.subCategory}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/50 border-orange-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Service Fees</p>
                  <p className="font-semibold text-lg">{serviceDetails.serviceFees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  {getPaymentStatusBadge(serviceDetails.paymentStatus)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Description */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">Service Description</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {serviceDetails.serviceDescription}
            </p>
          </div>

          {/* Scheduling Information */}
          {request.status !== 'rejected' && (
            <Card className="bg-purple-50/50 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Scheduled Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-purple-200">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Date</p>
                      <p className="font-semibold">{serviceDetails.preferredDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-purple-200">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Preferred Time</p>
                      <p className="font-semibold">{serviceDetails.preferredTime}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 rounded-lg border border-purple-200 p-3">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Additional Information</p>
                  <p className="text-sm text-foreground">{serviceDetails.additionalInfo}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason - Only show if status is rejected */}
          {request.status === 'rejected' && serviceDetails.rejectionReason && (
            <Card className="bg-red-50/50 border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-5 w-5" />
                  Request Rejected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/60 rounded-lg border border-red-200 p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Rejection Reason</p>
                  <p className="text-sm text-foreground leading-relaxed">{serviceDetails.rejectionReason}</p>
                </div>
              </CardContent>
            </Card>
          )}

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
              idPrefix="service"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestPage;