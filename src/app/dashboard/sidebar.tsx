"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  SendHorizontal,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  /** If true, rendered as a form button that triggers signOutAction */
  isSignOut?: boolean;
};

type SidebarProps = {
  activeSection: string;
  onNavigate: (id: string) => void;
  userEmail: string;
  signOutAction: () => void;
};

/* ─── Navigation items ──────────────────────────────────────── */

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { id: "cards", label: "My Cards", icon: <CreditCard className="h-[18px] w-[18px]" /> },
  { id: "transactions", label: "Transactions", icon: <ArrowLeftRight className="h-[18px] w-[18px]" /> },
  { id: "transfer", label: "Transfer Money", icon: <SendHorizontal className="h-[18px] w-[18px]" /> },
  { id: "ai-companion", label: "AI Financial Companion", icon: <Bot className="h-[18px] w-[18px]" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-[18px] w-[18px]" /> },
];

/* ─── Small Shield Icon (shared with login page) ──────────── */

function SmallShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className ?? "h-8 w-auto"}
    >
      <path
        d="M14 1 L26 5.5 L26 17.5 C26 23.5 20.5 28.5 14 31 C7.5 28.5 2 23.5 2 17.5 L2 5.5 Z"
        fill="#61F20B"
        stroke="#131A10"
        strokeWidth="1"
      />
      <path
        d="M14 4.5 L23 8 L23 17.5 C23 21.8 19 25 14 27 C9 25 5 21.8 5 17.5 L5 8 Z"
        fill="#20271F"
      />
      <line x1="5" y1="12.5" x2="23" y2="12.5" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="5" y1="16" x2="23" y2="16" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="5.5" y1="19.5" x2="22" y2="19.5" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="10" y1="7.5" x2="10" y2="26" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="14" y1="5.5" x2="14" y2="27" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
      <line x1="18" y1="7.5" x2="18" y2="26" stroke="#61F20B" strokeWidth="0.6" strokeOpacity="0.5" />
    </svg>
  );
}

/* ─── Sidebar Component ─────────────────────────────────────── */

export function DashboardSidebar({
  activeSection,
  onNavigate,
  userEmail,
  signOutAction,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-6">
        <SmallShieldIcon className="h-7 w-auto" />
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-black tracking-[0.15em] text-[#243326]">
            NEXORA
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6b7c6e]">
            Digital Banking
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNav(item.id)}
                  className={`
                    group flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                    text-[13px] font-medium transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63F51B]
                    ${
                      isActive
                        ? "bg-[#63F51B]/10 text-[#243326] font-semibold"
                        : "text-[#6b7c6e] hover:bg-[#DDE4D8]/50 hover:text-[#243326]"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isActive ? "text-[#315B43]" : "text-[#6b7c6e] group-hover:text-[#315B43]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#315B43]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info + sign out */}
      <div className="mt-auto border-t border-[#DDE4D8] px-3 pt-3 pb-4">
        {/* User email */}
        <div className="mb-2 rounded-lg px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6b7c6e]">
            Signed in as
          </p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-[#243326]">
            {userEmail}
          </p>
        </div>

        {/* Sign out */}
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#6b7c6e] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63F51B]"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5 text-[#243326]" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-[264px] bg-white shadow-xl
          transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md hover:bg-[#DDE4D8]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63F51B]"
          aria-label="Close navigation menu"
        >
          <X className="h-4 w-4 text-[#6b7c6e]" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex lg:w-[248px] lg:flex-shrink-0 lg:flex-col border-r border-[#DDE4D8] bg-white"
        role="navigation"
        aria-label="Main navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
