import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, File, Loader2, AlertCircle } from 'lucide-react';
import { getDocumentsByProperty, uploadDocument, deleteDocument, getPublicUrl } from '@/data/documentsStore';
import { toast } from '@/components/ui/use-toast';

export default function PropertyDocumentsManager({ propertyId }) {
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const fileRef = useRef(null);

  const reload = () => {
    if (!propertyId) return;
    setLoading(true);
    getDocumentsByProperty(String(propertyId))
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [propertyId]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !propertyId) return;
    if (file.size > 20 * 1024 * 1024) { toast({ title: 'Datei zu groß (max. 20 MB)', variant: 'destructive' }); return; }
    setUploading(true);
    try {
      await uploadDocument(String(propertyId), file, nameInput.trim() || file.name);
      toast({ title: '✓ Dokument hochgeladen' });
      setNameInput('');
      reload();
    } catch (err) {
      toast({ title: 'Fehler beim Upload', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(doc) {
    if (!confirm(`"${doc.name}" löschen?`)) return;
    try {
      await deleteDocument(doc.id, doc.file_path);
      toast({ title: '✓ Gelöscht' });
      setDocs(d => d.filter(x => x.id !== doc.id));
    } catch (err) {
      toast({ title: 'Fehler', description: err.message, variant: 'destructive' });
    }
  }

  if (!propertyId) return <p className="text-xs text-gray-400">Speichern Sie die Immobilie zuerst, um Dokumente hinzuzufügen.</p>;

  return (
    <div className="space-y-3">
      {/* Existing docs */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400"><Loader2 size={12} className="animate-spin" /> Lade…</div>
      ) : docs.length > 0 ? (
        <div className="space-y-1.5">
          {docs.map(doc => (
            <div key={doc.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
              <File size={14} className="text-blue-500 flex-shrink-0" />
              <a href={getPublicUrl(doc.file_path)} target="_blank" rel="noopener noreferrer"
                className="flex-1 text-xs text-gray-700 hover:text-blue-600 truncate font-medium">{doc.name}</a>
              <button onClick={() => handleDelete(doc)} className="p-1 text-gray-300 hover:text-red-500 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Noch keine Dokumente.</p>
      )}

      {/* Upload */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)}
          placeholder="Anzeigename (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400" />
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" className="hidden" onChange={handleUpload} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg py-2.5 text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50">
          {uploading ? <><Loader2 size={13} className="animate-spin" /> Hochladen…</> : <><Upload size={13} /> Dokument hochladen (PDF, Word, Excel, ZIP)</>}
        </button>
      </div>
    </div>
  );
}
