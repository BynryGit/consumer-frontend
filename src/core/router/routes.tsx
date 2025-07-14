
import { RouteObject } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import ServerError from "../../pages/ServerError";
import { authRoutes } from "@features/auth/routes";



export interface AppRoute extends Omit<RouteObject, "children"> {
  auth?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  ...authRoutes,

  {
    path: "/500",
    element: <ServerError />,
  },
  {
    path: "*",
    element: <NotFound />,
  },  
];
