const fs = require('fs');
const path = require('path');

const nojekyllPath = path.join(__dirname, 'dist', 'angular-front-end-library', 'browser', '.nojekyll');

fs.mkdirSync(path.dirname(nojekyllPath), { recursive: true });
fs.writeFileSync(nojekyllPath, '');
console.log('.nojekyll file created successfully');