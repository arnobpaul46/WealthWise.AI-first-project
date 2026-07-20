export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("wealthwise_auth_sim") === "true";
};

export const getStoredUserId = () => {
  return localStorage.getItem("wealthwise_user_id") || "6a5dfdd8cd2228d081b6b080";
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};