"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAdPage(data: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    data.field_visibility = {
      ...(data.field_visibility || {}),
      createdBy: user.id
    };
  }

  const { data: result, error } = await supabase
    .from("ad_pages")
    .insert([data])
    .select()
    .single();

  if (error) {
    console.error("Error creating ad page:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/${data.org_slug}/adpage`);
  return result;
}

export async function getAdPages(orgSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  let query = supabase
    .from("ad_pages")
    .select("*")
    .eq("org_slug", orgSlug)
    .order("created_at", { ascending: false });

  if (role !== "SUPER_ADMIN" && user) {
    // Regular users can only see the ad pages they created
    query = query.eq("field_visibility->>createdBy", user.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching ad pages:", error);
    return [];
  }

  return data;
}

export async function updateAdPageStatus(id: string, orgSlug: string, status: "draft" | "published") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ad_pages")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating ad page status:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/${orgSlug}/adpage`);
}

export async function deleteAdPage(id: string, orgSlug: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ad_pages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting ad page:", error);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/${orgSlug}/adpage`);
}
