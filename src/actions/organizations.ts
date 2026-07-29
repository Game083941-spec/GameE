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

  let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  slug = `${slug}-${randomSuffix}`;

  const { data: orgData, error: orgError } = await supabase
    .from("organizations")
    .insert({ name, slug })
    .select()
    .single();

  if (orgError || !orgData) {
    return { error: orgError?.message || "Failed to create organization." };
  }

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

  return await getCachedOrganizations(user.id, isSuperAdmin);
}

export async function inviteMember(orgId: string, email: string, role: string, sidebarPermissions: string[]) {
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) {
    return { error: "User with this email not found. They must sign up first." };
  }

  const { error } = await supabase
    .from("members")
    .insert({
      organization_id: orgId,
      profile_id: profile.id,
      role: role as any,
      sidebar_permissions: sidebarPermissions,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/[orgSlug]/members", "page");
  return { success: true };
}

export async function updateMemberPermissions(orgId: string, profileId: string, role: string, sidebarPermissions: string[]) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("members")
    .update({
      role: role as any,
      sidebar_permissions: sidebarPermissions,
    })
    .eq("organization_id", orgId)
    .eq("profile_id", profileId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/[orgSlug]/members", "page");
  revalidatePath("/dashboard/[orgSlug]", "layout");
  return { success: true };
}
