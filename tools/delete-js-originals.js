const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
function walk(dir){
  let res = [];
  fs.readdirSync(dir).forEach(f=>{
    const fp = path.join(dir,f);
    if(fs.statSync(fp).isDirectory()) res = res.concat(walk(fp));
    else res.push(fp);
  });
  return res;
}
const files = walk(src);
const jsxFiles = new Set(files.filter(f=>f.endsWith('.jsx')).map(f=>f.replace(/\.jsx$/,'')));
const jsFiles = files.filter(f=>f.endsWith('.js'));
const toDelete = jsFiles.filter(f=> jsxFiles.has(f.replace(/\.js$/,'')));
if(toDelete.length===0){
  console.log('No files to delete');
  process.exit(0);
}
console.log('Deleting', toDelete.length, 'files:');
toDelete.forEach(f=>console.log('  ', f));
// Confirm
try{
  toDelete.forEach(f=>fs.unlinkSync(f));
  console.log('\nDeleted files successfully');
}catch(e){
  console.error('Error deleting files:', e);
  process.exit(1);
}
