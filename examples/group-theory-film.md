# 群论之美 / The Beauty of Groups — 180 s, twelve scenes, one square

A second worked example, deliberately unlike the Riemann film: longer (3 min), a flat 2.40:1 letterbox
instead of a 2.39 crop, **no drop at all** (the peak is a bloom), real instrument samples instead of
synths, and archive portraits instead of pure geometry.

## Specs

| | |
|---|---|
| 1920×1080 · 30 fps · **180.0 s** | 80 BPM, 4/4, **60 bars** (bar = 3.0 s), picture and score on the same grid |
| 2.40:1 | stage 1920×800 at `top:140px`; world coordinates = stage coordinates |
| no narration | the subtitles are the narration; ≤ 2 lines per screen, 57 captions |
| 8 voices | `lowstr` drone · `warmpad` · `strings` · `horn` · `harp` · `piano` · `flute` · `violin` (melody), on real samples |
| −14.0 LUFS · −2.0 dBFS · LRA 6.1 | measured with `ebur128=peak=true` |

## The arc (由浅入深 — each scene is a bar line)

| bars | s | scene | what the picture does |
|---|---|---|---|
| 1–3 | 0–9 | turn | a plain square grows from a point, turns 90°, turns again, flips — it looks unchanged |
| 4–8 | 9–24 | moves | the four corners get colours; the eight moves are demonstrated one by one onto a ring of eight slots |
| 9–13 | 24–39 | rules | closure / associativity / identity / inverse, each with a square demo; ends by naming 「群」 |
| 14–19 | 39–57 | table | the ring flies into row/column headers; 64 cells fill on a diagonal; Latin-square scan; then r∘s ≠ s∘r with **two-step matrix interpolation** |
| 20–24 | 57–72 | galois | the table dissolves; the 1848 engraving as a negative; his own last letter page |
| 25–30 | 72–90 | same | a square and four labelled beads permute together; two identical tables merge; 8 nodes become a cube |
| 31–36 | 90–108 | music | twelve pitch classes on a clock; the motif, then T₅, then I₈ — **the score plays exactly those** |
| 37–42 | 108–126 | inside | the 4 rotations migrate into a cluster with their own cycle; the 4 reflections into a coset; 4 \| 8 |
| 43–46 | 126–138 | quotient | each cluster collapses to a point; a 2×2 table; G/H ≅ ℤ/2 |
| 47–51 | 138–153 | atoms | lattice → 18 families + 26 sporadic → a 1700-point cloud with the Monster; the bloom |
| 52–57 | 153–171 | noether | three rows: time/space/rotation symmetry on the left, a conserved line that never moves on the right |
| 58–60 | 171–180 | end | the plain square again; title card |

Energy: −20.2 · −21.1 · −18.2 · −15.8 · **−21.2 (the quiet dip)** · −15.7 · −15.5 · −15.7 · −15.9 ·
**−15.3 (the bloom)** · −15.6 · −17.6 dB RMS. No drop: the film's high point is an expansion.

## Decisions that made it work

- **One object, twelve readings.** One square, then its eight moves, then eight ring slots, then eight
  table headers, then 64 cells, then 8 cube vertices, then 12 pitch classes, then two cosets, then two
  points, then a cloud, then the same square again. Every scene is the same geometry seen from a new
  distance — which is why 0 hard cuts hold for three minutes.
- **Colour encodes structure.** 4 cool shades = the four rotations, 4 warm = the four reflections. The
  Cayley table's 4×4 checkerboard then appears by itself, and colour is doing explanation, not decor.
- **The mathematics is computed, never drawn.** `matLerp(el, u)` interpolates a group element from the
  identity, so a flip correctly squashes the square to a line and back. The cube is the Cayley graph of
  ⟨r, s⟩ laid out as two 4-cycles plus four pillars. r∘s vs s∘r is two matrix products, animated.
- **Let the music testify.** The caption says T and I generate 24 operations, so the motif's
  transposition (A D E F) and inversion (E B A A♭) are actually played. That check caught a real
  error — the first "inversion" was the diatonic contour mirror E A G F, a different operation.
- **Archive images as negatives.** Both historical portraits are black-on-white. Inverted and tinted
  (`invert(1)` + `multiply`), the engraving becomes luminous line art and the handwriting glows; a
  photograph stays positive and is split-toned instead. Credit: PD portraits from Wikimedia Commons
  (`assets/portraits/SOURCES.md`), piano samples CC BY 3.0 (Salamander Grand Piano V3, Alexander Holm).

## What went wrong first (and the fix)

1. Drawing the eight ring slots at r = 268 while the square had side 360 → its **half-diagonal is
   254**, so the corners sat inside four slots. `om check` cannot see it (it judges text). Shrink the
   square as the ring arrives.
2. A ring of r = 236 plus an 82 px bottom caption do not both fit in an 800 px stage. Move that
   stretch's captions into a left column (width 730) so they separate in x instead of y.
3. Two captions 0.1 s apart printed on top of each other — `om check` reported 0/0. Hence
   `tools/check-caps.mjs`, and `buildCaps` now compresses exits automatically.
4. The portrait compositing had a real bug: painting a bottom fade while
   `globalCompositeOperation = 'destination-in'` was still active erased the upper half of the face.
   One mask canvas, one `destination-in`.
5. `om qa` reported 26 "still" stretches; frame-to-frame PSNR showed 24.2–35.4 dB everywhere, i.e. it
   was over-reporting. The two stretches that genuinely had no event got real motion — including the
   Noether rows, where the states now move forever and the conserved line never does.

## Files

`index.html` (one composition, ~1900 lines incl. the ABC score) · `treatment.md` · `DEVELOPMENT.md` ·
`tools/` (score generator + validators, caption checker, mix probes) · `assets/portraits/` (8 PD files
+ SOURCES.md) · `out/` renders.
