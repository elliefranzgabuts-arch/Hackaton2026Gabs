import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot Password — NEXORA POS & Inventory",
  description: "Reset your NEXORA account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4" style={{ backgroundColor: "#FAFAF7" }}>
      <div
        className="w-full rounded-[18px] bg-white p-8 sm:p-10"
        style={{
          maxWidth: "440px",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Brand */}
        <div className="mb-6 flex items-center gap-2">
          <svg
            viewBox="0 0 28 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="h-7 w-auto"
          >
            <path
              d="M14 1 L26 5.5 L26 17.5 C26 23.5 20.5 28.5 14 31 C7.5 28.5 2 23.5 2 17.5 L2 5.5 Z"
              fill="#61F20B"
              stroke="#20271F"
              strokeWidth="1.5"
            />
            <path
              d="M9 14 L14 10.5 L19 14 M9 14 L9 20 M19 14 L19 20 M9 20 L14 23.5 L19 20"
              stroke="#20271F"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-lg font-black tracking-widest" style={{ color: "#20271F" }}>
            NEXORA
          </span>
        </div>

        {/* Icon */}
        <div
          className="mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "#EDFCE3" }}
        >
          <Mail className="h-5 w-5" style={{ color: "#1C5C12" }} aria-hidden="true" />
        </div>

        <h1 className="mb-1.5 text-2xl font-bold tracking-tight" style={{ color: "#20271F" }}>
          Reset your password
        </h1>
        <p className="mb-7 text-sm" style={{ color: "#85877D" }}>
          Password recovery is coming soon. In the meantime, please contact your system administrator or our support team.
        </p>

        <a
          href="mailto:support@nexora.app"
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#61F20B", color: "#20271F" }}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          Contact Support
        </a>

        <Link
          href="/login"
          className="flex items-center justify-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "#1C5C12" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to sign in
        </Link>

        <div className="mt-8 flex items-center justify-center gap-1.5 border-t pt-5" style={{ borderColor: "#E8E9E1" }}>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: "#85877D" }} aria-hidden="true" />
          <span className="text-xs" style={{ color: "#85877D" }}>
            Secure access. Ready for the day.
          </span>
        </div>
      </div>
    </div>
  );
}
