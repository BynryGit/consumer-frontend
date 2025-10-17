import { useCallback, useMemo } from 'react';

import { Permission, Role, UserPermissions, RoutePermission } from '../types/permission.types';
import {
  createPermissionCheck,
  checkRoutePermission,
  getRequiredPermissions,
  validatePermissions,
} from '../utils/permissionCheck';

interface UsePermissionsProps {
  userPermissions: UserPermissions;
  routePermissions?: RoutePermission[];
}

export const usePermissions = ({ userPermissions, routePermissions = [] }: UsePermissionsProps) => {
  const permissionCheck = useMemo(
    () => createPermissionCheck(userPermissions),
    [userPermissions]
  );

  const checkRouteAccess = useCallback(
    (path: string) => {
      if (!routePermissions.length) return true;
      return checkRoutePermission(path, userPermissions, routePermissions);
    },
    [userPermissions, routePermissions]
  );

  const getRouteRequirements = useCallback(
    (path: string) => {
      if (!routePermissions.length) return { permissions: [] };
      return getRequiredPermissions(path, routePermissions);
    },
    [routePermissions]
  );

  const validateAccess = useCallback(
    (requiredPermissions: Permission[], requiredRoles?: Role[]) => {
      return validatePermissions(userPermissions, requiredPermissions, requiredRoles);
    },
    [userPermissions]
  );

  return {
    ...permissionCheck,
    checkRouteAccess,
    getRouteRequirements,
    validateAccess,
  };
}; 