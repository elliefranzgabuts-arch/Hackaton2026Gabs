import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /auth/callback
 *
 * Supabase redirects here after the user clicks the email-confirmation
 * link. The `code` search parameter is exchanged for a session.
 *
 * On success → redirect to /dashboard (or a safe `redirect` param).
 * On failure → redirect to /login with an error message.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  // Validate that `redirectTo` is a relative path (prevent open-redirect).
  const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/dashboard";

  if (!code) {
    // No code — send the user to login with an error.
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.delete("code");
    loginUrl.searchParams.delete("redirect");
    loginUrl.searchParams.set(
      "error",
      "missing_code",
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.delete("code");
      loginUrl.searchParams.delete("redirect");
      loginUrl.searchParams.set("error", "invalid_code");
      return NextResponse.redirect(loginUrl);
    }

    // Session established — redirect to the target page.
    const destination = request.nextUrl.clone();
    destination.pathname = safeRedirect;
    destination.searchParams.delete("code");
    destination.searchParams.delete("redirect");
    return NextResponse.redirect(destination);
  } catch {
    // Supabase client creation failed (env vars missing, etc.).
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.delete("code");
    loginUrl.searchParams.delete("redirect");
    loginUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(loginUrl);
  }
}
