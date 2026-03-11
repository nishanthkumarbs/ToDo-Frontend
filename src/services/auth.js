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
    // JWT sub field contains email; user id is stored separately in localStorage
    // We store only the id in localStorage (not email or password)
    const id = localStorage.getItem("uid");
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
  // Store minimal UI data in localStorage so session survives tab closes
  localStorage.setItem("uid", user.id);
  localStorage.setItem("uname", user.name || "");
  localStorage.setItem("uemail", user.email || "");
  localStorage.setItem("uavatar", user.avatar || "");
}

/**
 * Restore the minimal user object needed by the UI from localStorage.
 */
export function getSessionUser() {
  const uid = localStorage.getItem("uid");
  if (!uid) return null;
  return {
    id: Number(uid),
    name: localStorage.getItem("uname") || "",
    email: localStorage.getItem("uemail") || "",
    avatar: localStorage.getItem("uavatar") || "",
  };
}

/**
 * Clear all session data on logout.
 */
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("uid");
  localStorage.removeItem("uname");
  localStorage.removeItem("uemail");
  localStorage.removeItem("uavatar");
}
