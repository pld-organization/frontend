import { buildUserFromToken } from "./jwt";

const AUTH_STORAGE_KEY = "sahtek.auth.session";
const AUTH_CHANGE_EVENT = "sahtek:auth-change";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyAuthChange(session) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: session,
    }),
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
    Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined),
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

export function getStoredAuthSession() {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return normalizeSession(JSON.parse(rawSession));
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getStoredAccessToken() {
  return getStoredAuthSession()?.accessToken ?? null;
}

export function getStoredRefreshToken() {
  return getStoredAuthSession()?.refreshToken ?? null;
}

export function saveAuthSession(authPayload, fallbackUser = null) {
  const session = normalizeSession(authPayload, fallbackUser);

  if (!session || !canUseStorage()) {
    return null;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  notifyAuthChange(session);

  return session;
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
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
    if (event.key === AUTH_STORAGE_KEY) {
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
