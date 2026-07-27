const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, form:forms(organization_id, title)');
    
  if (!submissions) return;
  
  for (const sub of submissions) {
    if (sub.payment_status === 'SUCCESS' || sub.payment_status === 'NOT_REQUIRED') {
      const { data: answers } = await supabase
        .from('submission_answers')
        .select('value, field:fields(label)')
        .eq('submission_id', sub.id);
        
      let teamName = "Unknown Team";
      let contact = "";
      let contactEmail = "";

      if (answers) {
        answers.forEach((ans) => {
          const label = ans.field?.label?.toLowerCase() || "";
          if (label.includes("team")) teamName = ans.value;
          if (label.includes("email")) contactEmail = ans.value;
          if (label.includes("name") && !label.includes("team")) contact = ans.value;
        });
      }

      if (teamName === "Unknown Team" && contact !== "") teamName = contact;
      else if (teamName === "Unknown Team") teamName = "Individual Registration";
      
      const { error } = await supabase.from('teams').insert({
        organization_id: sub.form.organization_id,
        name: teamName,
        contact_email: contactEmail || contact,
        contact_phone: "",
        source: "FORM_SUBMISSION"
      });
      if (error) console.error("Error migrating", sub.id, error);
      else console.log("Migrated", sub.id);
    }
  }
}

migrate();
