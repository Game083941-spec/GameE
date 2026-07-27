"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function isSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.SUPER_ADMIN_EMAIL;
}

export async function getAllUsers() {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  
  const adminAuthClient = createAdminClient();
  const { data, error } = await adminAuthClient.auth.admin.listUsers();
  
  if (error) throw new Error(error.message);
  return data.users;
}

export async function createAdminUser(formData: FormData) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  
  const adminAuthClient = createAdminClient();
  
  const { error } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/dashboard/admin");
  return { success: true };
}
