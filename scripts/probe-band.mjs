// Low band (<160 Hz) vs the rest, so a "thump" can be attributed: kick / bass octave = low, snare = high.
// Usage: node scripts/probe-band.mjs <wav> [from] [to]
import { readWav } from './lib/wav.mjs';

const wav = process.argv[2];
if (!wav) {
  console.error('usage: node scripts/probe-band.mjs <wav> [from] [to]');
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

// one-pole lowpass at 160 Hz; the residual is the high band
const aL = 1 - Math.exp((-2 * Math.PI * 160) / R);
let lp = 0;
const low = new Float32Array(d.length);
const high = new Float32Array(d.length);
for (let i = 0; i < d.length; i++) {
  lp += aL * (d[i] - lp);
  low[i] = lp;
  high[i] = d[i] - lp;
}
const rms = (buf, t0, t1) => {
  const a = Math.floor(t0 * R);
  const b = Math.min(buf.length, Math.floor(t1 * R));
  let s = 0;
  for (let i = a; i < b; i++) s += buf[i] * buf[i];
  return 10 * Math.log10(s / Math.max(1, b - a) + 1e-12);
};

for (let t = a0; t < a1; t += 0.15) {
  console.log(`${t.toFixed(2)}  low ${rms(low, t, t + 0.15).toFixed(0).padStart(4)}  high ${rms(high, t, t + 0.15).toFixed(0).padStart(4)}`);
}
