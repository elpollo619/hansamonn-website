import React, { createContext, useContext, useState } from 'react';
import { validateCredentials } from '@/data/usersStore';

const STORAGE_KEY = 'ha_admin_user';
const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export default function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  function login(email, password) {
    const validated = validateCredentials(email, password);
    if (validated) {
      setUser(validated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';
  const canDelete = isAdmin;
  const canManageUsers = isAdmin;

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, isAdmin, isStaff, canDelete, canManageUsers, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
