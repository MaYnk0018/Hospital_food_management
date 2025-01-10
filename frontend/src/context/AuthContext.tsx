import React, { createContext, useContext, useState, useEffect } from 'react';

// Define proper types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  contact?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User & { token: string }) => void;  // Changed to accept user data directly
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Modified login to accept user data directly
  const login = (userData: User & { token: string }) => {
    const { token, ...userWithoutToken } = userData;
    setUser(userWithoutToken);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithoutToken));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};