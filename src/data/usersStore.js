const KEY = 'ha_users_v1';

const DEFAULT_ADMIN = {
  id: 'admin-root',
  email: 'admin@hansamonn.ch',
  password: 'HansAmonn2024!',
  name: 'Administrator',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

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

export function validateCredentials(email, password) {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  const { password: _pw, ...safe } = user;
  return safe;
}

export function createUser(data) {
  const users = getUsers();
  if (getUserByEmail(data.email)) throw new Error('E-Mail bereits vergeben');
  const user = {
    id: Date.now().toString(),
    email: data.email,
    password: data.password,
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
export function changeOwnPassword(userId, currentPassword, newPassword) {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Benutzer nicht gefunden');
  if (users[idx].password !== currentPassword) throw new Error('Aktuelles Passwort ist falsch');
  if (!newPassword || newPassword.length < 6) throw new Error('Neues Passwort muss mindestens 6 Zeichen haben');
  users[idx] = { ...users[idx], password: newPassword };
  _save(users);
  return true;
}

/**
 * Admin resets another user's password — no current password check.
 */
export function adminResetPassword(targetUserId, newPassword) {
  if (!newPassword || newPassword.length < 6) throw new Error('Passwort muss mindestens 6 Zeichen haben');
  const users = getUsers();
  const idx = users.findIndex(u => u.id === targetUserId);
  if (idx === -1) throw new Error('Benutzer nicht gefunden');
  users[idx] = { ...users[idx], password: newPassword };
  _save(users);
  return true;
}
