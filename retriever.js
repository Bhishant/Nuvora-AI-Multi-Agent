// retriever.js
const fs = require('fs');
const path = require('path');

async function searchLocalDocs(query, docsPath = './docs') {
  const results = [];
  if (!fs.existsSync(docsPath)) return results;
  const files = fs.readdirSync(docsPath);
  for (const f of files) {
    const fp = path.join(docsPath, f);
    if (fs.statSync(fp).isFile() && /\.(txt|md|html|json|csv)$/i.test(f)) {
      const txt = fs.readFileSync(fp, 'utf8');
      const lines = txt.split(/\n/).filter(l => l.toLowerCase().includes(query.toLowerCase()));
      if (lines.length) results.push({ source: f, excerpt: lines.slice(0,5).join(' ').slice(0,1000) });
    }
  }
  return results;
}

async function retrieve(query, opts = {}) {
  const local = await searchLocalDocs(query, opts.docsPath || './docs');
  return { local };
}

module.exports = { retrieve, searchLocalDocs };
