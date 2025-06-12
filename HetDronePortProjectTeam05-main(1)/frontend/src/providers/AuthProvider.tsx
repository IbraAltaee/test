"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  validateAuth: () => Promise<void>;
}

interface LoginResponse {
  username: string;
  success: boolean;
  message: string;
}

interface ValidationResponse {
  username: string;
  authenticated: boolean;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Validate authentication with server
  const validateAuth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        credentials: 'include', // This sends HttpOnly cookies automatically
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: ValidationResponse = await response.json();
        if (data.authenticated) {
          setUsername(data.username);
          setIsAuthenticated(true);
          return;
        }
      }
      
      // If we get here, authentication failed
      setIsAuthenticated(false);
      setUsername(null);
      
    } catch (error) {
      console.error('Auth validation failed:', error);
      setIsAuthenticated(false);
      setUsername(null);
    }
  }, []);

  // Validate on app start and when tab becomes visible
  useEffect(() => {
    const initializeAuth = async () => {
      await validateAuth();
      setLoading(false);
    };

    initializeAuth();
    
    // Also validate when user comes back to the tab
    const handleVisibilityChange = () => {
      if (!document.hidden && !loading) {
        validateAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [validateAuth, loading]);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      // Basic input validation
      if (!username?.trim() || !password?.trim()) {
        throw new Error("Username and password are required");
      }

      // Sanitize username (remove special characters)
      const sanitizedUsername = username.trim().replace(/[^\w]/g, "");
      if (sanitizedUsername !== username.trim()) {
        throw new Error("Username contains invalid characters");
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ 
          username: sanitizedUsername, 
          password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Authentication failed");
      }

      const data: LoginResponse = await response.json();
      
      if (!data.success || !data.username) {
        throw new Error("Invalid server response");
      }

      // Update state - HttpOnly cookie is automatically set by server
      setUsername(data.username);
      setIsAuthenticated(true);

    } catch (error) {
      setIsAuthenticated(false);
      setUsername(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Notify server to clear the cookie
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUsername(null);
      setIsAuthenticated(false);
      router.push('/');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ 
      username, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      validateAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};