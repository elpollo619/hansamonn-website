import { supabase } from '@/lib/supabase';

/**
 * Fire-and-forget activity log insert.
 * @param {string} action      - Human-readable action label
 * @param {string} entityType  - e.g. "Immobilien", "Mietanfragen"
 * @param {string} entityName  - Name of the affected record
 * @param {string} [details]   - Optional extra info
 */
export async function logActivity(action, entityType, entityName, details) {
  try {
    let userName = 'Admin';
    try {
      const raw = localStorage.getItem('ha_admin_session');
      if (raw) {
        const session = JSON.parse(raw);
        if (session?.name) userName = session.name;
      }
    } catch {
      // ignore
    }

    await supabase.from('activity_log').insert({
      user_name: userName,
      action,
      entity_type: entityType ?? null,
      entity_name: entityName ?? null,
      details: details ?? null,
    });
  } catch {
    // fire-and-forget — never throw
  }
}

/**
 * Fetch recent activity log entries.
 * @param {number} limit - Max entries to return (default 50)
 */
export async function getActivityLog(limit = 50) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Delete all activity log entries.
 */
export async function clearActivityLog() {
  const { error } = await supabase
    .from('activity_log')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows

  if (error) throw error;
}
