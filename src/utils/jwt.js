function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );

  return atob(padded);
}

export function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now() + 5000;
}

function getCleanString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function buildDisplayName(firstName, lastName) {
  const parts = [getCleanString(firstName), getCleanString(lastName)].filter(Boolean);
  return parts.length ? parts.join(" ") : null;
}

export function buildUserFromToken(token) {
  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  const firstName = getCleanString(payload.firstName ?? payload.given_name);
  const lastName = getCleanString(payload.lastName ?? payload.family_name);
  const name =
    getCleanString(payload.name ?? payload.fullName) ??
    buildDisplayName(firstName, lastName);

  return {
    id: payload.id ?? payload.sub ?? null,
    email: payload.email ?? null,
    role: payload.role ?? null,
    name,
    firstName,
    lastName,
  };
}
