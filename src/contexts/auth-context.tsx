
"use client";

import type { ReactNode } from 'react';
import { createContext, useState, useMemo, useCallback } from 'react';

export type UserRole = "guest" | "free_user" | "paid_user";

interface AuthContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole, name?: string) => void;
  isAuthenticated: boolean;
  userName: string | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactNode {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("guest");
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => currentUserRole !== "guest", [currentUserRole]);

  const handleSetUserRole = useCallback((role: UserRole, name?: string) => {
    setCurrentUserRole(role);
    if (role === "guest") {
      setCurrentUserName(null);
    } else {
      // If a name is provided, use it. Otherwise, use existing or default.
      if (name) {
        setCurrentUserName(name);
      } else if (currentUserName === null) { // Only set default if no name exists
        setCurrentUserName(role === "paid_user" ? "Premium User" : "VidShare User");
      }
      // If name is not provided and currentUserName is already set, keep it.
    }
  }, [currentUserName]);

  const handleLogout = useCallback(() => {
    setCurrentUserRole("guest");
    setCurrentUserName(null);
  }, []);

  const value = useMemo(() => ({
    userRole: currentUserRole,
    setUserRole: handleSetUserRole,
    isAuthenticated,
    userName: currentUserName,
    logout: handleLogout,
  }), [currentUserRole, handleSetUserRole, isAuthenticated, currentUserName, handleLogout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
