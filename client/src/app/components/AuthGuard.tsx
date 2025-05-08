'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Home } from 'lucide-react';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',                    // Home page
  '/login',              // Login page
  '/products',           // Public product catalog (read-only)
  '/analytics',          // Analytics page
  '/reports',            // Reports page
  '/help',               // Help page
  '/settings',           // Settings page
  '/dashboard'           // Dashboard page
];

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to protect routes that require authentication
 * Allows access to public routes without authentication
 * Shows unauthorized access UI if user is not authenticated
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showUnauthorized, setShowUnauthorized] = useState(false);
  
  useEffect(() => {
    // Skip if still loading auth state
    if (loading) return;
    
    // If the route is public, allow access
    if (PUBLIC_ROUTES.includes(pathname)) {
      setShowUnauthorized(false);
      return;
    }
    
    // If user is not authenticated, show unauthorized UI
    if (!user) {
      setShowUnauthorized(true);
    } else {
      setShowUnauthorized(false);
    }
  }, [user, loading, pathname]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Show unauthorized access UI
  if (showUnauthorized) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be logged in to access this page.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // If on a public route or user is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard; 