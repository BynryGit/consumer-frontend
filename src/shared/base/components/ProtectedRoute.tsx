import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { usePermissions } from '../hooks/usePermissions';
import { Permission, Role, UserPermissions, RoutePermission } from '../types/permission.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userPermissions: UserPermissions;
  routePermissions: RoutePermission[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  userPermissions,
  routePermissions,
  fallbackPath = '/unauthorized',
}) => {
  const location = useLocation();
  const { checkRouteAccess } = usePermissions({
    userPermissions,
    routePermissions,
  });

  const hasAccess = checkRouteAccess(location.pathname);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface WithPermissionProps {
  requiredPermissions: Permission[];
  requiredRoles?: Role[];
  userPermissions: UserPermissions;
  fallback?: React.ReactNode;
}

export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredPermissions, requiredRoles, userPermissions, fallback }: WithPermissionProps
) => {
  const WithPermission: React.FC<P> = (props) => {
    const { validateAccess } = usePermissions({ userPermissions });

    const hasAccess = validateAccess(requiredPermissions, requiredRoles);

    if (!hasAccess) {
      return fallback ? <>{fallback}</> : null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithPermission;
}; 