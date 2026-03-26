import React, { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'ha_admin_auth';
const CREDENTIALS = {
  email: 'admin@hansamonn.ch',
  password: 'HansAmonn2024!',
};

const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export default function AdminAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });

  function login(email, password) {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
