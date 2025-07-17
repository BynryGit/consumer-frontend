import { Route, RouteObject } from 'react-router-dom';

import { CreateComplaintRequest } from './components/create/create';
import ComplaintSuccessPage from './components/receipt/receipt';
// import { CreateComplaintRequest } from './components';


export interface complaintRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: complaintRoute[];
}

export const complaintRoutes: complaintRoute[] = [
    {
      path: 'cx/complaints/create',
      element: <CreateComplaintRequest />,
    },
    {
      path: 'cx/complaints/create/:step',
      element: <CreateComplaintRequest />,
    },
    {
      path: 'cx/complaints/success',
      element: <ComplaintSuccessPage />,
    },
];
