const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
};

export const decodeJwtPayload = (token) => {
  if (typeof token !== "string") return null;

  try {
    const payload = token.split(".")[1];
    return payload ? JSON.parse(decodeBase64Url(payload)) : null;
  } catch {
    return null;
  }
};

export const getJwtRole = (token) => {
  const payload = decodeJwtPayload(token);
  const rawRole = payload?.role
    || payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    || payload?.roles;
  const role = Array.isArray(rawRole) ? rawRole[0] : rawRole;

  return typeof role === "string" ? role.trim().toUpperCase() : null;
};
