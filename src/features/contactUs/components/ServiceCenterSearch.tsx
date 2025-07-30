import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import ServiceCenterMap from './ServiceCenterMap';
import { useServiceDetail } from '../hooks';
import { getLoginDataFromStorage } from '@shared/utils/loginUtils';
import { useSearchParams } from 'react-router-dom';

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
  const { remoteUtilityId, remoteConsumerNumber, consumerId } = getLoginDataFromStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Internal search state
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('query') || '';
  });
  const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  // Read search query from URL
  const urlSearchQuery = decodeURIComponent(searchParams.get("query") || "");

  // Build API parameters with search
  const apiParams = useMemo(() => {
    const params = {
      remote_utility_id: remoteUtilityId,
      consumer_id: consumerId
    };

    // Add search parameter if query exists in URL
    if (urlSearchQuery) {
      return {
        ...params,
        search_data: urlSearchQuery
      };
    }

    return params;
  }, [remoteUtilityId, consumerId, urlSearchQuery]);

  const { data, refetch, isLoading } = useServiceDetail(apiParams);

  // Reset search query when URL changes
  useEffect(() => {
    if (urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery]);

  // Transform API data to ServiceCenter format
  const apiServiceCenters: ServiceCenter[] = useMemo(() => {
    if (!data?.result) return [];
    
    // Handle both single result and array of results
    const results = Array.isArray(data.result) ? data.result : [data.result];
    
    return results.map((center: any) => ({
      id: center.id?.toString() || "",
      name: center.name || "",
      address: center.address || "",
      city: center.cityNames?.join(", ") || "",
      area: center.areaNames?.join(", ") || "",
      subArea: center.subAreaNames?.join(", ") || "",
      phone: center.contactNumber || "",
      email: center.email || "",
      type: center.typeDisplay || "Service Center",
      availableServices: center.utilityService || [],
      distance: "0.5 miles" // You might want to calculate this based on user location
    }));
  }, [data]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      } else {
        params.delete('query');
      }
      
      setSearchParams(params);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, setSearchParams]);

  const handleSearch = () => {
    // Force immediate search
    const params = new URLSearchParams(searchParams);
    
    if (searchQuery.trim()) {
      params.set('query', searchQuery.trim());
    } else {
      params.delete('query');
    }
    
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    setSearchParams(params);
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
        <CardContent className="space-y-6 mt-4">
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
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  ×
                </Button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              {urlSearchQuery ? `Service Centers Matching "${urlSearchQuery}"` : 'Available Service Centers'}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({apiServiceCenters.length} {apiServiceCenters.length === 1 ? 'result' : 'results'})
              </span>
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                <p>Searching for service centers...</p>
              </div>
            ) : apiServiceCenters.length > 0 ? (
              <div className="grid gap-3">
                {apiServiceCenters.map((center) => (
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
                                  {center.area} ,{center.subArea} , {center.city}
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
                {urlSearchQuery ? (
                  <>
                    <p>No service centers found matching "{urlSearchQuery}".</p>
                    <p className="text-sm mt-1">Try searching with a different location, service type, or contact our support team.</p>
                    <Button variant="outline" size="sm" onClick={handleClearSearch} className="mt-2">
                      Clear Search
                    </Button>
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