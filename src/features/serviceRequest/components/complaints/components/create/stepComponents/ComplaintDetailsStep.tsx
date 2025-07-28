// ComplaintDetailsStep.tsx
// import { useComplaintConfigurations } from "@features/cx/complaints/hooks";
import { useComplaintConfigurations } from "@features/serviceRequest/hooks";
import { StepHelpers } from "@shared/components/Stepper";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';

interface ComplaintDetailsStepProps {
  remoteUtilityId: number;
  storageKey: string;
  stepHelpers?: StepHelpers;
  currentStepIndex?: number;
  onNext?: () => void;
  onPrevious?: () => void;
  setValidationError?: (error: string) => void;
  clearValidationError?: () => void;
  isValidating?: boolean;
}

export function ComplaintDetailsStep({
  storageKey,
  stepHelpers,
  currentStepIndex = 1,
  onNext,
  onPrevious,
  setValidationError,
  clearValidationError,
  isValidating,
}: ComplaintDetailsStepProps) {
    const { remoteUtilityId, remoteConsumerNumber } = getLoginDataFromStorage();
  const [searchTerm, setSearchTerm] = useState("");

  // Use the utility request configuration hook
  const {
    data: complaintConfigs,
    isLoading,
    error,
  } = useComplaintConfigurations(remoteUtilityId);

  // Get selected complaint from step helpers
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  // Load saved complaint selection on component mount
  useEffect(() => {
    if (stepHelpers) {
      const savedData = stepHelpers.getStepData(currentStepIndex);
      if (savedData?.selectedComplaint) {
        setSelectedComplaint(savedData.selectedComplaint);
        console.log("Loaded saved complaint:", savedData.selectedComplaint);
      }
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to assign colors based on complaint type
  const getComplaintColor = (complaintType: string[]): string => {
    const colorMap: Record<string, string> = {
      water: "blue",
      wastewater: "brown",
      metering: "green",
      connection: "green",
      maintenance: "blue",
      repair: "red",
      emergency: "red",
      inspection: "purple",
      testing: "purple",
      installation: "green",
      replacement: "orange",
      upgrade: "blue",
      transfer: "yellow",
      temporary: "orange",
      routine: "green",
      preventative: "blue",
      equipment: "purple",
    };

    for (const [key, color] of Object.entries(colorMap)) {
      if (complaintType.includes(key)) {
        return color;
      }
    }
    return "blue"; // default color
  };

  // Transform API data to match component expectations
  const transformedComplaints = useMemo(() => {
    return (
      complaintConfigs?.map((config) => ({
        id: String(config.configurationCode || config.id),
        name: config.name,
        description: config.longDescription || config.supportRequestTypeDisplay,
        severityLevel: config.extraData?.severityLevelDisplay,
        color: getComplaintColor(config.productCode),
        utilityComplaint: config.productCode.join(", "),
        complaintType: config.supportRequestTypeDisplay,
        category: config.supportRequestTypeDisplay,
        productCode: config.productCode,
        ...config,
      })) || []
    );
  }, [complaintConfigs]);

  const handleComplaintSelect = (complaint: any) => {
    console.log("Complaint being selected:", complaint);
    setSelectedComplaint(complaint);

    // Save selected complaint using step helpers
    if (stepHelpers) {
      const stepData = {
        selectedComplaint: complaint,
        complaintId: complaint.id,
        complaintName: complaint.name,
        complaintCharge: complaint.price,
        complaintType: complaint.complaintType,
        utilityComplaint: complaint.utilityComplaint,
        productCode: complaint.productCode,
        timestamp: new Date().toISOString(),
        stepIndex: currentStepIndex,
        version: complaint.version,
      };

      stepHelpers.setStepData(currentStepIndex, stepData);
    }

    toast.success(`Complaint "${complaint.name}" selected successfully`);
  };

  // Check if a complaint is selected
  const isComplaintSelected = (complaintId: string | number) => {
    const result =
      selectedComplaint && String(selectedComplaint.id) === String(complaintId);
    console.log("Checking selection:", {
      selectedComplaintId: selectedComplaint?.id,
      complaintId,
      result,
    });
    return result;
  };

  const handleNext = () => {
    if (!selectedComplaint) {
      toast.error("Please select a complaint to continue");
      return;
    }
    onNext();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-destructive">
            Error loading complaints. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">
          Browse all available complaints and select the one you need.
        </p>
        {selectedComplaint && (
          <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm font-medium text-primary">
              Selected: {selectedComplaint.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Complaint Charge: $
              {(Number(selectedComplaint.price) || 0).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Complaint Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedComplaints.map((complaint) => (
            <Card
              key={complaint.id}
              className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                isComplaintSelected(complaint.id)
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
                  : `border-l-${complaint.color}-500`
              }`}
              onClick={() => handleComplaintSelect(complaint)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    {complaint.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs capitalize">
                    {complaint.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {complaint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-2xl font-bold text-primary">
                      {complaint.severityLevel}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Severity Level
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      isComplaintSelected(complaint.id) ? "default" : "outline"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComplaintSelect(complaint);
                    }}
                  >
                    {isComplaintSelected(complaint.id) ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && transformedComplaints.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No complaints found matching your search criteria."
              : "No complaints available at the moment."}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedComplaint}>
          Continue to Details
        </Button>
      </div>
    </div>
  );
}
