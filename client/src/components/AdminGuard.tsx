import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Only renders its children if the current user is an admin
 * Otherwise renders the fallback (if provided) or nothing
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  // Check if user is logged in and has admin role
  const isAdmin = user && user.role === 'Admin';
  
  if (isAdmin) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default AdminGuard; 