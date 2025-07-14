import { RouteObject } from 'react-router-dom';
import SignInComponent from './components/Login';
import DashboardComponent from './components/Dashboard';
import DashboardHome from './DashboardHome';

export interface AuthRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: AuthRoute[];
}

export const authRoutes: AuthRoute[] = [
  {
    path: '/login',
    element: <SignInComponent />,
    auth: false, // Public route
  },
  {
    path: '/dashboard',
    element: <DashboardHome />,
    auth: true, // Protected route - requires authentication
  },
  {
    path: '/',
    element: <SignInComponent />, // Redirect to login by default
    auth: false,
  },
];

// Optional: Route configuration with nested structure
export const appRoutes: AuthRoute[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <SignInComponent />,
        auth: false,
      },
      {
        path: 'login',
        element: <SignInComponent />,
        auth: false,
      },
      {
        path: 'dashboard',
        element: <DashboardHome />,
        auth: true,
      },
    ],
  },
];