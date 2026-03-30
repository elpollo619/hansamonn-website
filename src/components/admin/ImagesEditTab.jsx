import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, AlertTriangle, ImageIcon, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const KEY = 'ha_images_v1';

function getImages() {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
}
function saveImages(imgs) { localStorage.setItem(KEY, JSON.stringify(imgs)); }

const CATEGORIES = ['Allgemein', 'Team', 'Projekte', 'Immobilien', 'Hero'];

export default function ImagesEditTab() {
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState('');
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Allgemein');
  const [filterCat, setFilterCat] = useState('Alle');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => { setImages(getImages()); }, []);

  function addImage() {
    if (!url.trim()) { toast({ title: 'URL ist erforderlich', variant: 'destructive' }); return; }
    const img = { id: Date.now().toString(), url: url.trim(), label: label.trim() || url.trim().split('/').pop(), category, createdAt: new Date().toISOString() };
    const updated = [img, ...getImages()];
    saveImages(updated); setImages(updated);
    setUrl(''); setLabel('');
    toast({ title: '✓ Bild hinzugefügt' });
  }

  function doDelete(id) {
    const updated = images.filter(i => i.id !== id);
    saveImages(updated); setImages(updated);
    setDeleteConfirm(null);
    toast({ title: '✓ Bild entfernt' });
  }

  function copyUrl(url, id) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast({ title: '✓ URL kopiert' });
    });
  }

  const filtered = filterCat === 'Alle' ? images : images.filter(i => i.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-gray-900">Bilderverwaltung</h2><p className="text-sm text-gray-500">{images.length} Bilder gespeichert</p></div>
      </div>

      {/* Add image */}
      <div className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Bild-URL hinzufügen</h3>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <div className="md:col-span-2">
            <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && addImage()} placeholder="https://bild-url.com/foto.jpg" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex gap-3">
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Bezeichnung (optional)" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white" />
          <button onClick={addImage} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors flex-shrink-0"><Plus size={16} /> Hinzufügen</button>
        </div>
      </div>

      {/* Filter */}
      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {['Alle', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterCat === c ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{c}</button>
          ))}
        </div>
      )}

      {/* Gallery */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:border-gray-400 transition-colors">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={e => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'#9ca3af\' stroke-width=\'1.5\'><rect x=\'3\' y=\'3\' width=\'18\' height=\'18\' rx=\'2\'/><circle cx=\'8.5\' cy=\'8.5\' r=\'1.5\'/><path d=\'m21 15-5-5L5 21\'/></svg></div>'; }} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => copyUrl(img.url, img.id)} className="p-1.5 bg-white rounded-lg shadow text-gray-700 hover:text-gray-900 transition-colors" title="URL kopieren">
                    {copied === img.id ? <Check size={14} className="text-gray-700" /> : <Copy size={14} />}
                  </button>
                  <a href={img.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white rounded-lg shadow text-gray-700 hover:text-gray-900 transition-colors" title="Öffnen"><ExternalLink size={14} /></a>
                  <button onClick={() => setDeleteConfirm(img.id)} className="p-1.5 bg-white rounded-lg shadow text-red-500 hover:text-red-700 transition-colors" title="Löschen"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-700 truncate">{img.label}</p>
                <p className="text-xs text-gray-400">{img.category}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-lg">
          <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Noch keine Bilder gespeichert</p>
          <p className="text-xs text-gray-300 mt-1">Füge eine Bild-URL oben hinzu</p>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <div className="flex items-start gap-3 mb-5"><AlertTriangle size={22} className="text-red-500 flex-shrink-0 mt-0.5" /><div><h3 className="font-bold text-gray-900 mb-1">Bild entfernen?</h3><p className="text-sm text-gray-500">Das Bild wird aus der Verwaltung entfernt.</p></div></div>
            <div className="flex gap-3">
              <button onClick={() => doDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Entfernen</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
