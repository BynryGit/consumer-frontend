import React from 'react';

import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { 
  FileText, 
  PlusCircle, 
  Info, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRightLeft,
  PowerOff,
  Power,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceDashboard = () => {
  const serviceCards = [
    {
      id: 'new-request',
      title: 'New Request',
      description: 'Submit a new service request',
      icon: PlusCircle,
      iconColor: 'text-primary',
      buttonText: 'Create Request',
      link: '/service/newservice'
    },
    {
      id: 'complaint',
      title: 'Register Complaint',
      description: 'Submit a formal complaint',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      buttonText: 'Register Complaint',
      link: '/service/complaint'
    },
    {
      id: 'transfer',
      title: 'Request Transfer',
      description: 'Transfer service to new location',
      icon: ArrowRightLeft,
      iconColor: 'text-purple-500',
      buttonText: 'Transfer Service',
      link: '/service/transfer'
    },
    {
      id: 'disconnect',
      title: 'Request Disconnection',
      description: 'Disconnect your service',
      icon: PowerOff,
      iconColor: 'text-red-500',
      buttonText: 'Disconnect Service',
      link: '/service/disconnect'
    },
    // {
    //   id: 'reconnect',
    //   title: 'Request Reconnection',
    //   description: 'Reconnect your service',
    //   icon: Power,
    //   iconColor: 'text-cyan-500',
    //   buttonText: 'Reconnect Service',
    //   link: '/service/reconnect'
    // }
  ];

  const processSteps = [
    {
      id: 'submit',
      title: '1. Submit Request',
      description: 'Fill out the request form with detailed information about your issue or requirement',
      icon: FileText,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'review',
      title: '2. Initial Review',
      description: 'Our team reviews your request and assigns it to the appropriate specialist',
      icon: Clock,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'assignment',
      title: '3. Expert Assignment',
      description: 'A qualified technician or specialist is assigned to handle your specific request',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'resolution',
      title: '4. Resolution',
      description: 'Your issue is resolved and you receive confirmation with any follow-up steps',
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Service & Support</h1>
        <p className="text-muted-foreground mt-2">
          Submit service requests, track their status, and manage appointments
        </p>  
      </div>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {serviceCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.id} className="flex flex-col h-full p-6">
              <CardHeader className="flex-shrink-0 px-0 pt-0">
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
                  {card.title}
                </CardTitle>
                <CardDescription className="text-base">{card.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end pt-4 px-0 pb-0">
                <Button asChild className="w-full">
                  <Link to={card.link}>{card.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Process Information */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 pb-2">
            <Info className="h-5 w-5 text-primary" />
            How Our Request Process Works
          </CardTitle>
          <CardDescription>
            Understanding our streamlined service request workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className="text-center">
                  <div className={`w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDashboard;