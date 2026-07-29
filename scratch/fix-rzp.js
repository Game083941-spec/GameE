const fs = require('fs');
const path = 'src/components/form-renderer.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = '        const options = {';
const startIndex = content.indexOf(startStr);

const endStr = "return; // Don't set success state yet, wait for callback";
const endIndex = content.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `        // Redirect to the provided Razorpay Payment Link
        window.location.href = "https://rzp.io/rzp/KCK7aEGK";
        return;`;
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  fs.writeFileSync(path, content);
  console.log("Successfully replaced Razorpay modal with redirect.");
} else {
  console.log("Failed to find the block to replace. startIndex: " + startIndex + ", endIndex: " + endIndex);
}
