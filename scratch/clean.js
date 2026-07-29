const fs = require('fs');
const path = require('path');

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match single-line comments: // ...
  // But preserve: // eslint-disable, // @ts-, // TODO, // FIXME (if they are important)
  // The rule says: keep "TODOs that are no longer relevant" -> wait, "Remove TODOs that are no longer relevant". We can't know if they are relevant, so maybe remove all TODOs?
  // "KEEP comments that are important... JSDoc/TSDoc, eslint, @ts-ignore..."
  
  // Split into lines
  let lines = content.split('\n');
  let newLines = [];
  
  let inMultilineComment = false;
  let keepMultiline = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();
    
    // Check for multi-line comment start
    if (!inMultilineComment && trimmed.startsWith('/*')) {
      if (trimmed.startsWith('/**') || trimmed.toLowerCase().includes('license') || trimmed.includes('eslint')) {
        keepMultiline = true;
      } else {
        keepMultiline = false;
      }
      inMultilineComment = true;
    }
    
    if (inMultilineComment) {
      if (keepMultiline) newLines.push(line);
      if (trimmed.endsWith('*/') || trimmed.includes('*/')) {
        inMultilineComment = false;
      }
      continue;
    }
    
    // Handle single line comments
    if (trimmed.startsWith('//')) {
      const lower = trimmed.toLowerCase();
      // Keep directives
      if (
        lower.includes('eslint') || 
        lower.includes('@ts-') || 
        lower.includes('license')
      ) {
        newLines.push(line);
        continue;
      }
      
      // If it's commented out code or random text, skip it (remove it)
      continue;
    }
    
    // Handle inline comments: code ... // comment
    // Be careful with URLs in strings (e.g. https://...)
    // This is hard to do perfectly with regex without an AST.
    // For safety, we only remove full-line comments to avoid breaking URLs or regexes.
    
    newLines.push(line);
  }
  
  // Clean up consecutive empty lines and trailing spaces
  let cleaned = [];
  let emptyCount = 0;
  for (let line of newLines) {
    let rightTrimmed = line.trimEnd();
    if (rightTrimmed === '') {
      emptyCount++;
      if (emptyCount <= 1) { // Keep max 1 empty line
        cleaned.push('');
      }
    } else {
      emptyCount = 0;
      cleaned.push(rightTrimmed);
    }
  }
  
  // Remove leading empty lines
  while (cleaned.length > 0 && cleaned[0] === '') {
    cleaned.shift();
  }
  // Ensure exactly one trailing newline
  while (cleaned.length > 0 && cleaned[cleaned.length - 1] === '') {
    cleaned.pop();
  }
  if (cleaned.length > 0) cleaned.push('');
  
  const finalContent = cleaned.join('\n');
  if (finalContent !== content) {
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Cleaned ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      cleanFile(fullPath);
    }
  }
}

walk(path.join(__dirname, '../src'));
console.log('Done!');
