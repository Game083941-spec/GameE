"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  revalidatePath("/", "layout");
  redirect(`/dashboard/${orgData.slug}`);
}

export async function getUserOrganizations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  if (user.email === process.env.SUPER_ADMIN_EMAIL) {
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
    .eq("profile_id", user.id);

  if (!data) return [];

  return data.map((member) => ({
    role: member.role,
    ...member.organizations,
  }));
}
