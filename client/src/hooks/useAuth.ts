import { useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        loading: false,
      });
    } else {
      setAuthState({
        user: null,
        loading: false,
      });
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
    });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signOut,
  };
}; 