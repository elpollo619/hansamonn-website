import { supabase } from '@/lib/supabase';

// ── Public: only published posts, newest first ──────────────────────────────
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Public: single post by slug ─────────────────────────────────────────────
export async function getBlogPostBySlug(slug) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  if (error) return null;
  return data;
}

// ── Admin: all posts (published + drafts) ───────────────────────────────────
export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Admin: create ────────────────────────────────────────────────────────────
export async function createBlogPost(postData) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ ...postData, updated_at: new Date().toISOString() }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Admin: update ────────────────────────────────────────────────────────────
export async function updateBlogPost(id, postData) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Admin: delete ────────────────────────────────────────────────────────────
export async function deleteBlogPost(id) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
