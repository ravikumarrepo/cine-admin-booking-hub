
import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPage;
