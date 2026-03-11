/**
 * Utilities for working with JWT tokens and session data.
 * We avoid storing full user objects in localStorage to prevent
 * sensitive user details from being visible in DevTools.
 */

/**
 * Decode the payload from a JWT token (no verification — done server-side).
 */
export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Get the stored JWT token from localStorage.
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Get the current user's ID decoded from the JWT token.
 * Falls back to sessionStorage user id if needed.
 */
export function getUserId() {
  const token = getToken();
  if (token) {
    const payload = decodeToken(token);
    // JWT sub field contains email; user id is stored separately in sessionStorage
    // We store only the id in sessionStorage (not email or password)
    const id = sessionStorage.getItem("uid");
    return id ? Number(id) : null;
  }
  return null;
}

/**
 * Save session data. Stores only a numeric id and display name.
 * Called after login/register.
 */
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  // Store only the minimum needed for UI display in sessionStorage
  sessionStorage.setItem("uid", user.id);
  sessionStorage.setItem("uname", user.name || "");
  sessionStorage.setItem("uemail", user.email || "");
  sessionStorage.setItem("uavatar", user.avatar || "");
}

/**
 * Restore the minimal user object needed by the UI from sessionStorage.
 */
export function getSessionUser() {
  const uid = sessionStorage.getItem("uid");
  if (!uid) return null;
  return {
    id: Number(uid),
    name: sessionStorage.getItem("uname") || "",
    email: sessionStorage.getItem("uemail") || "",
    avatar: sessionStorage.getItem("uavatar") || "",
  };
}

/**
 * Clear all session data on logout.
 */
export function clearSession() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("uid");
  sessionStorage.removeItem("uname");
  sessionStorage.removeItem("uemail");
  sessionStorage.removeItem("uavatar");
}
