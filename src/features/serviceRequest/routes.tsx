


import { RouteObject } from 'react-router-dom';
import ServiceDashboard from './ServiceDashboard';


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
 
];




