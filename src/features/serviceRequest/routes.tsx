


import { RouteObject } from 'react-router-dom';
import ServiceDashboard from './ServiceDashboard';
import { CreateComplaintRequest } from './components/complaints/components';
import { CreateTransferRequest } from './components/transfer/components';
import { CreateDisconnectionRequest } from './components/disconnect/create';
import ComplaintSuccessPage from './components/complaints/components/receipt/receipt';
import TransferRequestSuccessPage from './components/transfer/components/receipt/receipt';
import DisconnectionSuccessPage from './components/disconnect/create/receipt/receipt';
import { CreateServiceRequest } from './components/services/components';
import ServiceRequestSuccessPage from './components/services/components/receipt/receipt';
// import { CreateServiceRequest } from './components/services/components';


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
    path: '/service/newservice',
    element: <CreateServiceRequest />,
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
    path: '/complaints/success',
    element: <ComplaintSuccessPage />,
    auth: false, // Public route
  },
    {
    path: '/transfer/success',
    element: <TransferRequestSuccessPage />,
    auth: false, // Public route
  },
   {
    path: '/disconnections/success',
    element: <DisconnectionSuccessPage />,
    auth: false, // Public route
  },

   {
    path: '/newService/success',
    element: <ServiceRequestSuccessPage />,
    auth: false, // Public route
  },

      {
    path: '/service/disconnect',
    element: <CreateDisconnectionRequest />,
    auth: false, // Public route
  },
 
];




