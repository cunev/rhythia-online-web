import { createClient, User } from "@supabase/supabase-js";
import { getProfile } from "rhythia-api";
import { create } from "zustand";
const supabaseUrl = "https://pfkajngbllcbdzoylrvp.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBma2FqbmdibGxjYmR6b3lscnZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMTUzMDUsImV4cCI6MjA0NDU5MTMwNX0.9j9lpQ-k8Qtp-s5jslGdxQe8cAvuLXIeB-DgfRMOFbc`;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const useProfile = create(() => ({
  loading: true,
  user: null as User | null,
  userProfile: null as Awaited<ReturnType<typeof getProfile>>["user"] | null,
}));

supabase.auth.onAuthStateChange(async (state) => {
  if (state == "SIGNED_OUT") {
    useProfile.setState(() => ({
      loading: false,
      user: null,
    }));
  }
  if (state != "INITIAL_SESSION") return;

  const user = await supabase.auth.getUser();

  useProfile.setState(() => ({
    loading: false,
    user: user.data.user,
  }));
});

export async function getJwt() {
  return (await supabase.auth.getSession()).data.session?.access_token || "";
}
