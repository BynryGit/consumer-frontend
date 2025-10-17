import { Permission, Role, UserPermissions, PermissionCheck, RoutePermission } from '../types/permission.types';

export const createPermissionCheck = (userPermissions: UserPermissions): PermissionCheck => {
  const { roles, permissions } = userPermissions;

  return {
    hasPermission: (permission: Permission) => permissions.includes(permission),
    hasRole: (role: Role) => roles.includes(role),
    hasAnyPermission: (requiredPermissions: Permission[]) =>
      requiredPermissions.some((permission) => permissions.includes(permission)),
    hasAllPermissions: (requiredPermissions: Permission[]) =>
      requiredPermissions.every((permission) => permissions.includes(permission)),
    hasAnyRole: (requiredRoles: Role[]) =>
      requiredRoles.some((role) => roles.includes(role)),
    hasAllRoles: (requiredRoles: Role[]) =>
      requiredRoles.every((role) => roles.includes(role)),
  };
};

export const checkRoutePermission = (
  path: string,
  userPermissions: UserPermissions,
  routePermissions: RoutePermission[]
): boolean => {
  const routePermission = routePermissions.find((rp) => rp.path === path);
  if (!routePermission) return true; // No permission required

  const { permissions, roles } = routePermission;
  const permissionCheck = createPermissionCheck(userPermissions);

  // Check if user has any of the required permissions
  const hasPermission = permissionCheck.hasAnyPermission(permissions);

  // If roles are specified, check if user has any of the required roles
  const hasRole = roles ? permissionCheck.hasAnyRole(roles) : true;

  return hasPermission && hasRole;
};

export const getRequiredPermissions = (
  path: string,
  routePermissions: RoutePermission[]
): { permissions: Permission[]; roles?: Role[] } => {
  const routePermission = routePermissions.find((rp) => rp.path === path);
  return routePermission || { permissions: [] };
};

export const validatePermissions = (
  userPermissions: UserPermissions,
  requiredPermissions: Permission[],
  requiredRoles?: Role[]
): boolean => {
  const permissionCheck = createPermissionCheck(userPermissions);

  const hasPermissions = permissionCheck.hasAllPermissions(requiredPermissions);
  const hasRoles = requiredRoles ? permissionCheck.hasAnyRole(requiredRoles) : true;

  return hasPermissions && hasRoles;
}; 