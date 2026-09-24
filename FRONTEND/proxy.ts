import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Map: route prefix → roles allowed
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard/products':   ['admin', 'manager'],
  '/dashboard/purchases':  ['admin', 'manager'],
  '/dashboard/reports':    ['admin', 'manager'],
  '/dashboard/expenses':   ['admin', 'manager'],
  '/dashboard/settings':   ['admin'],
  '/dashboard/security':   ['admin'],
};

function readRole(req: NextRequest): string | null {
  // Prefer cookie — set on login by the client
  const cookie = req.cookies.get('user_role')?.value;
  if (cookie) return cookie;

  // Fallback: try to decode the JWT in the auth cookie
  const token = req.cookies.get('access_token')?.value;
  if (token) {
    try {
      const [, payload] = token.split('.');
      const json = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      if (json.role_id === 1) return 'admin';
      if (json.role_id === 2) return 'manager';
      if (json.role_id === 3) return 'cashier';
    } catch { /* ignore */ }
  }
  return null;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith('/dashboard')) return NextResponse.next();

  const role = readRole(req);

  // Not logged in → send to /login
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Check specific route restrictions
  for (const [prefix, allowed] of Object.entries(ROUTE_ROLES)) {
    if (pathname === prefix || pathname.startsWith(prefix + '/')) {
      if (!allowed.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        url.searchParams.set('denied', '1');
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
