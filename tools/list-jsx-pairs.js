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
const jsxFiles = files.filter(f=>f.endsWith('.jsx'));
const jsFiles = files.filter(f=>f.endsWith('.js'));
console.log('Found', jsxFiles.length, '.jsx files and', jsFiles.length, '.js files');
console.log('Sample .jsx files:');
jsxFiles.slice(0,10).forEach(f=>console.log('  ', f));
console.log('Sample .js files:');
jsFiles.slice(0,10).forEach(f=>console.log('  ', f));
const jsxSet = new Set(jsxFiles.map(f=>f.replace(/\.jsx$/, '').split('\\').join('/')));
const pairs = [];
jsFiles.forEach(f=>{
  const key = f.replace(/\.js$/, '').split('\\').join('/');
  if(jsxSet.has(key)) pairs.push({js: f, jsx: key + '.jsx'});
});
if(pairs.length===0) console.log('No pairs found');
else{
  console.log('Pairs found:');
  pairs.forEach(p=>console.log(p.js));
}

// debug compare first
if(jsxFiles.length>0 && jsFiles.length>0){
  const a = jsxFiles[0].replace(/\.jsx$/,'').split('\\').join('/');
  const b = jsFiles[0].replace(/\.js$/,'').split('\\').join('/');
  console.log('DEBUG first normalized jsx:', a);
  console.log('DEBUG first normalized js :', b);
  console.log('DEBUG set has a?', jsxSet.has(a));
}
