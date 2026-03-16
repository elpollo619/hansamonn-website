import React from 'react';
import { Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ImagesEditTab = () => {
  const handleImageUpload = (type, id) => {
    toast({
      title: "🚧 Bild-Upload wird vorbereitet",
      description: "Diese Funktion wird in der nächsten Version verfügbar sein! 📸"
    });
  };

  return (
    <div className="text-center py-12">
      <Image size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Bilderverwaltung
      </h3>
      <p className="text-gray-600 mb-6">
        Hier können Sie alle Bilder Ihrer Website verwalten und neue hochladen.
      </p>
      <Button
        onClick={() => handleImageUpload('general', 0)}
        className="brand-gradient hover:brand-gradient-hover text-white"
      >
        <Upload size={16} className="mr-2" />
        Neue Bilder hochladen
      </Button>
    </div>
  );
};

export default ImagesEditTab;