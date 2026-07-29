const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase
    .from('ad_pages')
    .select('*')
    .eq('field_visibility->>createdBy', '123')
    .limit(1);
  console.log('JSONB query result:', data);
  console.log('JSONB query error:', error);
}

check();
