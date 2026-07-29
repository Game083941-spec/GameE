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
  const role = formData.get("role") as string || "ADMIN";
  
  const adminAuthClient = createAdminClient();
  
  const { error } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role }
  });
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/dashboard/admin");
  return { success: true };
}
export async function updateAdminUser(formData: FormData) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  
  const id = formData.get("id") as string;
  const full_name = formData.get("full_name") as string;
  const password = formData.get("password") as string;
  
  const adminAuthClient = createAdminClient();
  
  const updateData: any = {
    user_metadata: { full_name }
  };
  
  if (password && password.trim() !== "") {
    updateData.password = password;
  }
  
  const { error } = await adminAuthClient.auth.admin.updateUserById(id, updateData);
  
  // Also update profiles table
  const { error: profileError } = await adminAuthClient
    .from("profiles")
    .update({ full_name })
    .eq("id", id);
  
  if (error) {
    return { error: error.message };
  }
  
  if (profileError) {
    return { error: profileError.message };
  }
  
  revalidatePath("/dashboard/admin");
  return { success: true };
}

export async function deleteAdminUser(id: string) {
  if (!(await isSuperAdmin())) throw new Error("Unauthorized");
  
  const adminAuthClient = createAdminClient();
  
  // Prevent deleting the main super admin
  const { data: { user } } = await adminAuthClient.auth.admin.getUserById(id);
  if (user?.email === process.env.SUPER_ADMIN_EMAIL) {
    return { error: "Cannot delete the primary Super Admin account." };
  }
  
  const { error } = await adminAuthClient.auth.admin.deleteUser(id);
  
  if (error) {
    return { error: error.message };
  }
  
  revalidatePath("/dashboard/admin");
  return { success: true };
}
