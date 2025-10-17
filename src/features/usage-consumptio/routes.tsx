// import { Route } from 'react-router-dom';

// export const usage-consumptioRoutes = () => {
//   return (
//     <>
//       {/* Add your routes here */}
//     </>
//   );
// };


// import { Route } from 'react-router-dom';

// export const billingPaymentRoutes = () => {
//   return (
//     <>
//       {/* Add your routes here */}
//     </>
//   );
// };

import { RouteObject } from 'react-router-dom';
import UsageDashboard from './landing';



export interface usageconsumptioRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: usageconsumptioRoute[];
}

export const usageconsumptioRoutes: usageconsumptioRoute[] = [
  {
    path: '/usage-consumption',
    element: <UsageDashboard />,
    auth: false, // Public route
  },
 
];




