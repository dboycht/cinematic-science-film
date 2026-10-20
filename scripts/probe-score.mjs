// Prints every voice's end beat and all cue marks of the om-score inside <project>/index.html.
// Usage: node scripts/probe-score.mjs <project-dir>
// Every voice must end on the same beat; the marks must equal the scene label times.
// Needs huashu-motion's cli/ (set OM_CLI or install it) to reuse the engine's own ABC parser.
import fs from 'node:fs';
import path from 'node:path';
import { loadComposer } from './lib/om-cli.mjs';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node scripts/probe-score.mjs <project-dir>');
  process.exit(1);
}
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const m = /<script[^>]*id\s*=\s*["']om-score["'][^>]*>([\s\S]*?)<\/script>/i.exec(html);
if (!m) {
  console.error('no <script id="om-score"> in index.html');
  process.exit(1);
}

const { parseAbc } = await loadComposer();
const s = parseAbc(m[1]);
const last = {};
for (const e of s.events) last[e.voice] = Math.max(last[e.voice] || 0, e.beat + e.dur);
for (const [v, b] of Object.entries(last)) {
  console.log(v.padEnd(5), 'end beat', String(b).padStart(5), '=', (b / 4).toFixed(2), 'bars');
}
const marks = s.cues.filter((c) => c.type === 'mark');
console.log('marks', marks.map((x) => `${x.name}@${x.beat}`).join(' '));
console.log('cues ', s.cues.filter((c) => c.type !== 'mark').map((c) => `${c.type}@${c.beat}`).join(' '));
console.log('notes', s.events.length, '(a silent voice is not listed — that is normal)');
