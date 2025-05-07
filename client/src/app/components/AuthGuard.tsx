'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * Redirects to login page if user is not authenticated and trying to access a protected route
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // Skip if still loading auth state to prevent redirect flicker
    if (loading) return;
    
    // If the route is public, allow access
    if (PUBLIC_ROUTES.includes(pathname)) return;
    
    // If user is not authenticated and trying to access a protected route, redirect to login
    if (!user) {
      console.log('User not authenticated, redirecting to login page');
      router.push('/login');
    }
  }, [user, loading, pathname, router]);
  
  // When loading auth state, show a simple loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If on a public route or user is authenticated, render children
  if (PUBLIC_ROUTES.includes(pathname) || user) {
    return <>{children}</>;
  }
  
  // This return is to handle the case when redirecting but not yet navigated
  // It prevents a flash of protected content before redirect
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default AuthGuard; 