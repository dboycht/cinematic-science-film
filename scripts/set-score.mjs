// Replaces the om-score block of <project>/index.html with an ABC file (explicit utf8, no BOM).
// Keeping the score outside the HTML makes long edits safe; run om sound afterwards.
// Usage: node set-score.mjs <project-dir> <score.abc>
import fs from 'node:fs';
import path from 'node:path';

const [dir, abcFile] = process.argv.slice(2);
if (!dir || !abcFile) { console.error('usage: node set-score.mjs <project-dir> <score.abc>'); process.exit(1); }
const p = path.join(dir, 'index.html');
const html = fs.readFileSync(p, 'utf8');
const abc = fs.readFileSync(abcFile, 'utf8').replace(/^\uFEFF/, '').trimEnd();
const re = /(<script type="text\/vnd\.abc" id="om-score">)([\s\S]*?)(<\/script>)/;
if (!re.test(html)) { console.error('no om-score block in index.html'); process.exit(1); }
const out = html.replace(re, (m, a, b, c) => a + '\n' + abc + '\n' + c);
fs.writeFileSync(p, out, 'utf8');
console.log('score replaced; abc chars', abc.length, '· html now', out.length);
