const KEY = 'ha_users_v1';

const DEFAULT_ADMIN = {
  id: 'admin-root',
  email: 'admin@hansamonn.ch',
  password: 'HansAmonn2024!',
  name: 'Administrator',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

// ── Hashing ──────────────────────────────────────────────────────────────────

async function hashPassword(plaintext) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(plaintext),
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** SHA-256 hex is exactly 64 lowercase hex chars. */
function isHashed(pw) {
  return typeof pw === 'string' && /^[0-9a-f]{64}$/.test(pw);
}

// ── Storage helpers ───────────────────────────────────────────────────────────

export function getUsers() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    _save([DEFAULT_ADMIN]);
    return [DEFAULT_ADMIN];
  } catch {
    return [DEFAULT_ADMIN];
  }
}

function _save(users) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function getUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Async — hashes the supplied password and compares to stored value.
 * Lazy migration: if the stored password is still plaintext and matches,
 * it is transparently re-saved as a hash.
 */
export async function validateCredentials(email, password) {
  const users  = getUsers();
  const idx    = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return null;

  const user = users[idx];

  if (isHashed(user.password)) {
    // Stored hash — compare against hash of supplied password
    const supplied = await hashPassword(password);
    if (supplied !== user.password) return null;
  } else {
    // Plaintext (legacy) — compare directly
    if (user.password !== password) return null;
    // Lazy migration: upgrade to hashed storage
    const hashed = await hashPassword(password);
    users[idx] = { ...user, password: hashed };
    _save(users);
  }

  const { password: _pw, ...safe } = users[idx];
  return safe;
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createUser(data) {
  const users = getUsers();
  if (getUserByEmail(data.email)) throw new Error('E-Mail bereits vergeben');
  const hashed = await hashPassword(data.password);
  const user = {
    id: Date.now().toString(),
    email: data.email,
    password: hashed,
    name: data.name || data.email,
    role: data.role || 'staff',
    createdAt: new Date().toISOString(),
  };
  _save([...users, user]);
  return user;
}

export function updateUser(id, data) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...data };
  _save(users);
  return users[idx];
}

export function deleteUser(id) {
  if (id === 'admin-root') throw new Error('Haupt-Admin kann nicht gelöscht werden');
  _save(getUsers().filter(u => u.id !== id));
}

/**
 * Change own password — requires current password to be correct.
 * Returns true on success, throws on error.
 */
export async function changeOwnPassword(userId, currentPassword, newPassword) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Benutzer nicht gefunden');

  // Verify current password
  const user = users[idx];
  if (isHashed(user.password)) {
    const supplied = await hashPassword(currentPassword);
    if (supplied !== user.password) throw new Error('Aktuelles Passwort ist falsch');
  } else {
    if (user.password !== currentPassword) throw new Error('Aktuelles Passwort ist falsch');
  }

  if (!newPassword || newPassword.length < 6) throw new Error('Neues Passwort muss mindestens 6 Zeichen haben');
  const hashed = await hashPassword(newPassword);
  users[idx] = { ...users[idx], password: hashed };
  _save(users);
  return true;
}

/**
 * Admin resets another user's password — no current password check.
 */
export async function adminResetPassword(targetUserId, newPassword) {
  if (!newPassword || newPassword.length < 6) throw new Error('Passwort muss mindestens 6 Zeichen haben');
  const users = getUsers();
  const idx = users.findIndex(u => u.id === targetUserId);
  if (idx === -1) throw new Error('Benutzer nicht gefunden');
  const hashed = await hashPassword(newPassword);
  users[idx] = { ...users[idx], password: hashed };
  _save(users);
  return true;
}
