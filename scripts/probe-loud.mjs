// 0.1 s RMS + high-frequency energy of a WAV, so a periodic percussion pulse is visible as numbers.
// Usage: node scripts/probe-loud.mjs <wav> [from] [to]
// Read: HF spikes every 0.6 s at 100 BPM = quarter-note percussion; a smooth curve = melody.
import { readWav } from './lib/wav.mjs';

const wav = process.argv[2];
if (!wav) {
  console.error('usage: node scripts/probe-loud.mjs <wav> [from] [to]');
  process.exit(1);
}
const w = readWav(wav);
if (!w) {
  console.error(`not a readable WAV: ${wav}`);
  process.exit(1);
}
const d = w.data;
const R = w.rate;
const a0 = Number(process.argv[3] ?? 0);
const a1 = Number(process.argv[4] ?? Math.floor(d.length / R));

const seg = (t0, t1) => {
  const a = Math.floor(t0 * R);
  const b = Math.min(d.length, Math.floor(t1 * R));
  let s = 0;
  let hf = 0;
  let prev = 0;
  for (let i = a; i < b; i++) {
    const v = d[i];
    s += v * v;
    const dv = v - prev;
    hf += dv * dv;
    prev = v;
  }
  const n = Math.max(1, b - a);
  return { rms: Math.sqrt(s / n), hf: Math.sqrt(hf / n) };
};

for (let t = a0; t < a1; t += 0.1) {
  const { rms, hf } = seg(t, t + 0.1);
  const db = 20 * Math.log10(rms + 1e-9);
  const bar = '#'.repeat(Math.max(0, Math.round((db + 42) / 1.2)));
  console.log(`${t.toFixed(1)} ${db.toFixed(0).padStart(4)} ${bar}   hf ${hf.toFixed(4)}`);
}
