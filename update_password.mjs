import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SUPER_ADMIN_EMAIL;
const newPassword = process.env.SUPER_ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseServiceKey || !email || !newPassword) {
  console.error("Missing required environment variables in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updatePassword() {
  console.log(`Looking up user: ${email}...`);
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  
  if (listError) {
    console.error("Error listing users:", listError.message);
    return;
  }
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error(`User ${email} not found!`);
    return;
  }
  
  console.log(`Found user ${user.id}. Updating password...`);
  
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: newPassword }
  );

  if (error) {
    console.error("Error updating user password:", error.message);
    return;
  }

  console.log("Success! Admin user password updated.");
}

updatePassword();
