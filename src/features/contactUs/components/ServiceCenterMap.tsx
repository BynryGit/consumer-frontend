
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
  type:string;
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Service Center Information Panel */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{serviceCenter.name}</h3>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(serviceCenter.type)}>
                      {serviceCenter.type}
                    </Badge>
                    {serviceCenter.distance && (
                      <span className="text-sm text-muted-foreground">
                        {serviceCenter.distance} away
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {serviceCenter.area} - {serviceCenter.subArea}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {serviceCenter.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {serviceCenter.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">{serviceCenter.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">{serviceCenter.email}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleGetDirections}
                  className="w-full flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
              <div className="w-full">
                <p className="text-sm font-medium text-foreground mb-2">Available Services</p>
                <div className="flex flex-wrap gap-2">
                  {serviceCenter.availableServices.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Display */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <div className="relative h-full min-h-[400px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
              {/* Interactive Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                  <div className="relative mb-6">
                    <MapPin className="h-20 w-20 text-primary mx-auto animate-bounce" />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-primary/20 rounded-full blur-sm" />
                  </div>
                  <h3 className="font-semibold text-xl text-foreground mb-2">{serviceCenter.name}</h3>
                  <p className="text-muted-foreground mb-1">{serviceCenter.address}</p>
                  <p className="text-muted-foreground mb-1">{serviceCenter.area}, {serviceCenter.subArea}</p>
                  <p className="text-muted-foreground mb-4">{serviceCenter.city}</p>
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
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="font-medium">{serviceCenter.name}</span>
                </div>
              </div>

              {/* Map Controls Simulation */}
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-white rounded border flex items-center justify-center text-xs font-medium">+</div>
                  <div className="w-8 h-8 bg-white rounded border flex items-center justify-center text-xs font-medium">-</div>
                </div>
              </div>

              {/* Distance Badge */}
              {serviceCenter.distance && (
                <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
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
