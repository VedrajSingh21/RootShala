const fs = require('fs');
let content = fs.readFileSync('src/data/mockDatabase.ts', 'utf8');
content = content.replace(/"gradeClasses":/g, '"teachingClasses":');
fs.writeFileSync('src/data/mockDatabase.ts', content);
console.log('Fixed');
