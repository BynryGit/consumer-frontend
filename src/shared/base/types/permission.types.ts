export type Permission = string;

export type Role = string;

export interface UserPermissions {
  roles: Role[];
  permissions: Permission[];
}

export interface RoutePermission {
  path: string;
  permissions: Permission[];
  roles?: Role[];
}

export interface PermissionConfig {
  routes: RoutePermission[];
  rolePermissions: Record<Role, Permission[]>;
}

export interface PermissionCheck {
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasAllRoles: (roles: Role[]) => boolean;
} 