const fs = require('fs');
const path = 'src/components/form-renderer.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetStr = 'window.location.href = "https://rzp.io/rzp/KCK7aEGK";';
const replacementStr = 'window.location.href = process.env.NEXT_PUBLIC_PAYMENT_LINK || "https://rzp.io/rzp/KCK7aEGK";';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(path, content);
  console.log("Updated form-renderer.tsx to use NEXT_PUBLIC_PAYMENT_LINK");
} else {
  console.log("Could not find the target string in form-renderer.tsx");
}
