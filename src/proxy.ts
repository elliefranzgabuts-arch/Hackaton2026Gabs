import { type NextRequest, NextResponse } from "next/server";
import type { ProxyConfig } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Next.js 16 proxy (replaces deprecated middleware.ts).
 *
 * Responsibilities:
 * 1. Refresh the Supabase auth session on every navigation so the cookie
 *    never goes stale (required by @supabase/ssr).
 * 2. Redirect unauthenticated users away from protected routes.
 * 3. Redirect authenticated users away from auth pages (login, etc.).
 *
 * Authorization is checked server-side by reading the session via
 * `supabase.auth.getUser()` — NOT by trusting the cookie alone.
 */

const PUBLIC_ROUTES = new Set([
  "/login",
  "/forgot-password",
  "/auth/callback",
]);

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.has(pathname) ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let static assets / API routes through without touching auth.
  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // ── Supabase session refresh ───────────────────────────────────
  // We build a response, then let the Supabase client read/write
  // cookies through it. This keeps the auth cookie fresh.
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Supabase is not configured — let the page render its own error.
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Forward cookies onto the request so server components see them.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        // Also set them on the outgoing response so the browser stores them.
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Skip auth checks for /auth/callback — the route handler needs to
  // call exchangeCodeForSession() with a clean cookie state. Running
  // getUser() here would interfere with the code exchange and cause
  // "invalid_code" errors on email-confirmation links.
  if (pathname === "/auth/callback") {
    return supabaseResponse;
  }

  // IMPORTANT: Use getUser(), not getSession(). getSession() only reads
  // the JWT from the cookie which can be spoofed. getUser() makes a
  // server call to Supabase to validate the token.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Route protection ───────────────────────────────────────────

  const isAuthenticated = !!user;

  if (!isAuthenticated && !isPublicRoute(pathname)) {
    // Unauthenticated user trying to access a protected route.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/")) {
    // Authenticated user hitting login or root — send to dashboard.
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config: ProxyConfig = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
