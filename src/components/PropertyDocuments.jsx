import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader2, FileArchive, File } from 'lucide-react';
import { getDocumentsByProperty, getPublicUrl } from '@/data/documentsStore';

const FILE_ICON = { pdf: FileText, zip: FileArchive, docx: File, doc: File };

function fmt(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PropertyDocuments({ propertyId }) {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    getDocumentsByProperty(String(propertyId))
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading || docs.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 p-5">
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <FileText size={16} className="text-gray-500" />
        Dokumente
      </h3>
      <div className="space-y-2">
        {docs.map(doc => {
          const Icon = FILE_ICON[doc.file_type] ?? File;
          return (
            <a key={doc.id} href={getPublicUrl(doc.file_path)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-colors group">
              <Icon size={18} className="text-gray-500 flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-700 font-medium truncate">{doc.name}</span>
              {doc.file_size && <span className="text-xs text-gray-400">{fmt(doc.file_size)}</span>}
              <Download size={14} className="text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
