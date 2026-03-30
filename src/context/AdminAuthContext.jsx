import React, { createContext, useContext, useState } from 'react';
import { validateCredentials } from '@/data/usersStore';

const STORAGE_KEY    = 'ha_admin_user';
const LOCKOUT_KEY    = 'ha_login_lockout';
const MAX_ATTEMPTS   = 5;
const LOCKOUT_MS     = 15 * 60 * 1000; // 15 minutes

const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

// ── Lockout helpers ──────────────────────────────────────────────────────────
function getLockoutData() {
  try {
    return JSON.parse(localStorage.getItem(LOCKOUT_KEY)) || { count: 0, lockedUntil: null };
  } catch {
    return { count: 0, lockedUntil: null };
  }
}

function saveLockoutData(data) {
  localStorage.setItem(LOCKOUT_KEY, JSON.stringify(data));
}

function checkLockout() {
  const { count, lockedUntil } = getLockoutData();
  if (lockedUntil && Date.now() < lockedUntil) {
    const remainingMinutes = Math.ceil((lockedUntil - Date.now()) / 60000);
    return { locked: true, remainingMinutes, attemptsLeft: 0 };
  }
  return { locked: false, remainingMinutes: 0, attemptsLeft: Math.max(0, MAX_ATTEMPTS - count) };
}

function recordFailedAttempt() {
  const data = getLockoutData();
  // Reset count if previous lockout has expired
  const isExpiredLockout = data.lockedUntil && Date.now() >= data.lockedUntil;
  const count = isExpiredLockout ? 1 : data.count + 1;
  const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
  saveLockoutData({ count, lockedUntil });
  return { locked: Boolean(lockedUntil), attemptsLeft: Math.max(0, MAX_ATTEMPTS - count) };
}

function resetAttempts() {
  localStorage.removeItem(LOCKOUT_KEY);
}

// ── Provider ─────────────────────────────────────────────────────────────────
export default function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  /**
   * Returns { ok: true } on success.
   * Returns { ok: false, locked: boolean, remainingMinutes?: number, attemptsLeft?: number } on failure.
   */
  async function login(email, password) {
    // Check lockout first
    const lockState = checkLockout();
    if (lockState.locked) {
      return { ok: false, locked: true, remainingMinutes: lockState.remainingMinutes };
    }

    const validated = await validateCredentials(email, password);
    if (validated) {
      resetAttempts();
      setUser(validated);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      return { ok: true };
    }

    const after = recordFailedAttempt();
    return {
      ok: false,
      locked: after.locked,
      remainingMinutes: after.locked ? 15 : 0,
      attemptsLeft: after.attemptsLeft,
    };
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const isAuthenticated = Boolean(user);
  const isAdmin  = user?.role === 'admin';
  const isStaff  = user?.role === 'staff';
  const canDelete = isAdmin;
  const canManageUsers = isAdmin;

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, isAdmin, isStaff, canDelete, canManageUsers, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
