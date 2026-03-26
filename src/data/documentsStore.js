import { supabase } from '@/lib/supabase';

const BUCKET = 'bewerber-dokumente';
const PREFIX = 'property-docs/';

export async function getDocumentsByProperty(propertyId) {
  const { data, error } = await supabase
    .from('property_documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('sort_order');
  if (error) throw error;
  return data ?? [];
}

export async function uploadDocument(propertyId, file, displayName) {
  const ext  = file.name.split('.').pop();
  const path = `${PREFIX}${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) throw upErr;

  const { error: dbErr } = await supabase.from('property_documents').insert([{
    property_id: propertyId,
    name:        displayName || file.name,
    file_path:   path,
    file_size:   file.size,
    file_type:   ext.toLowerCase(),
  }]);
  if (dbErr) throw dbErr;
}

export async function deleteDocument(id, filePath) {
  if (filePath) await supabase.storage.from(BUCKET).remove([filePath]);
  const { error } = await supabase.from('property_documents').delete().eq('id', id);
  if (error) throw error;
}

export function getPublicUrl(filePath) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
