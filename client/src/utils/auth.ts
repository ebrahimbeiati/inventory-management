import { User } from '@/types';

export const ROLES = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const isAdmin = (user: User | null): boolean => {
  return user?.role === ROLES.ADMIN;
};

export const hasPermission = (user: User | null, requiredRole: Role): boolean => {
  if (!user) return false;
  
  switch (requiredRole) {
    case ROLES.ADMIN:
      return user.role === ROLES.ADMIN;
    case ROLES.EMPLOYEE:
      return true; // Both admin and employee can access
    default:
      return false;
  }
}; 