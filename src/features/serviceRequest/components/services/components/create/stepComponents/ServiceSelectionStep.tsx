
import { useUtilityRequestConfiguration } from "@features/serviceRequest/hooks";
import { useGlobalUserProfile } from "@shared/hooks/useGlobalUser";
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
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface ServiceSelectionStepProps {
  remoteUtilityId: number;
  storageKey: string;
  onNext: () => void;
  onPrevious: () => void;
  stepHelpers?: {
    getStepData: (stepIndex: number) => any;
    setStepData: (stepIndex: number, data: any) => void;
  };
  currentStepIndex?: number;
}

export const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  remoteUtilityId,
  storageKey,
  onNext,
  onPrevious,
  stepHelpers,
  currentStepIndex = 1, // Default to step 1 for service selection
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Use the utility request configuration hook
  const {
    data: serviceConfigs,
    isLoading,
    error,
  } = useUtilityRequestConfiguration({
    remoteUtilityId,
    requestType: "Service",
    disablePagination: true, // Get all services without pagination
    searchData: searchTerm || undefined,
  });

  // Get selected service from step helpers
  const [selectedService, setSelectedService] = useState<any>(null);
  const { data: userProfile } = useGlobalUserProfile();
    const currency = userProfile?.utility?.tenant?.currency?.toString() ?? null;
  // const currency = userProfile.utility.tenant.currency
  // Load saved service selection on component mount
  useEffect(() => {
    if (stepHelpers) {
      const savedData = stepHelpers.getStepData(currentStepIndex);
      if (savedData?.selectedService) {
        setSelectedService(savedData.selectedService);
        console.log("Loaded saved service:", savedData.selectedService);
      }
    }
  }, [stepHelpers, currentStepIndex]);

  // Helper function to assign colors based on service type
  const getServiceColor = (serviceType: string[]): string => {
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
      if (serviceType.includes(key)) {
        return color;
      }
    }
    return "blue"; // default color
  };

  // Transform API data to match component expectations
  const transformedServices = useMemo(() => {
    return (
      serviceConfigs?.result?.map((config) => ({
        id: String(config.configurationCode || config.id),
        name: config.name,
        description: config.longDescription || config.supportRequestTypeDisplay,
        price: Number(config.extraData?.serviceCharge || 0),
        color: getServiceColor(config.productCode),
        utilityService: config.productCode.join(", "),
        serviceType: config.supportRequestTypeDisplay,
        category: config.supportRequestTypeDisplay,
        productCode: config.productCode,
        ...config,
      })) || []
    );
  }, [serviceConfigs]);

  const handleServiceSelect = (service: any) => {
    console.log("Service being selected:", service);
    setSelectedService(service);

    // Save selected service using step helpers
    if (stepHelpers) {
      const stepData = {
        selectedService: service,
        serviceId: service.id,
        serviceName: service.name,
        serviceCharge: service.price,
        serviceType: service.serviceType,
        utilityService: service.utilityService,
        productCode: service.productCode,
        timestamp: new Date().toISOString(),
        stepIndex: currentStepIndex,
        version: service.version,
      };

      stepHelpers.setStepData(currentStepIndex, stepData);

      // Also save to storage key for backup
      try {
        const existingData = localStorage.getItem(storageKey);
        const allStepData = existingData ? JSON.parse(existingData) : {};
        allStepData[currentStepIndex] = {
          ...allStepData[currentStepIndex],
          ...stepData,
        };
        localStorage.setItem(storageKey, JSON.stringify(allStepData));
        console.log("Service selection saved to storage:", stepData);
      } catch (error) {
        console.error("Failed to save service selection to storage:", error);
      }
    }

    toast.success(`Service "${service.name}" selected successfully`);
  };

  // Check if a service is selected
  const isServiceSelected = (serviceId: string | number) => {
    const result =
      selectedService && String(selectedService.id) === String(serviceId);
    console.log("Checking selection:", {
      selectedServiceId: selectedService?.id,
      serviceId,
      result,
    });
    return result;
  };

  const handleNext = () => {
    if (!selectedService) {
      toast.error("Please select a service to continue");
      return;
    }
    onNext();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-destructive">
            Error loading services. Please try again.
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
        {selectedService && (
          <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-md">
            <p className="text-sm font-medium text-primary">
              Selected: {selectedService.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Service Charge: {currency} {(Number(selectedService.price) || 0).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Service Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                isServiceSelected(service.id)
                  ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary"
                  : `border-l-${service.color}-500`
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base font-medium">
                    {service.name}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs capitalize">
                    {service.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-2xl font-bold text-primary">
                      {currency} {(Number(service.price) || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Service Charge
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={
                      isServiceSelected(service.id) ? "default" : "outline"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleServiceSelect(service);
                    }}
                  >
                    {isServiceSelected(service.id) ? "Selected" : "Select"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && transformedServices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm
              ? "No services found matching your search criteria."
              : "No services available at the moment."}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!selectedService}>
          Continue to Details
        </Button>
      </div>
    </div>
  );
};
