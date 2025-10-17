
import { RouteObject } from 'react-router-dom';
import ComplaintPage from './components/ComplaintDetails';
import DisconnectionPage from './components/DisconnectionDetails';
import ReconnectionPage from './components/ReconnectionDetails';
import ServiceRequestPage from './components/ServiceRequestDetails';
import TransferPage from './components/TransferDetails';
import RequestTracker from './Landing';


export interface requestTrackerRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: requestTrackerRoute[];
}

export const requestTrackerRoutes: requestTrackerRoute[] = [
  {
    path: '/request-tracker',
    element: <RequestTracker />,
    auth: false, // Public route
  },
  {
    path: '/complaints/:id',
    element: <ComplaintPage />,
    auth: false,
  },
  {
    path: '/transfer/:id',
    element: <TransferPage />,
    auth: false,
  },
  {
    path: '/reconnection/:id',
    element: <ReconnectionPage />,
    auth: false,
  },
  {
    path: '/disconnection/:id',
    element: <DisconnectionPage />,
    auth: false,
  },
  {
    path: '/service-request/:id',
    element: <ServiceRequestPage />,
    auth: false,
  },
];
