// import { Route } from 'react-router-dom';

// export const faqsRoutes = () => {
//   return (
//     <>
//       {/* Add your routes here */}
//     </>
//   );
// };


import { RouteObject } from 'react-router-dom';
import FAQPage from './FAQPage';



export interface faqsRoute extends Omit<RouteObject, 'children'> {
  auth?: boolean;
  children?: faqsRoute[];
}

export const faqsRoutes: faqsRoute[] = [
  {
    path: '/faqs',
    element: <FAQPage />,
    auth: false, // Public route
  },
 
];




