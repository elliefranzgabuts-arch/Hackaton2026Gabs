
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export const metadata: Metadata = {
  title: "Overview — NEXORA",
  description: "Your NEXORA financial workspace.",
};

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "My Cards", icon: CreditCard, active: false },
  { label: "Transactions", icon: ArrowLeftRight, active: false },
];

export default async function DashboardPage() {
  let user;
  let accounts = [];
  let accountsError = null;

  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) redirect("/login");
    user = userData.user;

    const { data, error } = await supabase
      .from("simulated_accounts")
      .select("id, account_name, currency, status")
      .order("created_at", { ascending: false });

    if (error) {
      accountsError = error;
    } else if (data) {
      accounts = data;
    }
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F2F0E5] text-[#243326] md:flex">
      <aside className="flex w-full flex-col border-b border-[#DDE4D8] bg-white/75 p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <a href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#63F51B]">
            <ShieldCheck size={25} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-lg font-black tracking-[0.18em]">NEXORA</p>
            <p className="text-xs text-[#697568]">Financial workspace</p>
          </div>
        </a>

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-[#899486]">
          Workspace
        </p>

        <nav aria-label="Main navigation" className="flex gap-2 md:flex-col">
          {navigation.map(({ label, icon: Icon, active }) => (
            <a
              key={label}
              href="/dashboard"
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                active
                  ? "bg-[#CFF5D2] text-[#315B43]"
                  : "text-[#697568] hover:bg-[#F2F0E5]"
              }`}
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-auto hidden rounded-2xl border border-[#DDE4D8] bg-[#F2F0E5] p-4 md:block">
          <ShieldCheck className="mb-2 text-[#315B43]" size={22} />
          <p className="text-sm font-semibold">Your security matters</p>
          <p className="mt-1 text-xs leading-5 text-[#697568]">
            This is a simulated financial platform, not a real bank.
          </p>
        </div>

        <form action={signOutAction} className="mt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#697568] hover:bg-[#F2F0E5]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#697568]">Your financial overview</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#697568]">{user.email}</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#DDE4D8] bg-white/80 px-3 py-2 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-[#63F51B]" />
            Demo workspace
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-[#315B43] p-6 text-white shadow-sm sm:p-8">
            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border-[35px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-[#63F51B]/10 blur-3xl" />

            <div className="relative flex items-center gap-2 text-sm text-white/75">
              <Wallet size={18} />
              Illustrative starting balance
            </div>

            <p className="relative mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              ₱10,000.00
            </p>

            <p className="relative mt-3 max-w-md text-sm leading-6 text-white/70">
              Sample amount for the interface preview. This is not a verified
              or persisted account balance.
            </p>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                title="Deposit functionality is not implemented yet"
                className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#63F51B] px-4 py-3 text-sm font-semibold text-[#243326] opacity-90"
              >
                <Plus size={17} />
                Add money
              </button>
              <button
                type="button"
                disabled
                title="Transfer functionality is not implemented yet"
                className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-white/25 px-4 py-3 text-sm font-medium text-white/80"
              >
                <ArrowUpRight size={17} />
                Transfer
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDE4D8] bg-white/85 p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-[#CFF5D2] p-2.5 text-[#315B43]">
                  <Sparkles size={20} />
                </div>
                <h2 className="font-semibold">AI Financial Companion</h2>
              </div>
              <span className="rounded-full bg-[#F2F0E5] px-2.5 py-1 text-xs text-[#697568]">
                Preview
              </span>
            </div>

            <p className="mt-5 text-sm leading-6 text-[#697568]">
              Your personal financial companion will help you understand
              spending, plan a budget, and discover saving opportunities.
            </p>

            <div className="mt-5 rounded-2xl bg-[#F2F0E5] p-4">
              <p className="text-sm font-semibold">Coming next</p>
              <p className="mt-1 text-sm leading-6 text-[#697568]">
                Personalized insights based on your available transaction data.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-[#DDE4D8] bg-white/85 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">My Cards</h2>
                <p className="mt-1 text-sm text-[#697568]">
                  Manage your simulated payment cards.
                </p>
              </div>
              <CreditCard className="text-[#315B43]" size={24} />
            </div>

            <div className="mt-6">
              {accountsError ? (
                <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm text-red-600">Unable to load accounts. Please refresh the page.</p>
                </div>
              ) : accounts.length > 0 ? (
                <div className="space-y-3">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-2xl border border-[#DDE4D8] bg-white p-4"
                    >
                      <div>
                        <p className="font-semibold text-[#243326]">{account.account_name}</p>
                        <p className="text-xs text-[#697568]">{account.currency}</p>
                      </div>
                      <span className="rounded-md bg-[#CFF5D2] px-2 py-1 text-[10px] font-bold uppercase text-[#315B43]">
                        {account.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#DDE4D8] p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CFF5D2] text-[#315B43]">
                    <CreditCard size={23} />
                  </div>
                  <p className="mt-3 font-semibold">No cards to display yet</p>
                  <p className="mt-1 text-sm text-[#697568]">
                    Card creation will be available after secure persistence is set up.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDE4D8] bg-white/85 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Recent transactions</h2>
                <p className="mt-1 text-sm text-[#697568]">
                  Review activity in your workspace.
                </p>
              </div>
              <ArrowLeftRight className="text-[#315B43]" size={24} />
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-[#DDE4D8] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2F0E5] text-[#315B43]">
                <ArrowDownLeft size={23} />
              </div>
              <p className="mt-3 font-semibold">No transactions to display</p>
              <p className="mt-1 text-sm text-[#697568]">
                This section will show persisted transactions once implemented.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-xs text-[#697568]">
          © 2026 NEXORA · Simulated financial platform
        </footer>
      </main>
    </div>
  );
}
