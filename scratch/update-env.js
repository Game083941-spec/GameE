const fs = require('fs');
const path = '.env.local';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('NEXT_PUBLIC_PAYMENT_LINK')) {
  content += '\\nNEXT_PUBLIC_PAYMENT_LINK=https://rzp.io/rzp/KCK7aEGK\\n';
  fs.writeFileSync(path, content);
  console.log("Added NEXT_PUBLIC_PAYMENT_LINK to .env.local");
} else {
  console.log("NEXT_PUBLIC_PAYMENT_LINK already exists in .env.local");
}
