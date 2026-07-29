const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const testId = '00000000-0000-0000-0000-000000000000';
  const { error } = await supabase.from('ad_pages').insert({
    id: testId,
    org_slug: 'test',
    user_id: '123'
  });
  console.log('Insert error with user_id:', error);
  await supabase.from('ad_pages').delete().eq('id', testId);
}

check();
