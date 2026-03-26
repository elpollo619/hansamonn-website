import { supabase } from '@/lib/supabase';

/**
 * Fire-and-forget: insert a view event for a property.
 * Never throws — safe to call without await.
 */
export async function trackPropertyView(propertyId, propertyName) {
  try {
    await supabase.from('property_views').insert({ property_id: propertyId, property_name: propertyName });
  } catch {
    // silently ignore
  }
}

/**
 * Returns [{property_id, property_name, count}] sorted by count desc.
 * Aggregates client-side because Supabase JS v2 doesn't expose GROUP BY directly.
 */
export async function getPropertyViewStats() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('property_views')
      .select('property_id, property_name')
      .gte('created_at', thirtyDaysAgo);
    if (error) throw error;
    if (!data) return [];

    const map = {};
    for (const row of data) {
      const key = row.property_id;
      if (!map[key]) map[key] = { property_id: key, property_name: row.property_name, count: 0 };
      map[key].count += 1;
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  } catch {
    return [];
  }
}

/** Count of mietanfragen */
export async function getMietanfragenCount() {
  try {
    const { count, error } = await supabase
      .from('mietanfragen')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Count of newsletter subscribers */
export async function getNewsletterCount() {
  try {
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Count of testimonials */
export async function getTestimonialsCount() {
  try {
    const { count, error } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Count of published blog posts */
export async function getBlogPostsCount() {
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}
