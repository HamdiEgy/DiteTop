
import React, { createContext, useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

type RegisterData = Omit<User, 'id' | 'role'> & { password?: string };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User | null>;
  register: (userData: RegisterData) => Promise<User | null>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    try {
      const loggedInUser = await api.login(credentials.email, credentials.password);
      if (loggedInUser) {
        setUser(loggedInUser);
      }
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const newUser = await api.register(userData);
      if (newUser) {
        setUser(newUser);
      }
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
        const result = await api.forgotPassword(email);
        return result.success;
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
