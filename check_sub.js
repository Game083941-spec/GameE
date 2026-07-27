const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('submissions').insert({
    form_id: 'cce7e944-f8f1-4cf6-be07-46bc22bc15b8',
    responses: { test: 1 },
    payment_status: 'PENDING'
  });
  console.log("Insert Error:", error);
}

check();
