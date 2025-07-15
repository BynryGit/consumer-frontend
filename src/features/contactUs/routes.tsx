import { RouteObject } from 'react-router-dom';
import ServiceCenterSearch from './components/ServiceCenterSearch';


export interface contactUsRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: contactUsRoute[];
}

export const contactUsRoutes: contactUsRoute[] = [
  {
    path: '/contactUs',
    element: <ServiceCenterSearch />,
    auth: false, // Public route
  },
 
];




