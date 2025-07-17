


import { RouteObject } from 'react-router-dom';
import ServiceDashboard from './ServiceDashboard';
import { CreateComplaintRequest } from './components/complaints/components';
import { CreateTransferRequest } from './components/transfer/components';
import { CreateDisconnectionRequest } from './components/disconnect/create';


export interface serviceRequestRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: serviceRequestRoute[];
}

export const serviceRequestRoutes: serviceRequestRoute[] = [
  {
    path: '/serviceRequest',
    element: <ServiceDashboard />,
    auth: false, // Public route
  },
  {
    path: '/service/complaint',
    element: <CreateComplaintRequest />,
    auth: false, // Public route
  },
    {
    path: '/service/transfer',
    element: <CreateTransferRequest />,
    auth: false, // Public route
  },
      {
    path: '/service/disconnect',
    element: <CreateDisconnectionRequest />,
    auth: false, // Public route
  },
 
];




