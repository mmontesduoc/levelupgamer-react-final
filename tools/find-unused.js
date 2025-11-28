const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const includeExt = ['.js', '.jsx', '.css', '.html'];

function walk(dir) {
  const res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      res.push(...walk(full));
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (includeExt.includes(ext) || ['.md', '.json'].includes(ext)) {
        res.push(full);
      }
    }
  }
  return res;
}

function read(file) {
  try { return fs.readFileSync(file, 'utf8'); } catch (e) { return ''; }
}

function resolveSpecifier(fromFile, spec) {
  // only handle relative paths and absolute public paths
  if (!spec) return null;
  if (spec.startsWith('http') || spec.startsWith('//')) return null;
  if (spec.startsWith('%PUBLIC_URL%')) {
    const p = spec.replace('%PUBLIC_URL%/', 'public/');
    return path.resolve(ROOT, p);
  }
  if (spec.startsWith('/')) {
    // treat as public root
    return path.resolve(ROOT, 'public' + spec);
  }
  if (spec.startsWith('.')) {
    const baseDir = path.dirname(fromFile);
    const cand = path.resolve(baseDir, spec);
    // try adding extensions
    for (const ext of ['.js', '.jsx', '.css', '.html', '.json']) {
      const f = cand + ext;
      if (fs.existsSync(f)) return f;
    }
    // try index files
    for (const ext of ['.js', '.jsx', '.html']) {
      const f = path.join(cand, 'index' + ext);
      if (fs.existsSync(f)) return f;
    }
    // try file as-is
    if (fs.existsSync(cand)) return cand;
    return null;
  }
  return null; // skip module specifiers (node_modules)
}

function extractSpecifiers(content, file) {
  const specs = new Set();
  // import ... from 'specifier'
  const importRe = /import\s+(?:[^'";]+)from\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content))) {
    specs.add(m[1]);
  }
  // import 'specifier'
  const importOnlyRe = /import\s*['"]([^'"]+)['"]/g;
  while ((m = importOnlyRe.exec(content))) {
    specs.add(m[1]);
  }
  // require('specifier')
  const reqRe = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = reqRe.exec(content))) {
    specs.add(m[1]);
  }
  // HTML: link href and script src
  if (file.endsWith('.html')) {
    const linkRe = /<link[^>]+href=["']([^"']+)["']/g;
    while ((m = linkRe.exec(content))) specs.add(m[1]);
    const scriptRe = /<script[^>]+src=["']([^"']+)["']/g;
    while ((m = scriptRe.exec(content))) specs.add(m[1]);
  }
  return Array.from(specs).map(s => resolveSpecifier(file, s)).filter(Boolean);
}

function main() {
  const all = walk(ROOT);
  const files = new Set(all.map(f => path.resolve(f)));

  const edges = new Map();
  for (const f of files) edges.set(f, new Set());

  for (const f of files) {
    const content = read(f);
    const specFiles = extractSpecifiers(content, f);
    for (const s of specFiles) {
      const resolved = path.resolve(s);
      if (files.has(resolved)) {
        edges.get(f).add(resolved);
      }
    }
  }

  // roots
  const roots = [];
  const possibleRoots = [
    path.resolve(ROOT, 'public', 'index.html'),
    path.resolve(ROOT, 'src', 'index.js'),
    path.resolve(ROOT, 'src', 'App.js'),
  ];
  for (const r of possibleRoots) if (files.has(r)) roots.push(r);

  // traverse from roots to mark used
  const used = new Set();
  const stack = [...roots];
  for (const r of roots) used.add(r);
  while (stack.length) {
    const cur = stack.pop();
    const deps = edges.get(cur) || new Set();
    for (const d of deps) {
      if (!used.has(d)) {
        used.add(d);
        stack.push(d);
      }
    }
  }

  // also mark files imported by others as used via incoming edges
  // (already covered by traversal from roots)

  const unused = [];
  for (const f of files) {
    // ignore README/docs at root? we'll keep them but not mark as unused
    const rel = path.relative(ROOT, f);
    if (rel.startsWith('node_modules') || rel.startsWith('.git')) continue;
    // ignore package files
    if (['package.json','package-lock.json'].includes(path.basename(f))) continue;
    if (!used.has(f)) unused.push(rel);
  }

  console.log('Roots used for traversal:');
  roots.forEach(r => console.log(' -', path.relative(ROOT,r)));
  console.log('\nPotential unused files (not reachable from roots):');
  if (!unused.length) console.log('  (none detected)');
  else unused.sort().forEach(u => console.log(' -', u));
}

main();
