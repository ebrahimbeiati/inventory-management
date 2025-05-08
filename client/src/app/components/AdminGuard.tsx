'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/utils/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard component to protect routes that require admin privileges
 * Redirects to dashboard if user is not an admin
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;
    
    if (!isAdmin(user)) {
      console.log('User is not an admin, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAdmin(user)) {
    return null;
  }
  
  return <>{children}</>;
};

export default AdminGuard; 