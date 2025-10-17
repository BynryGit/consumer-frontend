import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Building } from 'lucide-react';
import { Badge } from '@shared/ui/badge';
import { Button } from '@shared/ui/button';
import { Card, CardContent } from '@shared/ui/card';

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

interface ServiceCenterMapProps {
  serviceCenter: ServiceCenter;
}

const ServiceCenterMap = ({ serviceCenter }: ServiceCenterMapProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Main Branch':
        return 'bg-green-100 text-green-800';
      case 'Sub Branch':
        return 'bg-blue-100 text-blue-800';
      case 'Service Point':
        return 'bg-orange-100 text-orange-800';
      case 'Customer Service Center':
      case 'Customer service center':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGetDirections = () => {
    const address = `${serviceCenter.address}, ${serviceCenter.city}`;
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full max-h-[70vh] overflow-hidden">
      {/* Service Center Information Panel */}
      <div className="lg:w-1/3 flex flex-col space-y-3 overflow-y-auto max-h-full">
        <Card className="flex-shrink-0">
          <CardContent className="p-3">
            <div className="space-y-3">
              {/* Header Section */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Building className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg leading-tight">{serviceCenter.name}</h3>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-7">
                  {serviceCenter.type && (
                    <Badge className={`${getTypeColor(serviceCenter.type)} w-fit`}>
                      {serviceCenter.type}
                    </Badge>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {serviceCenter.area} - {serviceCenter.subArea}
                  </div>
                  {serviceCenter.distance && (
                    <span className="text-sm text-muted-foreground">
                      {serviceCenter.distance} away
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground mb-1">Address</p>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      <p>{serviceCenter.address}</p>
                      <p>{serviceCenter.city}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground mb-1">Phone</p>
                    <p className="text-xs text-muted-foreground">{serviceCenter.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground mb-1">Email</p>
                    <p className="text-xs text-muted-foreground break-all">{serviceCenter.email}</p>
                  </div>
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-1">
                <Button 
                  onClick={handleGetDirections}
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Navigation className="h-3 w-3" />
                  Get Directions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Services Card */}
        <Card className="flex-shrink-0">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground mb-2">Available Services</p>
                {serviceCenter.availableServices.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {serviceCenter.availableServices.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                        {service}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No services available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Display */}
      <div className="lg:w-2/3 flex-1 min-h-0">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <div className="relative h-full min-h-[300px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
              {/* Interactive Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10 px-4">
                  <div className="relative mb-4">
                    <MapPin className="h-12 w-12 text-primary mx-auto animate-bounce" />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-1.5 bg-primary/20 rounded-full blur-sm" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{serviceCenter.name}</h3>
                  <div className="space-y-0.5 mb-3 text-muted-foreground">
                    <p className="text-sm">{serviceCenter.address}</p>
                    <p className="text-sm">{serviceCenter.area}, {serviceCenter.subArea}</p>
                    <p className="text-sm">{serviceCenter.city}</p>
                  </div>
                  <Button 
                    onClick={handleGetDirections}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    Open in Maps
                  </Button>
                </div>
              </div>

              {/* Map Grid Overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }} />
              </div>

              {/* Decorative Map Elements */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm max-w-xs">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="font-medium truncate">{serviceCenter.name}</span>
                </div>
              </div>

              {/* Map Controls Simulation */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                <div className="space-y-1">
                  <button className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors">
                    +
                  </button>
                  <button className="w-8 h-8 bg-white rounded border border-gray-200 flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors">
                    −
                  </button>
                </div>
              </div>

              {/* Distance Badge */}
              {serviceCenter.distance && (
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  {serviceCenter.distance} away
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceCenterMap;