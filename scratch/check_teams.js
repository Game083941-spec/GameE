const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: subData } = await supabase.from('submissions').select('id').order('created_at', { ascending: false }).limit(1);
  if (!subData || subData.length === 0) return;
  const subId = subData[0].id;
  
  const { data: answers, error } = await supabase
    .from("submission_answers")
    .select(`value, field:fields(label)`)
    .eq("submission_id", subId);
    
  console.log('Answers for latest sub:', JSON.stringify(answers, null, 2));
}

check();
