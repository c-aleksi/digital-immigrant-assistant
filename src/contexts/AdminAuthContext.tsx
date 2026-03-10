import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { adminVerify, adminLogout as doLogout } from '@/services/adminAuthService';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const valid = await adminVerify();
    setIsAuthenticated(valid);
    setIsLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const logout = () => {
    doLogout();
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, refresh, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside AdminAuthProvider');
  return ctx;
}
