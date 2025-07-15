// import { Route } from 'react-router-dom';

// export const PreferencesRoutes = () => {
//   return (
//     <>
//       {/* Add your routes here */}
//     </>
//   );
// };
import { RouteObject } from 'react-router-dom';
import CommunicationPreferences from './Landing';



export interface PreferencesRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: PreferencesRoute[];
}

export const PreferencesRoutes: PreferencesRoute[] = [
  {
    path: '/preferences',
    element: <CommunicationPreferences />,
    auth: false, // Public route
  },
 
];




