import { Route, RouteObject } from 'react-router-dom';
import { CreateTransferRequest, TransferDetail, TransferLandingPage } from './components';
import TransferRequestSuccessPage from './components/receipt/receipt';


export interface transferRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: transferRoute[];
}

export const transferRoutes: transferRoute[] = [
  {
      path: 'cx/transfer',
      element: <TransferLandingPage />,
    },
    {
      path: 'cx/transfer/create',
      element: <CreateTransferRequest />,
    },
    {
      path: 'cx/transfer/:id',
      element: <TransferDetail />,
    },
    {
      path: 'cx/transfer/success',
      element: <TransferRequestSuccessPage />,
    },
];
