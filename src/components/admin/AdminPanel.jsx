import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminTabs from '@/components/admin/AdminTabs';
import TeamEditTab from '@/components/admin/TeamEditTab';
import ProjectsEditTab from '@/components/admin/ProjectsEditTab';
import ImagesEditTab from '@/components/admin/ImagesEditTab';
import AdminInfoBox from '@/components/admin/AdminInfoBox';

const AdminPanel = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('team');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <AdminHeader isEditing={isEditing} setIsEditing={setIsEditing} />
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="p-6">
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