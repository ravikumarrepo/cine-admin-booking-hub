
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123";

// Mock users database
const mockUsers: User[] = [
  {
    id: "admin-1",
    username: ADMIN_USERNAME,
    email: "admin@cinema.com",
    isAdmin: true,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Special case for admin
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = mockUsers[0];
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      toast({
        title: "Admin Login successful",
        description: "Welcome back, Admin!",
      });
      return true;
    }

    // Regular user login
    const foundUser = mockUsers.find(u => u.email === email);
    
    // For demo purposes, we'll allow any email/password that's not the admin's
    if (!foundUser && email && password) {
      // Create a new user if not found (for demo purposes)
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: email.split('@')[0],
        email,
        isAdmin: false,
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      return true;
    } else if (foundUser && !foundUser.isAdmin) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive",
      });
      return false;
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      isAdmin: false,
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: "Welcome to CineAdmin Booking Hub!",
    });
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      isAdmin: user?.isAdmin || false 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
