import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdminHeader = ({ isEditing, setIsEditing }) => {
  const handleSave = () => {
    toast({
      title: "✅ Änderungen gespeichert!",
      description: "Alle Inhalte wurden erfolgreich aktualisiert. (Demo)"
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6 mb-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Content Management
          </h1>
          <p className="text-gray-600">
            Bearbeiten Sie Inhalte, Bilder und Informationen Ihrer Website
          </p>
        </div>
        <div className="flex space-x-4">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="brand-gradient hover:brand-gradient-hover text-white"
            >
              <Edit3 size={16} className="mr-2" />
              Bearbeiten
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              className="text-white"
              >
                <Save size={16} className="mr-2" />
                Speichern
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="border-gray-300"
              >
                <X size={16} className="mr-2" />
                Abbrechen
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminHeader;