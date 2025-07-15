
import { RouteObject } from 'react-router-dom';
import ProfileEditor from './Landing';



export interface ProfileRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: ProfileRoute[];
}

export const ProfileRoutes: ProfileRoute[] = [
  {
    path: '/profile',
    element: <ProfileEditor />,
    auth: false, // Public route
  },
 
];




