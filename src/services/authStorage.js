import { buildUserFromToken } from "../utils/jwt";

/**
 * New storage keys (preferred)
 */
const AUTH_TOKENS_KEY = "sahtek.auth.tokens"; // stores the whole session (access, refresh, user)
const SESSION_STORAGE_KEY = "sahtek.session"; // optional transient storage (not used by current code but reserved)
/**
 * Legacy key kept for backward compatibility – older releases stored the session under this key.
 */
const LEGACY_AUTH_KEY = "sahtek.auth.session";

const AUTH_CHANGE_EVENT = "sahtek:auth-change";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function notifyAuthChange(session) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: session,
    })
  );
}

function getCleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function buildDisplayName(firstName, lastName) {
  const parts = [getCleanString(firstName), getCleanString(lastName)].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined)
  );
}

function extractUserData(source) {
  if (!source || typeof source !== "object") {
    return {};
  }

  const firstName = getCleanString(source.firstName);
  const lastName = getCleanString(source.lastName);

  return compactObject({
    id: source.id ?? source.sub ?? null,
    email: getCleanString(source.email),
    role: getCleanString(source.role),
    name:
      getCleanString(source.name ?? source.fullName) ??
      buildDisplayName(firstName, lastName),
    firstName,
    lastName,
    phone: getCleanString(source.phone ?? source.phoneNumber),
    gender: getCleanString(source.gender),
    dateOfBirth: getCleanString(source.dateOfBirth ?? source.birthDate),
  });
}

function normalizeSession(session, fallbackUser = null) {
  if (!session?.accessToken && !session?.refreshToken) {
    return null;
  }

  const user = {
    ...extractUserData(fallbackUser),
    ...extractUserData(session),
    ...extractUserData(session.user),
    ...extractUserData(buildUserFromToken(session.accessToken || session.refreshToken)),
  };

  if (!user.name) {
    user.name = buildDisplayName(user.firstName, user.lastName);
  }

  if (!user?.role) {
    return null;
  }

  return {
    accessToken: session.accessToken ?? null,
    refreshToken: session.refreshToken ?? null,
    user,
  };
}

/**
 * Save the full auth session (access, refresh, user) in localStorage under the new key.
 * For backward compatibility we also keep the legacy key until the next major version.
 */
export function saveAuthSession(authPayload, fallbackUser = null) {
  const session = normalizeSession(authPayload, fallbackUser);

  if (!session || !canUseStorage()) {
    return null;
  }

  const serialized = JSON.stringify(session);
  // Preferred storage
  window.localStorage.setItem(AUTH_TOKENS_KEY, serialized);
  // Legacy storage – keep it so that older code can still read it
  window.localStorage.setItem(LEGACY_AUTH_KEY, serialized);

  // Optional: also store a lightweight copy in sessionStorage for quick per‑tab access
  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
  }

  notifyAuthChange(session);
  return session;
}

/** Retrieve the stored auth session, preferring the new localStorage key, falling back to legacy. */
export function getStoredAuthSession() {
  if (!canUseStorage()) {
    return null;
  }
  const raw =
    window.localStorage.getItem(AUTH_TOKENS_KEY) ||
    window.localStorage.getItem(LEGACY_AUTH_KEY);
  if (!raw) {
    return null;
  }
  try {
    return normalizeSession(JSON.parse(raw));
  } catch {
    // Corrupted data – clean both keys
    window.localStorage.removeItem(AUTH_TOKENS_KEY);
    window.localStorage.removeItem(LEGACY_AUTH_KEY);
    return null;
  }
}

/** Helper: return only the token pair */
export function getStoredTokens() {
  const session = getStoredAuthSession();
  if (!session) return null;
  return { accessToken: session.accessToken, refreshToken: session.refreshToken };
}

/** Helper: return only the user object */
export function getStoredUser() {
  const session = getStoredAuthSession();
  return session?.user ?? null;
}

export function getStoredAccessToken() {
  return getStoredAuthSession()?.accessToken ?? null;
}

export function getStoredRefreshToken() {
  return getStoredAuthSession()?.refreshToken ?? null;
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKENS_KEY);
  window.localStorage.removeItem(LEGACY_AUTH_KEY);
  if (canUseSessionStorage()) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
  notifyAuthChange(null);
}

export function subscribeToAuthChanges(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (event) => {
    listener(event.detail ?? getStoredAuthSession());
  };

  const handleStorageEvent = (event) => {
    if (event.key === AUTH_TOKENS_KEY || event.key === LEGACY_AUTH_KEY) {
      listener(getStoredAuthSession());
    }
  };

  window.addEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
