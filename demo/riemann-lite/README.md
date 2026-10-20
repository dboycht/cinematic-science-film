# riemann-lite — the smallest film that still passes the checklist

The Riemann Hypothesis in one vertical line. 10 bars, 100 BPM, one composition, one ABC score, no
drums. It exists to make every rule in the skill runnable in under a minute of setup.

## Specs

| | |
|---|---|
| 1920×1080 · 30 fps | 2.39:1 letterbox inside 16:9 (stage 1920×804 at `top:138px`) |
| 24.0 s score + 1.2 s hold | 100 BPM, 4/4, **10 bars** (bar = 2.4 s); picture and score share the grid |
| no narration | the captions are the narration; four screens |
| 5 voices | `lowstr` drone · `strings` · `violins` (melody) · `piano` · `harp` |
| no drums / no impact / no thud | the drop is carried by harmony and a picture event, not a hit |

Scenes: `open` (bars 1–2) → `primes` (3–5) → `zeros` (6–8) → `end` (9–10). Every scene label sits on
`OM.beat(n)`, and the score's `!mark:`s sit on the same bars.

## Run

```powershell
$OM = "$HOME\.claude\skills\huashu-motion\cli\om.js"

node $OM check  .
node $OM still  . --at 0.6,9.5,17.5,21.5
node $OM sound  .
node $OM render . --blur
node $OM qa     .
```

From the repository root, the probes:

```powershell
node scripts/probe-score.mjs demo/riemann-lite
node scripts/probe-pulse.mjs demo/riemann-lite/assets/sound.wav 1 4.5 2.4
node scripts/probe-loud.mjs  demo/riemann-lite/assets/sound.wav 12 18
```

## Measured (2026-10-20)

- `om check`: 0 errors / 0 warnings.
- `probe-score`: every voice ends at beat 40 = **10.00 bars**; marks `open@0 primes@8 zeros@20 end@32`.
- `om sound`: **−14.2 LUFS, peak −1.5 dBFS**; energy `open −24.4 · primes −21.1 · zeros −14.1 · end −16.6` dB RMS.
- master (`ebur128=peak=true` on the render): **−14.2 LUFS, −1.5 dBTP, LRA 10.6 LU**. The LRA is
  deliberately wide — a very quiet opening against a full zeros section; the skill's 6–10 LU band
  assumes a less extreme arc, so this number is noted rather than flattened.
- tempo fit: open→primes 100.0 BPM (−0.0 %), primes→zeros 100.3 (+0.3 %), zeros→end 100.3 (+0.3 %).
- `probe-pulse` on the quiet opening: peak at 1 % of the bar, `z(phase0) = 1.9` (2.1 with the window
  `0 4.8`). That is a **once-per-bar** chord onset: the whole-note pad re-attacks on the bar line.
  Folded at the beat (0.6 s) the same attack leaks in at `z = 1.95` — one of four beats carries it —
  still below the skill's warning line `|z| > 2.5`, and audible as a pad swell rather than a click.
  (Phase 0 here means t = 0, the first downbeat — not the start of the probe window.)
- `om qa`: no single-frame pops; the only "still" stretch left is **22.7–25.2 s**, the end card —
  the one place the skill allows it.
- render: 1920×1080, 30 fps, 25.20 s, H.264 + AAC 256k, ~14.5 MB.

## What to look at

1. **0.6 s** — the thread grows from the top; the tip carries the only hot point in the frame.
2. **9.5 s** — every fifth prime ignites in turn, so the axis fills evenly instead of growing one
   white blob at the bottom (the first version did exactly that).
3. **17.5 s** — zeros as conjugate pairs `±γ`, each with its own interference wave; the labels sit on
   both sides of the critical line.
4. **21.5 s** — the line is still there, behind the title, as the dash in `1859 — ?`.

## Files

- `index.html` — composition, camera keyframes, canvas world, text timeline and the ABC score.
- `treatment.md` — the plan (rhythm sheet, four stops, continuity chain), written before the build.
- `assets/fonts/` — Noto Sans SC 500/900, SIL OFL 1.1 (`OFL.txt`, `LICENSES.md`).
- `vendor/` — GSAP and the huashu-motion runtime; licences next to the files.
- `out/` — renders (git-ignored).
