import { User } from '@/types';

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const isAdmin = (user: any): boolean => {
  return user?.role?.toLowerCase() === ROLES.ADMIN;
};

export const hasPermission = (user: User | null, requiredRole: Role): boolean => {
  if (!user) return false;
  
  switch (requiredRole) {
    case ROLES.ADMIN:
      return user.role?.toLowerCase() === ROLES.ADMIN;
    case ROLES.EMPLOYEE:
      return true; // Both admin and employee can access
    default:
      return false;
  }
}; 