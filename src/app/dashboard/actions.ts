"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server action: sign out the current user and redirect to /login.
 */
export async function signOutAction() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // If sign-out fails (e.g. env vars missing), still redirect.
  }
  redirect("/login");
}
