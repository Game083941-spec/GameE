const fs = require('fs');
const path = 'src/components/form-renderer.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update import
content = content.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";');

// 2. Add useEffect after setResponses
const hookAnchor = 'const [responses, setResponses] = useState<Record<string, string>>({});';
const useEffectCode = `
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('autofill_email');
      const savedPhone = localStorage.getItem('autofill_phone');
      
      if (savedEmail || savedPhone) {
        const initialResponses: Record<string, string> = {};
        fields.forEach(f => {
          if (f.type === 'EMAIL' && savedEmail) {
            initialResponses[f.id] = savedEmail;
          } else if ((f.type === 'PHONE' || f.type === 'NUMBER' || f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('number') || f.label.toLowerCase().includes('whatsapp')) && savedPhone) {
            initialResponses[f.id] = savedPhone;
          }
        });
        
        if (Object.keys(initialResponses).length > 0) {
          setResponses(prev => ({ ...prev, ...initialResponses }));
        }
      }
    } catch (e) {}
  }, [fields]);
`;
content = content.replace(hookAnchor, hookAnchor + '\\n' + useEffectCode);

// 3. Add localStorage setItem inside handleSubmit
const submitAnchor = '    setIsSubmitting(true);\n    setError("");';
const saveCode = `
    try {
      const emailField = fields.find(f => f.type === 'EMAIL');
      if (emailField && responses[emailField.id]) {
        localStorage.setItem('autofill_email', responses[emailField.id]);
      }
      const phoneField = fields.find(f => f.type === 'PHONE' || f.type === 'NUMBER' || f.label.toLowerCase().includes('phone') || f.label.toLowerCase().includes('number') || f.label.toLowerCase().includes('whatsapp'));
      if (phoneField && responses[phoneField.id]) {
        localStorage.setItem('autofill_phone', responses[phoneField.id]);
      }
    } catch (e) {}
`;
content = content.replace(submitAnchor, submitAnchor + '\\n' + saveCode);

fs.writeFileSync(path, content);
console.log("Successfully added autofill logic.");
