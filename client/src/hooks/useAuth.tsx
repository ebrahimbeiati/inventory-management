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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Save user data and token
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
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