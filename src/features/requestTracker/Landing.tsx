import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { FileText, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { RequestTrackerKPICards } from "./components/RequestTrackerKpiCards";
import { RequestTrackerTable } from "./components/RequestTrackerList";
import { logEvent } from "@shared/analytics/analytics";

// Request interface
interface Request {
  requestId: string;
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
  useEffect(() => {
    logEvent("Request Tracker Viewed");
  }, []);

  const handleViewRequest = (request: Request) => {
    logEvent("Request Details Viewed");
    switch (request.type) {
      case "Complaint":
        navigate(`/complaints/${request.requestId}`);
        break;
      case "Transfer":
        navigate(`/transfer/${request.requestId}`);
        break;
      // case 'Reconnection':
      //   navigate(`/reconnection/${request.id}`);
      //   break;
      case "Disconnect Permanent":
        navigate(`/disconnection/${request.requestId}`);
        break;
      case "Service":
        navigate(`/service-request/${request.requestId}`);
        break;
      default:
        setSelectedRequest(request);
        setDialogOpen(true);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Request Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Monitor the progress of all your service requests, complaints, and
            utility service changes in one centralized location.
          </p>
        </div>
        <Button asChild>
          <Link to="/serviceRequest">
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
          <RequestTrackerTable onViewRequest={handleViewRequest} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTracker;
