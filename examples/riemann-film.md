# Case: 《黎曼猜想》 (84 s, 2026-10-19)

A Chinese-language, narration-free explainer on the Riemann Hypothesis. 1920×1080, 30 fps, 84 s,
D minor score at 100 BPM, 35 bars. No drums in the final mix.

## Structure

| bars | time | scene | picture | music |
|---|---|---|---|---|
| 1–2 | 0–4.8 | open | a vertical thread grows, numbers rain, the question | drone + one piano note |
| 3–5 | 4.8–12 | primes | number line, primes ignite with beams and rings, camera pans | theme enters on violins |
| 6–7 | 12–16.8 | sieve | a scan head sweeps, composites get struck | pulse doubles |
| 8–10 | 16.8–24 | euler | one "string" per prime, interference field | harp arpeggios, rising |
| 11–13 | 24–31.2 | plane | a vertical ζ plate is wiped in from below, σ/t axes | half-time, horn pedal |
| 14–17 | 31.2–40.8 | zeros | the critical line lights, zeros ignite in ±γ pairs | tension → tape stop |
| 17 | 37.9–40.3 | stop | the world dims, the word 零点 alone | near silence |
| 18–22 | 40.8–52.8 | music | plate moves right, zeros emit waves, ψ(x) staircase sharpens | full band |
| 23–26 | 52.8–62.4 | hyp | the plate collapses into one line | brass states it |
| 27–29 | 62.4–69.6 | evid | 1859 / 8 页 / 10¹³ / $1M with a scanner band | light |
| 30–35 | 69.6–84 | end | constellation, title, 1859 — ? | theme alone, D add-9 |

## What made the picture feel expensive

- one recurring object (the line) and one camera that never cuts;
- 2.39:1 letterbox inside the 16:9 frame, 35 mm grain, heavy vignette;
- a **real** domain-colouring field for ζ(σ+it) (Euler–Maclaurin, 288×424), desaturated to ice blue,
  used as plate texture — the zeros are then drawn as emission lines, not as noise;
- zeros as conjugate pairs (±γ) so the plate reads as a spectrum;
- the ψ(x) staircase computed from the explicit formula, sharpening as more zeros are added;
- typography: Noto Sans SC 900 headlines, CMU Serif italic maths, Cinzel numerals.

## What the viewer rejected (in order)

1. zeros section "有点吵" → drums thinned (still too much);
2. 56–60 s "一直有个镲声或鼓声" → drums out of the statement, reversed cymbal removed;
3. "那个比较尖锐的镲声，全部移除" → all crash notes, all `impact` SFX replaced by a low `thud`;
4. 20 s onward "一直有个声音咚咚" → drums out of the Euler section, piano quarter notes → bar chords;
5. 41 s onward "还有，全部删除" → **the entire drum voice**, the bass piano octaves, `thud`,
   `subdrop` and the `hit` SFX removed.

The lesson is in `mix-and-master.md`: a "咚" usually has three layers, and fixing one leaves the
other two audible.

## Reusable numbers

- 35 bars × 2.4 s; scene labels on `OM.beat(n)`; marks on the same bars (0 % bend).
- camera: ~16 keyframes, each section changes either shot scale or zoom by 15–30 %;
  plus a perpetual drift of ±10 px and ±0.6 % zoom.
- motion pass (drifting lamps, breathing background, scanner band) lifted `om qa` from 0.1 to 0.2–0.5
  per second without changing the pacing.
- master: −14.1 LUFS, −3.1 dBTP, LRA 8.9, 41.9 MB H.264 + AAC 256k.

## Files worth copying from that project

- `index.html` — camera keyframes, the zeta image, `LINE_SPRITE`, the staircase, the text timeline.
- `tools/score.abc.txt` — the full 7-voice score, with the drum voice as rests.
- `tools/probe-*.mjs` — the numeric mix diagnosis used above.
