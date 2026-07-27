"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  if (!name || name.trim() === "") {
    return { error: "Organization name is required." };
  }

  // Generate a basic slug
  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  // Add a random suffix to ensure uniqueness easily
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  slug = `${slug}-${randomSuffix}`;

  // 1. Insert organization
  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .insert({ name, slug })
    .select()
    .single();

  if (orgError || !orgData) {
    return { error: orgError?.message || "Failed to create organization." };
  }

  // 2. Insert member as OWNER
  const { error: memberError } = await supabase
    .from("members")
    .insert({
      organization_id: orgData.id,
      profile_id: user.id,
      role: "OWNER",
    });

  if (memberError) {
    return { error: memberError.message };
  }

  // Invalidate user's orgs cache
  revalidateTag(`user-orgs-${user.id}`, "default");
  revalidatePath("/", "layout");
  redirect(`/dashboard/${orgData.slug}`);
}

const getCachedOrganizations = unstable_cache(
  async (userId: string, isSuperAdmin: boolean) => {
    const supabase = createAdminClient();

    if (isSuperAdmin) {
      const { data } = await supabase
        .from("organizations")
        .select("id, name, slug, logo_url")
        .order("created_at", { ascending: false });
        
      return (data || []).map((org) => ({
        role: "OWNER",
        ...org,
      }));
    }

    const { data } = await supabase
      .from("members")
      .select(`
        organization_id,
        role,
        organizations (
          id,
          name,
          slug,
          logo_url
        )
      `)
      .eq("profile_id", userId);

    if (!data) return [];

    return data.map((member) => ({
      role: member.role,
      // @ts-ignore
      ...member.organizations,
    }));
  },
  ["user-organizations"],
  { tags: ["user-orgs"] }
);

export async function getUserOrganizations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const isSuperAdmin = user.email === process.env.SUPER_ADMIN_EMAIL;
  
  // Use the cached helper, passing a dynamic tag for the specific user
  // We use unstable_cache to cache this specific user's orgs globally
  return await getCachedOrganizations(user.id, isSuperAdmin);
}
