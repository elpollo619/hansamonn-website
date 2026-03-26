import { supabase } from '@/lib/supabase';

// ── Public: only visible FAQs, ordered by sort_order ────────────────────────
export async function getFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('visible', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Admin: all FAQs ──────────────────────────────────────────────────────────
export async function getAllFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Admin: create ────────────────────────────────────────────────────────────
export async function createFaq(faqData) {
  const { data, error } = await supabase
    .from('faqs')
    .insert([faqData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Admin: update ────────────────────────────────────────────────────────────
export async function updateFaq(id, faqData) {
  const { data, error } = await supabase
    .from('faqs')
    .update(faqData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Admin: delete ────────────────────────────────────────────────────────────
export async function deleteFaq(id) {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
