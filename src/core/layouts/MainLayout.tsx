import { X } from "lucide-react";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LoadingInterceptor } from "../../shared/api";
import { useToast } from "../../shared/hooks/use-toast";
import { useBaseComponent } from "@shared/base/hooks/useBaseComponent";
import { Toaster } from "sonner";
import { sidenav as Sidenav } from "@features/core/components/sidenav";
import { Footer, Topnav } from "@features/core/components";

interface MainLayoutProps {
  error?: Error | null;
  onErrorDismiss?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  error = null,
  onErrorDismiss,
}) => {

  const location = useLocation();
  const { renderBreadcrumbs } = useBaseComponent();
  
  // Updated to include tenant-based routes
  const hideSideAndTopNav = [
    "/login",
    "/forgot-password",
    "/reset-password",
    "/",
    "/signup",
    "/setup-password"
  ].includes(location.pathname) || 
  // Also hide for tenant-specific routes
  location.pathname.match(/^\/(login|forgot-password|signup|setup-password)\/[^\/]+$/);
  
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        action: (
          <button
            onClick={onErrorDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 p-0 text-destructive hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        ),
      });
    }
  }, [error, toast, onErrorDismiss]);

  // Don't render anything if we're on a route that should hide the layout
  if (hideSideAndTopNav) {
    return <Outlet />;
  }

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col min-h-screen">
         <Topnav />
      <div className="flex min-h-screen">
        <Sidenav />
        <main className="flex-1 flex flex-col min-w-0 p-4 relative">
          <Toaster position="top-center" richColors />
          <div className="w-full overflow-x-hidden relative">
            {/* <div className="mb-4">{renderBreadcrumbs()}</div> */}
            <Outlet />
            <LoadingInterceptor />
          </div>
        </main>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default MainLayout;