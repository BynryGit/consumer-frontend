
import { RouteObject } from 'react-router-dom';
import NotificationCenter from './components/NotificationCenter';



export interface notificationsRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: notificationsRoute[];
}

export const notificationsRoutes: notificationsRoute[] = [
  {
    path: '/notification',
    element: <NotificationCenter />,
    auth: false, // Public route
  },
 
];




