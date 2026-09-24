/**
 * Reads the JWT from localStorage in the browser.
 * Returns null during SSR / when not logged in.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
}
