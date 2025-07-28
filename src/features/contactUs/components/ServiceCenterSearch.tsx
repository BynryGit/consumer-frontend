import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import ServiceCenterMap from './ServiceCenterMap';
import { useServiceDetail } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  area: string;
  subArea: string;
  phone: string;
  email: string;
  type: string;
  availableServices: string[];
  distance?: string;
}

const ServiceCenterSearch = () => {
    const { remoteUtilityId, remoteConsumerNumber ,consumerId} = getLoginDataFromStorage();
  const { data, refetch } = useServiceDetail({
    remote_utility_id: remoteUtilityId,
    consumer_id:consumerId
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ServiceCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Helper function to extract only TRUE services from additional_data
  const getServicesFromAdditionalData = (additionalData: any): string[] => {
    console.log('Additional Data:', additionalData); // Debug log
    if (!additionalData) return [];
    
    const services = [];
    if (additionalData.isBillPayment === true) services.push("Bill Payment");
    if (additionalData.isNewConnections === true) services.push("New Connections");
    if (additionalData.isDisconnection === true) services.push("Disconnections");
    if (additionalData.isComplaints === true) services.push("Complaints");
    if (additionalData.isTechnicalSupport === true) services.push("Technical Support");
    if (additionalData.isDocumentCollection === true) services.push("Document Collection");
    
    console.log('Extracted Services:', services); // Debug log
    return services;
  };

  // Transform API data to ServiceCenter format
  const apiServiceCenters: ServiceCenter[] = data?.result ? [{
    id: data.result.id?.toString() || "",
    name: data.result.name || "",
    address: data.result.address || "",
    city: data.result.cityNames?.join(", ") || "",
    area: data.result.areaNames?.join(", ") || "",
    subArea: data.result.subAreaNames?.join(", ") || "",
    phone: data.result.contactNumber || "",
    email: data.result.email || "",
    type: data.result.typeDisplay || "",
    availableServices: getServicesFromAdditionalData(data.result.additionalData),
    distance: "0.5 miles" // You might want to calculate this based on user location
  }] : [];

  console.log('API Service Centers:', apiServiceCenters); // Debug log

  // Dynamic search effect - updates results as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show all centers
      setSearchResults(apiServiceCenters);
      return;
    }

    // Filter results based on search query
    const query = searchQuery.toLowerCase();
    const filteredResults = apiServiceCenters.filter(center => 
      center.city.toLowerCase().includes(query) ||
      center.address.toLowerCase().includes(query) ||
      center.name.toLowerCase().includes(query) ||
      center.area.toLowerCase().includes(query) ||
      center.subArea.toLowerCase().includes(query) ||
      center.type.toLowerCase().includes(query) ||
      center.availableServices.some(service => service.toLowerCase().includes(query))
    );
    
    setSearchResults(filteredResults);
  }, [searchQuery, data]);

  // Initialize search results when data loads
  useEffect(() => {
    if (apiServiceCenters.length > 0) {
      setSearchResults(apiServiceCenters);
    }
  }, [data]);

  const handleSearch = () => {
    // Optionally refetch data or trigger additional search logic
    console.log('Manual search triggered for:', searchQuery);
    refetch();
  };

  const handleViewLocation = (center: ServiceCenter) => {
    setSelectedCenter(center);
    setIsMapOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Main Office':
        return 'bg-green-100 text-green-800';
      case 'Branch Office':
        return 'bg-blue-100 text-blue-800';
      case 'Payment Center':
        return 'bg-orange-100 text-orange-800';
      case 'Customer Service Center':
        return 'bg-purple-100 text-purple-800';
      case 'Technical Support':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Find Nearest Service Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Enter your city, area, postal code, or service type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {searchQuery ? `Service Centers Matching "${searchQuery}"` : 'Available Service Centers'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({searchResults.length} {searchResults.length === 1 ? 'result' : 'results'})
              </span>
            </h3>
            
            {searchResults.length > 0 ? (
              <div className="grid gap-3">
                {searchResults.map((center) => (
                  <Card key={center.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Header Section */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-base">{center.name}</h4>
                              {center.distance && (
                                <span className="text-sm text-muted-foreground">
                                  • {center.distance} away
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getTypeColor(center.type)}>
                                {center.type}
                              </Badge>
                              {center.area && center.subArea && (
                                <span className="text-sm text-muted-foreground">
                                  {center.area} - {center.subArea}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewLocation(center)}
                            className="flex items-center gap-1"
                          >
                            <MapPin className="h-3 w-3" />
                            View Location
                          </Button>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Contact Information */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground">Address</p>
                                <p className="text-sm leading-tight">
                                  {center.address}, {center.city}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Phone</p>
                                <p className="text-sm">{center.phone}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">Email</p>
                                <p className="text-sm">{center.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Services */}
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground mt-1 flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Available Services</p>
                                {center.availableServices.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {center.availableServices.slice(0, 3).map((service, index) => (
                                      <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                                        {service}
                                      </Badge>
                                    ))}
                                    {center.availableServices.length > 3 && (
                                      <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                                        +{center.availableServices.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No services available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                {searchQuery ? (
                  <>
                    <p>No service centers found matching "{searchQuery}".</p>
                    <p className="text-sm mt-1">Try searching with a different location, service type, or contact our support team.</p>
                  </>
                ) : (
                  <>
                    <p>No service centers available.</p>
                    <p className="text-sm mt-1">Please contact our support team for assistance.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedCenter?.name} Location
            </DialogTitle>
          </DialogHeader>
          {selectedCenter && (
            <ServiceCenterMap serviceCenter={selectedCenter} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceCenterSearch;