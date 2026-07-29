const fs = require('fs');
const path = 'src/components/form-renderer.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace literal '\\n' with actual newlines
content = content.replace(/\\\\n/g, '\\n');

fs.writeFileSync(path, content);
console.log("Fixed literal newlines in form-renderer.tsx");
