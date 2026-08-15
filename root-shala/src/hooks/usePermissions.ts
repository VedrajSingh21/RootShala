import { useMemo } from 'react';
import { CurrentUser, Role } from '../types';
import { ROLE_PERMISSIONS, Permission } from '../config/rbac';

export const useRole = (user: CurrentUser | null) => {
  return useMemo(() => user?.role || null, [user]);
};

export const usePermissions = (user: CurrentUser | null) => {
  return useMemo(() => {
    if (!user || !user.role) return [];
    return ROLE_PERMISSIONS[user.role] || [];
  }, [user]);
};

export const hasPermission = (user: CurrentUser | null, permission: Permission): boolean => {
  if (!user || !user.role) return false;
  const permissions = ROLE_PERMISSIONS[user.role];
  if (!permissions) return false;
  return permissions.includes(permission);
};

export const canAccess = (user: CurrentUser | null, routePermission?: Permission | Permission[]): boolean => {
  if (!routePermission) return true; // Public route
  if (Array.isArray(routePermission)) {
    return routePermission.some(p => hasPermission(user, p));
  }
  return hasPermission(user, routePermission);
};

export const getDefaultDashboard = (role: Role): string => {
  // Simple mapping, Super Admin -> admin-panel, Accountant -> fees, else dashboard
  if (role === 'Super Admin') return 'admin-panel';
  if (role === 'Accountant') return 'fees';
  return 'dashboard';
};
