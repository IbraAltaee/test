"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  emailNotifications?: boolean;

  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
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

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = Cookies.get("token") || null;
    const savedUsername = Cookies.get("username") || null;

    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      setToken(data.token);
      setUsername(username);

      Cookies.set("token", data.token, { expires: 1 });
      Cookies.set("username", username, { expires: 1 });
    } catch (error) {
      setToken(null);
      setUsername(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsername(null);
    setToken(null);
    Cookies.remove("token");
    Cookies.remove("username");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ username, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
