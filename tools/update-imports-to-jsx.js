const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}

function relativeImportStarts(p) {
  return p.startsWith('./') || p.startsWith('../');
}

function normalizeImportPath(importPath) {
  // remove trailing index like /index
  if (importPath.endsWith('/index')) return importPath.slice(0, -('/index'.length));
  return importPath;
}

// Collect all .jsx files under src
const srcDir = path.join(root, 'src');
const allFiles = walk(srcDir);
const jsxFiles = allFiles.filter(f => f.endsWith('.jsx'));

// map from basename (without extension) to possible relative endings
const jsxBases = jsxFiles.map(f => {
  const rel = path.relative(srcDir, f).split(path.sep).join('/');
  return { abs: f, rel, noext: rel.replace(/\.jsx$/, '') };
});

// Files to update: all .js and .jsx files under src
const targetFiles = allFiles.filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

let totalEdits = 0;

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // process import ... from '...'
  jsxBases.forEach(b => {
    // Only consider imports with relative paths
    // Patterns to replace:
    // './path/Name' -> './path/Name.jsx'
    // './path/Name.js' -> './path/Name.jsx'
    // '../.../Name' etc.
    const name = path.basename(b.noext);

    // Build regex that finds import/require paths that end with /Name or /Name.js or ./Name or ../Name
    const regex = new RegExp(`(["'])(((?:\\.\\.|\\.|/)?[^"']*\\/${name}))(?:\\.js)?(["'])`, 'g');

    // Also handle imports that reference just './Name' (no slash before name)
    const regex2 = new RegExp(`(["'])(((?:\\.\\.|\\.|/)?${name}))(?:\\.js)?(["'])`, 'g');

    content = content.replace(regex, (m, q1, pth, q2) => {
      if (!relativeImportStarts(pth) && !pth.startsWith('/')) return m; // skip absolute package imports
      const normalized = normalizeImportPath(pth);
      return q1 + normalized + '.jsx' + q2;
    });

    content = content.replace(regex2, (m, q1, pth, q2) => {
      if (!relativeImportStarts(pth) && !pth.startsWith('/')) return m;
      const normalized = normalizeImportPath(pth);
      return q1 + normalized + '.jsx' + q2;
    });
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalEdits++;
    console.log('Updated imports in', path.relative(root, file));
  }
});

console.log('\nDone. Total files edited:', totalEdits);
