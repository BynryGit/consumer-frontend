

import { RouteObject } from 'react-router-dom';
import BillingDashboard from './Landing';


export interface billingPaymentRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: billingPaymentRoute[];
}

export const billingPaymentRoutes: billingPaymentRoute[] = [
  {
    path: '/billing',
    element: <BillingDashboard />,
    auth: false, // Public route
  },
 
];




