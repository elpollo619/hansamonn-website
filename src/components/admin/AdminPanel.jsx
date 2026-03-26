import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import TeamEditTab from '@/components/admin/TeamEditTab';
import ProjectsEditTab from '@/components/admin/ProjectsEditTab';
import ImagesEditTab from '@/components/admin/ImagesEditTab';
import AdminInfoBox from '@/components/admin/AdminInfoBox';
import PropertiesTab from '@/components/admin/PropertiesTab';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { LogOut } from 'lucide-react';

const AdminPanel = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Top bar with logout */}
        <div className="flex items-center justify-between mb-2">
          <div />
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <LogOut size={14} />
            Abmelden
          </button>
        </div>

        <AdminHeader isEditing={isEditing} setIsEditing={setIsEditing} />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === 'properties' && <PropertiesTab />}
            {activeTab === 'team' && <TeamEditTab isEditing={isEditing} />}
            {activeTab === 'projects' && <ProjectsEditTab isEditing={isEditing} />}
            {activeTab === 'images' && <ImagesEditTab />}
          </div>
        </div>

        <AdminInfoBox />
      </div>
    </div>
  );
};

export default AdminPanel;
