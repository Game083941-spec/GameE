const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: teams, error: teamsError } = await supabase.from('teams').select('*').limit(1);
  console.log("Teams Error:", teamsError);
  console.log("Teams:", JSON.stringify(teams, null, 2));
}

check();
