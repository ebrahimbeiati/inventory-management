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
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        if (response.ok) {
          // Token is valid, set the user
          setUser(JSON.parse(storedUser));
        } else {
          // Token is invalid, clear local storage
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
      console.log('Attempting login to:', apiUrl);
      
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': 'https://main.d1db78gc9kkh9d.amplifyapp.com'
        },
        mode: 'cors',
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        console.error('Login response error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        } else if (response.status === 404) {
          throw new Error('Login endpoint not found');
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid request');
        } else {
          throw new Error(errorData.message || `Login failed with status: ${response.status}`);
        }
      }
      
      const data = await response.json();
      
      // Save user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
      
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Login error details:', {
        message: err.message,
        stack: err.stack,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });
      
      let errorMessage = 'An error occurred during login';
      
      if (err.message === 'Failed to fetch') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'Network error. Please check if the server is running and accessible.';
      } else if (err.message.includes('CORS')) {
        errorMessage = 'CORS error: The server is not configured to accept requests from this domain.';
      } else if (err.message === 'Invalid email or password') {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      
      setError(errorMessage);
      throw err;
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