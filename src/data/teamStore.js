import { teamMembers as staticTeam } from '@/components/TeamData';

const KEY = 'ha_team_v2';

function buildSeed() {
  return staticTeam.map((m, i) => ({
    id: String(m.id ?? i + 1),
    slug: m.slug ?? slugify(m.name ?? '') + '-' + (i + 1),
    name: m.name ?? '',
    position: m.position ?? '',
    email: m.email ?? '',
    education: m.education ?? '',
    experience: m.experience ?? '',
    specialization: m.specialization ?? '',
    description: m.description ?? '',
    photoUrl: m.photoUrl ?? '',
    hasPhoto: Boolean(m.photoUrl),
    visible: true,
    order: i,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function slugify(str) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function getTeam() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const seed = buildSeed();
    _save(seed);
    return seed;
  } catch {
    return buildSeed();
  }
}

function _save(members) {
  localStorage.setItem(KEY, JSON.stringify(members));
}

export function getVisibleTeam() {
  return getTeam()
    .filter(m => m.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getMemberBySlug(slug) {
  return getTeam().find(m => m.slug === slug) ?? null;
}

export function createMember(data) {
  const members = getTeam();
  const name = data.name || 'Neues Mitglied';
  const member = {
    ...data,
    id: Date.now().toString(),
    slug: slugify(name) + '-' + Date.now(),
    visible: data.visible !== false,
    order: members.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  _save([...members, member]);
  return member;
}

export function updateMember(id, data) {
  const members = getTeam();
  const idx = members.findIndex(m => String(m.id) === String(id));
  if (idx === -1) return null;
  members[idx] = { ...members[idx], ...data, updatedAt: new Date().toISOString() };
  _save(members);
  return members[idx];
}

export function deleteMember(id) {
  _save(getTeam().filter(m => String(m.id) !== String(id)));
}

export function reorderTeam(orderedIds) {
  const byId = Object.fromEntries(getTeam().map(m => [String(m.id), m]));
  const reordered = orderedIds.map((id, i) => byId[String(id)] ? { ...byId[String(id)], order: i } : null).filter(Boolean);
  _save(reordered);
}
