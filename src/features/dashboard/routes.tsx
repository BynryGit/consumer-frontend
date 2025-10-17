import { RouteObject } from 'react-router-dom';
import DashboardHome from './Landing';

export interface dashboardRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: dashboardRoute[];
}

export const dashboardRoutes: dashboardRoute[] = [
  {
    path: '/dashboard',
    element: <DashboardHome />,
    auth: false, // Public route
  },
 
];




