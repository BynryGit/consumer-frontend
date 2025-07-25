import React, { useState } from "react";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Tabs } from "@shared/ui/tabs"; // Your shared tab service
import {
  ArrowRightLeft,
  CalendarDays,
  Clock,
  FileText,
  Tag,
  User,
  Hash,
  MessageSquare,
  Send,
  CheckCircle,
  DollarSign,
  Download,
  Eye,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NotesTab, { Note } from "@shared/components/NotesTab";
import TimelineTab, { TimelineItem } from "@shared/components/TimelineTab";
import { getLoginDataFromStorage } from "@shared/utils/loginUtils";
import { useRequestDetail, useAddNote } from "../hooks"; // Added useAddNote import

interface TransferPageProps {
  transferId?: string;
}

const TransferPage = ({ transferId }: TransferPageProps) => {
  const [newNote, setNewNote] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const requestId = params.id;

  const { remoteUtilityId } = getLoginDataFromStorage();
  const { data } = useRequestDetail({
    remote_utility_id: remoteUtilityId,
    id: requestId,
  });

  // Add the useAddNote hook
  const addNoteMutation = useAddNote();

  // Mock data for the transfer details
  const request = {
    id: requestId,
    status: data?.result?.statusDisplay || "NA",
    createdAt: data?.result?.utilitySupportRequest?.createdDate || "NA",
    lastUpdated: data?.result?.lastModifiedDate || "NA",
  };

  const transferDetails = {
    transferType: "Full Ownership Transfer",
    code: data?.result?.utilitySupportRequest?.configurationCode || "NA",
    changeBillingAddress: "Yes",
    description: data?.result?.utilitySupportRequest?.longDescription || "NA",
    financialResponsibility: "Transfer outstanding balance",
    additionalInfo:
      "Transfer required due to property sale. New owner to assume all service responsibilities.",
  };

  // Mock documents data
  const documents =
    data?.result?.additionalData?.document?.map((doc) => ({
      id: doc.id,
      name: doc.documentSubtype,
      type: doc.documentType?.replace("#1", "") || "Unknown",
      uploadedDate: new Date().toISOString(),
      size: "N/A",
      status: "verified",
      file: doc.file,
    })) || [];

  // Mock notes data
  const notes = [
    {
      id: 1,
      author: "Mike Chen (Agent)",
      content:
        "Transfer request processed. All required documents received and under review by verification team.",
      timestamp: "2025-04-01T14:30:00",
      type: "staff",
    },
    {
      id: 2,
      author: "You",
      content:
        "When can I expect the transfer to be completed? The new owner needs service activated urgently.",
      timestamp: "2025-04-01T16:15:00",
      type: "customer",
    },
  ];

  // Mock timeline data
  const timeline = [
    {
      id: 1,
      action: "Transfer Request Submitted",
      description:
        "Customer submitted transfer request with initial documentation",
      timestamp: "2025-04-01T08:20:00",
      status: "completed",
    },
    {
      id: 2,
      action: "Document Verification",
      description:
        "All required documents uploaded and verification process initiated",
      timestamp: "2025-04-01T10:45:00",
      status: "completed",
    },
    {
      id: 3,
      action: "Financial Review",
      description: "Account balance review and transfer arrangements finalized",
      timestamp: "2025-04-02T11:00:00",
      status: "completed",
    },
    {
      id: 4,
      action: "Ownership Transfer Processing",
      description: "Processing ownership change and updating account records",
      timestamp: "2025-04-03T09:10:00",
      status: "current",
    },
    {
      id: 5,
      action: "Service Activation",
      description: "Service activation under new account holder",
      timestamp: "2025-04-04T10:00:00",
      status: "pending",
    },
  ];

  // Updated handleAddNote function to use the API
  const handleAddNote = async (noteContent: string) => {
    if (noteContent.trim() && requestId && remoteUtilityId) {
      const payload = {
        source: 1,
        request_id: parseInt(requestId),
        remote_utility_id: remoteUtilityId,
        notes: {
          note: noteContent.trim(),
        },
      };

      await addNoteMutation.mutateAsync(payload);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Resolved
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            In Progress
          </Badge>
        );
      case "open":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Open
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Closed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Documents Tab Content
  const DocumentsContent = () => (
    <Card className="bg-blue-50/30 border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Uploaded Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border border-gray-200 rounded-lg bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getDocumentStatusBadge(doc.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(doc.file, "_blank")}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Uploaded: {new Date(doc.uploadedDate).toLocaleString()}
              </span>
              <span>Size: {doc.size}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  // Tab configuration for your shared tab service
  const tabComponents = {
    documents: {
      label: "Documents",
      icon: <FileText className="h-4 w-4" />,
      component: <DocumentsContent />,
      count: documents.length,
      shortLabel: "Docs",
    },
    notes: {
      label: "Notes",
      icon: <MessageSquare className="h-4 w-4" />,
      component: (
        <NotesTab
          notes={notes}
          onAddNote={handleAddNote}
          title="Transfer Communication"
          idPrefix="transfer"
          isLoading={addNoteMutation.isPending}
        />
      ),
      count: notes.length,
      shortLabel: "Notes",
    },
    timeline: {
      label: "Timeline",
      icon: <Clock className="h-4 w-4" />,
      component: (
        <TimelineTab
          timeline={timeline}
          title="Transfer Activity Timeline"
          idPrefix="transfer"
        />
      ),
      shortLabel: "Timeline",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate("/request-tracker")}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Requests
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-purple-500" />
                  Service Transfer Request
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
          {/* Transfer Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-purple-50/50 border-purple-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Transfer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Type</p>
                  <p className="font-semibold">
                    {transferDetails.transferType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-semibold">{transferDetails.code}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Change Billing Address
                  </p>
                  <p className="font-semibold">
                    {transferDetails.changeBillingAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50/50 border-green-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Balance
                  </p>
                  <p className="font-semibold text-green-600">$0.00</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Financial Responsibility
                  </p>
                  <p className="font-semibold">
                    {transferDetails.financialResponsibility}
                  </p>
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
              {transferDetails.description}
            </p>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-foreground">
                Additional Information
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {transferDetails.additionalInfo}
            </p>
          </div>

          {/* Tabs Section using your shared tab service */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Tabs
              defaultValue="documents"
              tabComponents={tabComponents}
              urlMapping={{
                documents: "documents",
                notes: "notes",
                timeline: "timeline",
              }}
              tabsListClassName="grid grid-cols-3 w-full"
              tabsListFullWidth={true}
              idPrefix="transfer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
