import { projectsData as staticProjects, categories as staticCategories } from '@/components/ProjectData';

const KEY = 'ha_projects_v2';

function buildSeed() {
  return staticProjects.map((p, i) => ({
    ...p,
    id: String(p.id ?? i + 1),
    visible: true,
    order: i,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

// Re-attach non-serializable fields (React component icons) from the static source
// after loading from localStorage, since JSON.stringify drops function references.
function rehydrate(projects) {
  return projects.map((p) => {
    const staticMatch = staticProjects.find((s) => String(s.id) === String(p.id));
    if (!staticMatch) return p;
    return {
      ...p,
      amenities: (p.amenities || []).map((a, i) => ({
        ...a,
        icon: staticMatch.amenities?.[i]?.icon ?? null,
      })),
    };
  });
}

export function getProjects() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return rehydrate(JSON.parse(raw));
    const seed = buildSeed();
    _save(seed);
    return seed;
  } catch {
    return buildSeed();
  }
}

function _save(projects) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function getVisibleProjects() {
  return getProjects()
    .filter(p => p.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getProjectById(id) {
  return getProjects().find(p => String(p.id) === String(id)) ?? null;
}

export function getProjectBySlug(slug) {
  return getProjects().find(p => p.slug === slug) ?? null;
}

export function createProject(data) {
  const projects = getProjects();
  const title = data.title || 'Neues Projekt';
  const project = {
    ...data,
    id: Date.now().toString(),
    slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
    visible: data.visible !== false,
    order: projects.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  _save([...projects, project]);
  return project;
}

export function updateProject(id, data) {
  const projects = getProjects();
  const idx = projects.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...data, updatedAt: new Date().toISOString() };
  _save(projects);
  return projects[idx];
}

export function deleteProject(id) {
  _save(getProjects().filter(p => String(p.id) !== String(id)));
}

export { staticCategories as categories };
