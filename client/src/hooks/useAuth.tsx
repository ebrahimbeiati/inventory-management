'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '@/config';
import { useRouter } from 'next/navigation';

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: () => {},
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const idToken = localStorage.getItem('idToken');
        const userStr = localStorage.getItem('user');

        if (idToken && userStr) {
          const userData = JSON.parse(userStr);
          setUser({
            userId: userData.userId || '',
            name: userData.name || '',
            email: userData.email || '',
            role: (userData.role || 'employee').toLowerCase(),
            status: 'CONFIRMED'
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = () => {
    // Clear all auth data
    localStorage.removeItem('idToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear user state
    setUser(null);
    
    // Redirect to login
    router.push('/login');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a base query with auth header
const baseQuery = fetchBaseQuery({ 
  baseUrl: config.api.baseUrl,
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  }
});

export const api = createApi({
  baseQuery,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products'
    })
  })
}); 