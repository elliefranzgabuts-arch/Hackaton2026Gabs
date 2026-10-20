"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ─────────────────────── Shared types ─────────────────────── */

export type LoginState = {
  error?: string;
  fields?: { email?: string };
};

export type SignupState = {
  error?: string;
  success?: string;
  fields?: { email?: string };
};

/* ──────────────────────── Validation ──────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmailPassword(
  email: string,
  password: string,
): string | null {
  if (!email) return "Email address is required.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  if (!password) return "Password is required.";
  return null;
}

/* ──────────────────────── Login action ──────────────────────── */

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const validationError = validateEmailPassword(email, password);
  if (validationError) {
    return { error: validationError, fields: { email } };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return {
      error:
        "Authentication service is not configured. Please check your environment variables.",
      fields: { email },
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns "Email not confirmed" when the user exists but
    // hasn't clicked the verification link yet. Surface a helpful
    // message without revealing whether the account exists to others
    // — the same phrase is ambiguous enough when combined with
    // "Invalid login credentials".
    if (error.message === "Email not confirmed") {
      return {
        error:
          "Your email address has not been verified. Please check your inbox for a confirmation link.",
        fields: { email },
      };
    }

    // Generic invalid-credentials message (deliberately vague to
    // avoid leaking whether the email is registered).
    return {
      error: "Incorrect email or password. Please try again.",
      fields: { email },
    };
  }

  redirect("/dashboard");
}

/* ──────────────────────── Signup action ──────────────────────── */

export async function signupAction(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";

  const validationError = validateEmailPassword(email, password);
  if (validationError) {
    return { error: validationError, fields: { email } };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      fields: { email },
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", fields: { email } };
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return {
      error:
        "Authentication service is not configured. Please check your environment variables.",
      fields: { email },
    };
  }

  // Build the email-confirmation redirect URL.
  //
  // Prefer NEXT_PUBLIC_SITE_URL (explicit, trusted) so the confirmation
  // link always points to the right place regardless of headers.
  // Fall back to request headers only when the env var is not set.
  const headerStore = await headers();

  function getOrigin(): string | null {
    // 1. Explicit env var — always correct, not spoofable.
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) return siteUrl.replace(/\/+$/, "");

    // 2. Origin header (set by browsers on same-origin POST requests).
    const originHeader = headerStore.get("origin");
    if (originHeader) return originHeader;

    // 3. Forwarded host (reverse proxy / Vercel).
    const fwdHost = headerStore.get("x-forwarded-host");
    if (fwdHost) {
      const proto = headerStore.get("x-forwarded-proto") ?? "https";
      return `${proto}://${fwdHost}`;
    }

    // 4. Host header (direct access, local dev).
    const host = headerStore.get("host");
    if (host) {
      const proto = headerStore.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    }

    return null;
  }

  const origin = getOrigin();
  const emailRedirectTo = origin
    ? `${origin}/auth/callback`
    : undefined; // Let Supabase use its configured default.

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    // Don't reveal whether the email is already registered.
    // Supabase may return "User already registered" — map it to a
    // generic message so attackers can't enumerate accounts.
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("already been registered")
    ) {
      return {
        error:
          "Unable to create account. An account with this email may already exist, or please try a different email.",
        fields: { email },
      };
    }

    return {
      error: error.message,
      fields: { email },
    };
  }

  return {
    success:
      "Account created! Please check your email for a confirmation link to verify your account.",
    fields: { email },
  };
}
