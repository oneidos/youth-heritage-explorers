import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import type { Role } from "@/lib/cicero";

export type Profile = {
  id: string;
  display_name: string;
  active_role: Role;
  age: number | null;
  gender: string | null;
  school: string | null;
  city: string | null;
  interests: string[];
  languages: string[];
  bio: string | null;
  favorite_places: string | null;
  availability: string | null;
  accessible_tours: boolean;
  fsl_enabled: boolean;
  fsl_interested: boolean;
  visitor_onboarded: boolean;
  guide_onboarded: boolean;
};

export function useAuthUser() {
  return useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },
    staleTime: 30_000,
  });
}

async function fetchOrCreateProfile(user: User): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as Profile;

  const fallbackName =
    (user.user_metadata?.["full_name"] as string | undefined) ??
    (user.user_metadata?.["name"] as string | undefined) ??
    user.email?.split("@")[0] ??
    "Studente";

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: user.id, display_name: fallbackName })
    .select("*")
    .single();
  if (insertError) throw insertError;
  return created as Profile;
}

export function useProfile() {
  const { data: user, isLoading: userLoading } = useAuthUser();
  const query = useQuery<Profile | null>({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: () => fetchOrCreateProfile(user!),
  });
  return { ...query, user, isLoading: userLoading || query.isLoading };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();
  return useMutation({
    mutationFn: async (patch: Partial<Profile>) => {
      if (!user) throw new Error("Sessione non attiva");
      const { data, error } = await supabase
        .from("profiles")
        .update(patch)
        .eq("id", user.id)
        .select("*")
        .single();
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", profile.id], profile);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };
}
