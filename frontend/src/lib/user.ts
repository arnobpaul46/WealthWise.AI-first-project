const USER_ID_KEY = "wealthwise_user_id";
const FALLBACK_USER_ID = "6a5dfdd8cd2228d081b6b080";

export function getUserId(): string {
  if (typeof window === "undefined") return FALLBACK_USER_ID;
  return localStorage.getItem(USER_ID_KEY) || FALLBACK_USER_ID;
}

export function setUserId(id: string): void {
  localStorage.setItem(USER_ID_KEY, id);
}
