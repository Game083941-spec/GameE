const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("Submissions Error:", error);
  console.log("Submissions:");
  console.log(JSON.stringify(data, null, 2));

  const { data: answers, error: answersError } = await supabase.from('submission_answers').select('*').order('created_at', { ascending: false }).limit(10);
  console.log("Answers Error:", answersError);
  console.log("Answers:");
  console.log(JSON.stringify(answers, null, 2));
}

check();
