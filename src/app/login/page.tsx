import type { Metadata } from "next";
import { Suspense } from "react";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In — NEXORA POS & Inventory",
  description: "Sign in to your NEXORA business workspace.",
};

/* ─────────────────────────── SVG ASSETS ─────────────────────────── */

function NexoraShieldLogo() {
  return (
    <svg
      viewBox="0 0 260 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NEXORA shield logo"
      className="w-full max-w-[260px]"
    >
      <defs>
        {/* Outer shield: bright lime-green with a subtle upper-left highlight */}
        <linearGradient id="logo-outer-green" x1="25%" y1="0%" x2="75%" y2="100%">
          <stop offset="0%" stopColor="#84FF22" />
          <stop offset="50%" stopColor="#61F20B" />
          <stop offset="100%" stopColor="#4AB008" />
        </linearGradient>

        {/* Metallic silver / chrome rim between outer and inner shield */}
        <linearGradient id="logo-silver-rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#DCE8D8" />
          <stop offset="28%"  stopColor="#B2C2AC" />
          <stop offset="68%"  stopColor="#889880" />
          <stop offset="100%" stopColor="#647060" />
        </linearGradient>

        {/* Dark inner shield: very dark green-black, lighter at top */}
        <linearGradient id="logo-inner-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#243020" />
          <stop offset="100%" stopColor="#101610" />
        </linearGradient>
      </defs>

      {/* ── Layer 1: outer bright-green shield ── */}
      <path
        d="M130 6 L244 50 L244 161 C244 223 192 269 130 293 C68 269 16 223 16 161 L16 50 Z"
        fill="url(#logo-outer-green)"
        stroke="#131A10"
        strokeWidth="2"
      />

      {/* ── Layer 2: specular highlight (upper-left shine) ── */}
      <path
        d="M130 6 L244 50 L244 90 C213 74 166 38 130 6 Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* ── Layer 3: metallic silver rim ── */}
      <path
        d="M130 17 L233 58 L233 160 C233 215 184 259 130 282 C76 259 27 215 27 160 L27 58 Z"
        fill="url(#logo-silver-rim)"
      />

      {/* ── Layer 4: dark inner shield ── */}
      <path
        d="M130 28 L222 67 L222 159 C222 208 180 251 130 273 C80 251 38 208 38 159 L38 67 Z"
        fill="url(#logo-inner-dark)"
      />

      {/* ── Decorative chevron accent above NX monogram ── */}
      <path
        d="M78 108 L130 94 L182 108"
        stroke="#61F20B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />

      {/* ── NX monogram: large, bold, filled via SVG text ── */}
      <text
        x="130"
        y="184"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Impact', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="72"
        fill="#61F20B"
        letterSpacing="-1"
      >
        NX
      </text>

      {/* ── NEXORA wordmark ── */}
      <text
        x="130"
        y="216"
        textAnchor="middle"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="6"
        fill="#61F20B"
      >
        NEXORA
      </text>

      {/* ── Bottom accent bar ── */}
      <rect x="92" y="229" width="76" height="2" rx="1" fill="#61F20B" fillOpacity="0.35" />
    </svg>
  );
}

/* ─────────── Small shield icon: shared by header + mobile card ─────────── */
/* Fix #2: dark inner shield + lattice grid lines to match reference.         */

function SmallShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className ?? "h-8 w-auto"}
    >
      {/* Outer green shield */}
      <path
        d="M14 1 L26 5.5 L26 17.5 C26 23.5 20.5 28.5 14 31 C7.5 28.5 2 23.5 2 17.5 L2 5.5 Z"
        fill="#61F20B"
        stroke="#131A10"
        strokeWidth="1"
      />
      {/* Dark inner shield */}
      <path
        d="M14 4.5 L23 8 L23 17.5 C23 21.8 19 25 14 27 C9 25 5 21.8 5 17.5 L5 8 Z"
        fill="#20271F"
      />
      {/* Lattice grid — horizontal lines */}
      <line x1="5"   y1="12.5" x2="23"  y2="12.5" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="5"   y1="16"   x2="23"  y2="16"   stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="5.5" y1="19.5" x2="22"  y2="19.5" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      {/* Lattice grid — vertical lines */}
      <line x1="10"  y1="7.5"  x2="10"  y2="26"   stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="14"  y1="5.5"  x2="14"  y2="27"   stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="18"  y1="7.5"  x2="18"  y2="26"   stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
    </svg>
  );
}

/* ───────────── Decorative oversized shield outline (background) ───────────── */

function DecorativeShieldOutline({
  className,
  opacity = 0.07,
  scale = 1,
}: {
  className?: string;
  opacity?: number;
  scale?: number;
}) {
  return (
    <svg
      viewBox="0 0 260 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <path
        d="M130 8 L240 52 L240 160 C240 220 190 268 130 292 C70 268 20 220 20 160 L20 52 Z"
        stroke="#1C5C12"
        strokeWidth="2.5"
        fill="none"
      />
    </svg>
  );
}

/* ───────────── Angular decorative lines (bottom-left of left panel) ───────────── */

function AngularDecor() {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-28 opacity-20"
    >
      <path d="M0 70 L50 20 L100 20" stroke="#1C5C12" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M0 55 L40 15 L80 15"  stroke="#1C5C12" strokeWidth="1"   strokeLinecap="round" />
      <path d="M0 40 L30 10"          stroke="#1C5C12" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */

/* Loading skeleton for LoginForm while Suspense resolves useSearchParams */
function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      <div className="flex rounded-xl p-1" style={{ backgroundColor: "#F2F1E7" }}>
        <div className="flex-1 rounded-lg py-2 h-9" />
        <div className="flex-1 rounded-lg py-2 h-9" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-24 rounded" style={{ backgroundColor: "#E8E9E1" }} />
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#F7F7F3" }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-4 w-16 rounded" style={{ backgroundColor: "#E8E9E1" }} />
        <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#F7F7F3" }} />
      </div>
      <div className="h-12 w-full rounded-xl" style={{ backgroundColor: "#d4f5b0" }} />
    </div>
  );
}

export default function LoginPage() {
  return (
    /*
     * Fix #4: `colorScheme: "light"` scoped to this div prevents the OS
     * dark-mode preference from affecting browser-native form controls
     * (inputs, checkbox, button) within this page. All inline style colours
     * already pin the palette; this property handles the UA stylesheet layer.
     * No other pages or global CSS are modified.
     */
    <div
      className="flex min-h-screen w-full overflow-hidden"
      style={{ colorScheme: "light" }}
    >
      {/* ── LEFT PANEL ─────────────────────────────────────────────── */}
      <div
        className="relative hidden flex-col overflow-hidden lg:flex"
        style={{ width: "60%", backgroundColor: "#F2F1E7" }}
      >
        {/* Top-left brand header */}
        <div className="relative z-10 flex flex-col gap-0.5 p-10 xl:p-12">
          <div className="flex items-center gap-3">
            {/* Fix #2: SmallShieldIcon with lattice inner detail */}
            <SmallShieldIcon />
            <div className="flex flex-col leading-none">
              <span
                className="text-2xl font-black tracking-widest"
                style={{ color: "#20271F" }}
              >
                NEXORA
              </span>
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: "#85877D" }}
              >
                Food Business
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-[0.15em]"
                style={{ color: "#85877D" }}
              >
                POS &amp; Inventory System
              </span>
            </div>
          </div>
        </div>

        {/* Decorative oversized shield outlines (background) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <DecorativeShieldOutline
              className="absolute h-[520px] w-[520px]"
              opacity={0.06}
              scale={1.5}
            />
            <DecorativeShieldOutline
              className="absolute h-[520px] w-[520px]"
              opacity={0.04}
              scale={2}
            />
          </div>
        </div>

        {/*
         * Fix #3: `pb-16` shifts the logo's visual centre upward relative to
         * the available flex space, matching the reference's proportions where
         * the shield sits slightly above the panel's geometric midpoint.
         */}
        <div className="relative z-10 flex flex-1 items-center justify-center pb-16">
          <div className="flex flex-col items-center gap-6">
            {/* Fix #1: redesigned NexoraShieldLogo */}
            <NexoraShieldLogo />
            {/* Tagline under logo */}
            <div className="flex items-center gap-3">
              <div
                className="h-px w-16"
                style={{ backgroundColor: "#1C5C12", opacity: 0.3 }}
              />
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: "#85877D" }}
              >
                One workspace. Every order. Every item.
              </span>
              <div
                className="h-px w-16"
                style={{ backgroundColor: "#1C5C12", opacity: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="relative z-10 flex items-end justify-between p-10 xl:p-12">
          <div className="flex flex-col gap-2">
            {/* Angular decorative lines */}
            <AngularDecor />
            <h2
              className="text-2xl font-black uppercase tracking-tight xl:text-3xl"
              style={{ color: "#20271F" }}
            >
              Good Food.
              <br />
              Great Service.
            </h2>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#85877D" }}
            >
              Point of Sale&nbsp;&nbsp;•&nbsp;&nbsp;Inventory&nbsp;&nbsp;•&nbsp;&nbsp;Operations
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────── */}
      <div
        className="flex flex-1 flex-col"
        style={{ backgroundColor: "#FAFAF7" }}
      >
        {/* Top-right status */}
        <div className="flex justify-end p-6 lg:p-8">
          <div className="flex items-center gap-1.5">
            <ShieldCheck
              className="h-3.5 w-3.5"
              style={{ color: "#85877D" }}
              aria-hidden="true"
            />
            <span className="text-xs" style={{ color: "#85877D" }}>
              Your business. Connected.
            </span>
          </div>
        </div>

        {/* Center the login card */}
        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-8">
          {/* Login card */}
          <div
            className="w-full rounded-[18px] bg-white p-8 sm:p-10"
            style={{
              maxWidth: "440px",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            {/* Mobile brand (visible only on small screens) */}
            <div className="mb-6 flex items-center gap-2 lg:hidden">
              {/* Fix #2: reuse SmallShieldIcon with smaller height */}
              <SmallShieldIcon className="h-7 w-auto" />
              <span
                className="text-lg font-black tracking-widest"
                style={{ color: "#20271F" }}
              >
                NEXORA
              </span>
            </div>

            {/* Badge */}
            <div
              className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ backgroundColor: "#EDFCE3" }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "#1C5C12" }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#1C5C12" }}
              >
                Business Workspace
              </span>
            </div>

            {/* Heading */}
            <h1
              className="mb-1.5 text-[26px] font-bold leading-tight tracking-tight"
              style={{ color: "#20271F" }}
            >
              Welcome back.
            </h1>
            <p className="mb-7 text-sm" style={{ color: "#85877D" }}>
              Sign in to keep your business moving.
            </p>

            {/* Form */}
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Bottom of right panel */}
        <div className="flex flex-col items-center gap-1 px-4 pb-8 text-center">
          <p className="text-sm" style={{ color: "#85877D" }}>
            Need a hand?{" "}
            <a
              href="mailto:support@nexora.app"
              className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "#1C5C12" }}
            >
              Contact support
            </a>
          </p>
          <p className="text-xs" style={{ color: "#85877D", opacity: 0.7 }}>
            © 2026 Nexora. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
