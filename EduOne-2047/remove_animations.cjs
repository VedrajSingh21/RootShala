const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
const patterns = [
  ' hover:-translate-y-0.5',
  ' hover:-translate-y-1.5',
  ' hover:-translate-y-1',
  ' hover:scale-[1.02]',
  ' scale-[1.02]',
  ' hover:shadow-lg',
  ' hover:shadow-xl',
  ' hover:shadow-md',
  ' shadow-xl shadow-emerald-600/30',
  ' hover:shadow-slate-200/50',
  ' group-hover:scale-110',
  ' active:scale-95',
  ' hover:scale-105',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  patterns.forEach(pattern => {
    content = content.split(pattern).join('');
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
