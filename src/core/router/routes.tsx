
import { RouteObject } from "react-router-dom";
import NotFound from "../../pages/NotFound";
import ServerError from "../../pages/ServerError";
import { authRoutes } from "@features/auth/routes";
import { billingPaymentRoutes } from "@features/billingPayment";
import { usageconsumptioRoutes } from "@features/usage-consumptio";
import { requestTrackerRoutes } from "@features/requestTracker";
import { faqsRoutes } from "@features/faqs";
import { contactUsRoutes } from "@features/contactUs";
import { PreferencesRoutes } from "@features/Preferences";
import { notificationsRoutes } from "@features/notifications";
import { ProfileRoutes } from "@features/Profile";
import { serviceRequestRoutes } from "@features/serviceRequest";
import { dashboardRoutes } from "@features/dashboard";



export interface AppRoute extends Omit<RouteObject, "children"> {
  auth?: boolean;
  children?: AppRoute[];
}

export const routes: AppRoute[] = [
  ...authRoutes,
  ...billingPaymentRoutes,
  ...usageconsumptioRoutes,
  ...requestTrackerRoutes,
  ...faqsRoutes,
  ...contactUsRoutes,
  ...PreferencesRoutes,
  ...notificationsRoutes,
  ...ProfileRoutes,
  ...serviceRequestRoutes,
  ...dashboardRoutes,

  {
    path: "/500",
    element: <ServerError />,
  },
  {
    path: "*",
    element: <NotFound />,
  },  
];
