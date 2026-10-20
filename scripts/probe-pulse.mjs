// Periodic "thump" test: fold the low/high envelopes at the bar period and look for a spike at phase 0.
// A percussion hit on the downbeat forms a clear spike at phase ≈ 0 in the folded plot; a slow-attack
// harmonic progression (lowstr att=0.3 s, warmpad att≤0.5 s) does not.
//
// Usage: node scripts/probe-pulse.mjs <wav> <from> <to> [period]
//        period defaults to 0.75 / 1.5 / 3.0 s (one beat / half bar / bar at 80 BPM)
// Phase 0 is t = 0 (the score's first downbeat), not the window start, so a window that begins
// mid-bar still reports the true phase. Read the peak position AND the sign, not just |z|: |z| = 3 with
// the peak at 18 % of the bar and a negative value at phase 0 means the downbeat is quieter than the
// middle — a slow breath, not a hit.
import { readWav } from './lib/wav.mjs';

const wav = process.argv[2];
if (!wav) {
  console.error('usage: node scripts/probe-pulse.mjs <wav> <from> <to> [period]');
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
const a1 = Number(process.argv[4] ?? 180);
const periods = process.argv[5] ? [Number(process.argv[5])] : [0.75, 1.5, 3.0];

// one-pole lowpass at 160 Hz
const aL = 1 - Math.exp((-2 * Math.PI * 160) / R);
let lp = 0;
const low = new Float32Array(d.length);
const high = new Float32Array(d.length);
for (let i = 0; i < d.length; i++) {
  lp += aL * (d[i] - lp);
  low[i] = lp;
  high[i] = d[i] - lp;
}

// 25 ms envelope buckets
const HOP = 0.025;
function envelope(buf) {
  const n = Math.floor((a1 - a0) / HOP);
  const out = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const t0 = a0 + k * HOP;
    const i0 = Math.floor(t0 * R);
    const i1 = Math.min(buf.length, Math.floor((t0 + HOP) * R));
    let s = 0;
    for (let i = i0; i < i1; i++) s += buf[i] * buf[i];
    out[k] = Math.sqrt(s / Math.max(1, i1 - i0)) + 1e-9;
  }
  return out;
}
const el = envelope(low);
const eh = envelope(high);

function fold(env, period) {
  // quantise the period to whole envelope cells; folding by (k0 + k) % bins avoids the float drift
  // that leaves some bins empty, and anchors phase 0 to t = 0 (the first downbeat), not to `from`
  const bins = Math.max(4, Math.round(period / HOP));
  const k0 = Math.round(a0 / HOP);
  const acc = new Float64Array(bins);
  const cnt = new Float64Array(bins);
  for (let k = 0; k < env.length; k++) {
    const b = (k0 + k) % bins;
    acc[b] += env[k] * env[k];
    cnt[b]++;
  }
  const out = new Float64Array(bins);
  for (let b = 0; b < bins; b++) out[b] = 10 * Math.log10(acc[b] / Math.max(1, cnt[b]));
  const mean = out.reduce((a, b) => a + b, 0) / bins;
  const sd = Math.sqrt(out.reduce((a, b) => a + (b - mean) ** 2, 0) / bins);
  return { out, mean, sd, bins };
}

console.log(`window ${a0}–${a1}s · low <160 Hz / high residual · phase-folded at ${HOP * 1000} ms per cell`);
for (const P of periods) {
  for (const [name, env] of [['low ', el], ['high', eh]]) {
    const { out, mean, sd, bins } = fold(env, P);
    const maxv = Math.max(...out);
    const maxb = out.indexOf(maxv);
    // mean of the two cells nearest phase 0, against the whole period
    const near = (out[0] + out[1]) / 2;
    const z = sd > 1e-6 ? (near - mean) / sd : 0;
    const bar = '▁▂▃▄▅▆▇█';
    const lo = Math.min(...out);
    const spark = [...out]
      .map((v) => bar[Math.min(7, Math.max(0, Math.round(((v - lo) / Math.max(0.01, maxv - lo)) * 7)))])
      .join('');
    console.log(
      `  P=${P.toFixed(2)}s ${name}  peak at phase ${(maxb / bins * 100).toFixed(0).padStart(3)}%  `
      + `phase0=${near.toFixed(1)}dB mean=${mean.toFixed(1)}dB σ=${sd.toFixed(2)} z(phase0)=${z.toFixed(2).padStart(6)}  ${spark}`,
    );
    if (name === 'low ' && Math.abs(z) > 2.5 && maxb / bins < 0.12) {
      console.log(`      ! low band spikes every ${P}s on the downbeat (z=${z.toFixed(2)}) — this is what a "thump" looks like`);
    }
  }
}
