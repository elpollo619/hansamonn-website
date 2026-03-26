import React from 'react';
import AdminAuthProvider, { useAdminAuth } from '@/context/AdminAuthContext';
import AdminLoginScreen from '@/components/admin/AdminLoginScreen';
import AdminPanel from '@/components/admin/AdminPanel';

function AdminContent() {
  const { isAuthenticated } = useAdminAuth();
  return isAuthenticated ? <AdminPanel /> : <AdminLoginScreen />;
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}
