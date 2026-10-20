"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import {
  loginAction,
  signupAction,
  type LoginState,
  type SignupState,
} from "./actions";

/* ─────────────────── URL error → human-readable map ─────────────────── */

const URL_ERROR_MESSAGES: Record<string, string> = {
  missing_code:
    "The confirmation link is invalid or has expired. Please try signing up again.",
  invalid_code:
    "The confirmation link is invalid or has already been used. Please try signing up again.",
  callback_failed:
    "Something went wrong during email verification. Please try again.",
};

/* ────────────────────────── Component ────────────────────────── */

const loginInitial: LoginState = {};
const signupInitial: SignupState = {};

export function LoginForm() {
  /* ── Tab state ── */
  const [mode, setMode] = useState<"login" | "signup">("login");

  /* ── Form state ── */
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    loginInitial,
  );
  const [signupState, signupFormAction, signupPending] = useActionState(
    signupAction,
    signupInitial,
  );

  /* ── UI state ── */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  /* ── URL error params (from /auth/callback redirects) ── */
  const searchParams = useSearchParams();
  const urlErrorCode = searchParams.get("error");
  const urlError = urlErrorCode
    ? URL_ERROR_MESSAGES[urlErrorCode] ?? "An error occurred. Please try again."
    : null;

  /* ── Derived values ── */
  const isLogin = mode === "login";
  const isPending = isLogin ? loginPending : signupPending;
  const error = isLogin ? loginState.error : signupState.error;
  const success = !isLogin ? signupState.success : undefined;
  const emailValue = isLogin
    ? loginState.fields?.email ?? ""
    : signupState.fields?.email ?? "";

  // Focus email field on error
  useEffect(() => {
    if (error || urlError) {
      emailRef.current?.focus();
    }
  }, [error, urlError]);

  // Reset password visibility when switching modes
  useEffect(() => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [mode]);

  /* ── Shared input style helpers ── */
  const inputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#61F20B";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(97,242,11,0.15)";
  };
  const inputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#E8E9E1";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Mode tabs ── */}
      <div
        className="flex rounded-xl p-1"
        style={{ backgroundColor: "#F2F1E7" }}
      >
        <button
          type="button"
          onClick={() => setMode("login")}
          className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all"
          style={{
            backgroundColor: isLogin ? "#FFFFFF" : "transparent",
            color: isLogin ? "#20271F" : "#85877D",
            boxShadow: isLogin
              ? "0 1px 3px rgba(0,0,0,0.08)"
              : "none",
          }}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all"
          style={{
            backgroundColor: !isLogin ? "#FFFFFF" : "transparent",
            color: !isLogin ? "#20271F" : "#85877D",
            boxShadow: !isLogin
              ? "0 1px 3px rgba(0,0,0,0.08)"
              : "none",
          }}
        >
          Create account
        </button>
      </div>

      {/* ── URL error banner (from callback redirects) ── */}
      {urlError && (
        <AlertBanner variant="error">{urlError}</AlertBanner>
      )}

      {/* ── Form ── */}
      {isLogin ? (
        <LoginFormFields
          key="login"
          formAction={loginFormAction}
          isPending={loginPending}
          error={loginState.error}
          emailValue={emailValue}
          emailRef={emailRef}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          inputFocus={inputFocus}
          inputBlur={inputBlur}
        />
      ) : (
        <SignupFormFields
          key="signup"
          formAction={signupFormAction}
          isPending={signupPending}
          error={signupState.error}
          success={signupState.success}
          emailValue={emailValue}
          emailRef={emailRef}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          inputFocus={inputFocus}
          inputBlur={inputBlur}
        />
      )}

      {/* Secure access note */}
      <div className="flex items-center justify-center gap-2">
        <ShieldCheck
          className="h-4 w-4 shrink-0"
          style={{ color: "#85877D" }}
          aria-hidden="true"
        />
        <span className="text-xs" style={{ color: "#85877D" }}>
          Secure access. Ready for the day.
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════ Alert Banner ═══════════════════════ */

function AlertBanner({
  variant,
  children,
}: {
  variant: "error" | "success";
  children: React.ReactNode;
}) {
  const isError = variant === "error";
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      {isError ? (
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 5v3.5M8 10.5v.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5.5 8.5 L7 10 L10.5 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════ Spinner SVG ═══════════════════════ */

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ═══════════════════════ Login Fields ═══════════════════════ */

function LoginFormFields({
  formAction,
  isPending,
  error,
  emailValue,
  emailRef,
  showPassword,
  setShowPassword,
  inputFocus,
  inputBlur,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  error?: string;
  emailValue: string;
  emailRef: React.RefObject<HTMLInputElement | null>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  inputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Error banner */}
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-email"
          className="text-sm font-semibold"
          style={{ color: "#20271F" }}
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#85877D" }}
            aria-hidden="true"
          />
          <input
            ref={emailRef}
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={emailValue}
            placeholder="you@business.com"
            aria-describedby={error ? "login-error" : undefined}
            className="h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
            style={{
              borderColor: "#E8E9E1",
              backgroundColor: "#F7F7F3",
              color: "#20271F",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="login-password"
          className="text-sm font-semibold"
          style={{ color: "#20271F" }}
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#85877D" }}
            aria-hidden="true"
          />
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-12 w-full rounded-xl border pl-10 pr-12 text-sm outline-none transition-all"
            style={{
              borderColor: "#E8E9E1",
              backgroundColor: "#F7F7F3",
              color: "#20271F",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
            style={{ color: "#85877D" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#20271F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#85877D")}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            name="rememberMe"
            defaultChecked
            className="h-4 w-4 cursor-pointer rounded border accent-[#61F20B]"
            style={{ accentColor: "#61F20B" }}
          />
          <span className="text-sm" style={{ color: "#85877D" }}>
            Remember me
          </span>
        </label>
        <a
          href="/forgot-password"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: "#1C5C12" }}
        >
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <SubmitButton isPending={isPending} label="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}

/* ═══════════════════════ Signup Fields ═══════════════════════ */

function SignupFormFields({
  formAction,
  isPending,
  error,
  success,
  emailValue,
  emailRef,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  inputFocus,
  inputBlur,
}: {
  formAction: (payload: FormData) => void;
  isPending: boolean;
  error?: string;
  success?: string;
  emailValue: string;
  emailRef: React.RefObject<HTMLInputElement | null>;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  inputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  inputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  // If signup succeeded, show the success message instead of the form.
  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EDFCE3" }}
        >
          <Mail className="h-7 w-7" style={{ color: "#1C5C12" }} aria-hidden="true" />
        </div>
        <AlertBanner variant="success">{success}</AlertBanner>
        <p className="text-center text-xs" style={{ color: "#85877D" }}>
          Didn&apos;t receive the email? Check your spam folder or try signing up
          again with a different address.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {/* Error banner */}
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-email"
          className="text-sm font-semibold"
          style={{ color: "#20271F" }}
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#85877D" }}
            aria-hidden="true"
          />
          <input
            ref={emailRef}
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={emailValue}
            placeholder="you@business.com"
            className="h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition-all"
            style={{
              borderColor: "#E8E9E1",
              backgroundColor: "#F7F7F3",
              color: "#20271F",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-password"
          className="text-sm font-semibold"
          style={{ color: "#20271F" }}
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#85877D" }}
            aria-hidden="true"
          />
          <input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
            className="h-12 w-full rounded-xl border pl-10 pr-12 text-sm outline-none transition-all"
            style={{
              borderColor: "#E8E9E1",
              backgroundColor: "#F7F7F3",
              color: "#20271F",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
            style={{ color: "#85877D" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#20271F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#85877D")}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="signup-confirm-password"
          className="text-sm font-semibold"
          style={{ color: "#20271F" }}
        >
          Confirm password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "#85877D" }}
            aria-hidden="true"
          />
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className="h-12 w-full rounded-xl border pl-10 pr-12 text-sm outline-none transition-all"
            style={{
              borderColor: "#E8E9E1",
              backgroundColor: "#F7F7F3",
              color: "#20271F",
            }}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 transition-colors"
            style={{ color: "#85877D" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#20271F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#85877D")}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Submit */}
      <SubmitButton
        isPending={isPending}
        label="Create account"
        pendingLabel="Creating account…"
        icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
      />
    </form>
  );
}

/* ═══════════════════════ Submit Button ═══════════════════════ */

function SubmitButton({
  isPending,
  label,
  pendingLabel,
  icon,
}: {
  isPending: boolean;
  label: string;
  pendingLabel: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      style={{
        backgroundColor: isPending ? "#4acc08" : "#61F20B",
        color: "#20271F",
      }}
      onMouseEnter={(e) => {
        if (!isPending) e.currentTarget.style.backgroundColor = "#55d80a";
      }}
      onMouseLeave={(e) => {
        if (!isPending) e.currentTarget.style.backgroundColor = "#61F20B";
      }}
    >
      {isPending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          {icon ?? <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </>
      )}
    </button>
  );
}
