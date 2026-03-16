import React from 'react';
import { Helmet } from 'react-helmet';
import AdminPanel from '@/components/admin/AdminPanel';

const AdminPage = () => {
  return (
    <>
      <Helmet>
        <title>Content Management - Amonn Architektur</title>
        <meta name="description" content="Verwalten Sie die Inhalte Ihrer Architektur-Website einfach und intuitiv." />
      </Helmet>
      
      <AdminPanel />
    </>
  );
};

export default AdminPage;