"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useMemo } from 'react';

export type UserRole = "guest" | "free_user" | "paid_user";

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  userName: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [userName, setUserName] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => userRole !== "guest", [userRole]);

  // Mock login/logout functions can be added here later
  // For now, role can be changed directly for demonstration

  const value = useMemo(() => ({
    userRole,
    setUserRole: (role: UserRole) => {
      setUserRole(role);
      if (role === "guest") {
        setUserName(null);
      } else if (userName === null) {
        // Simulate login with a generic name
        setUserName(role === "paid_user" ? "Premium User" : "VidShare User");
      }
    },
    isAuthenticated,
    userName
  }), [userRole, isAuthenticated, userName]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
