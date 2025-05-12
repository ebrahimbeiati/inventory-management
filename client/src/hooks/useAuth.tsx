import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user type
interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: false,
  error: null
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing session on mount and validate token
  useEffect(() => {
    const validateSession = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (!storedUser || !storedToken) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Validate token with the server
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/validate-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Token is valid, set the user
          setUser(JSON.parse(storedUser));
        } else if (response.status === 401) {
          // Token is invalid, clear local storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        } else if (response.status === 0) {
          console.error('Network error during token validation');
          // Don't clear the session on network errors
        } else {
          console.error('Unexpected error during token validation:', response.status);
          // Clear session on other errors
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Error validating token:', err);
        // If there's any error, clear session to be safe
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    validateSession();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://unyca5yulf.execute-api.eu-west-2.amazonaws.com/prod';
      console.log('Attempting login to:', `${apiUrl}/users/login`);
      
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Login response error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (response.status === 404) {
          throw new Error('Login endpoint not found. Please check API configuration.');
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid request');
        } else if (response.status === 0) {
          throw new Error('Network error. Please check your internet connection and try again.');
        } else {
          throw new Error(errorData.message || `Login failed with status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Login successful, user data:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        window.location.href = '/dashboard';
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

export default useAuth; 