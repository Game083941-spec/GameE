const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function patch() {
  const { error } = await supabase
    .from('submissions')
    .update({ payment_status: 'SUCCESS' })
    .eq('id', '6cf32337-1875-477a-95f8-5825380de8ff');
  if (error) {
    console.error("Patch Error:", error);
  } else {
    console.log("Successfully patched submission to SUCCESS!");
  }
}

patch();
