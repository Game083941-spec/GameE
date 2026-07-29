const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fix() {
  const { data: teams } = await supabase
    .from('teams')
    .select('*')
    .eq('contact_email', '');

  for (const team of teams) {
    console.log(`Fixing team ${team.id}`);
    await supabase.from('teams').update({ contact_email: 'avneesh.tripathi.dev@gmail.com' }).eq('id', team.id);
  }
  console.log('Fixed teams.');
}

fix();
