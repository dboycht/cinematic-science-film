# treatment — 黎曼猜想 / riemann-lite

A demo for the `cinematic-science-film` skill, not a new film. It has to be small enough to read in
one sitting and complete enough that every check in the skill's §10 has something to fail on.

## Premise

One vertical line. At first it is the open question ("all non-trivial zeros lie on this line?"), then
it becomes a number axis with the primes lit on it, then the critical line with the zeros in conjugate
pairs, then — in the end card — the dash in `1859 — ?`. Nothing else recurs. No cuts, one camera.

Promise to the viewer: in 25 seconds, see what the hypothesis says and why it is still open.

## Look

- Ground: `#03050a` to `#0b1424`, three drifting soft lamps (r 760–900, α .03–.05), 420 dust motes.
- One accent (amber `#e7b96f`) for the line, the years, and the zero labels; one ice blue (`#9ed2ff`)
  for the primes and the data. Colour carries meaning, not decoration.
- 2.39:1 letterbox, 35 mm-style grain at 5.5 %, heavy vignette, thin 1–3 px strokes.
- Type: Noto Sans SC 900 for headlines, 500 for captions; no third typeface — the demo is deliberately
  smaller than the reference films, which also use CMU Serif and Cinzel.

## Rhythm sheet (bar = 2.4 s at 100 BPM)

| bars | s | scene | picture event | music | energy |
|---|---|---|---|---|---|
| 1–2 | 0–4.8 | open | thread grows down, tip glows, title rises | drone + one piano note | −24.6 dB |
| 3–5 | 4.8–12 | primes | every fifth prime ignites in turn, beam + label | theme on violins, harp enters | −21.1 |
| 6–8 | 12–19.2 | zeros | line becomes critical; ±γ pairs ignite with waves | strings suspend, riser into the turn | −14.1 |
| 9–10 | 19.2–24 | end | line shrinks behind the title, constellation blooms | theme alone, D add-9 | −16.6 |
| +1.2 s | 24–25.2 | hold | nothing moves but the dust | final chord rings | — |

There is no drop. The high point is the zeros section; the end is a resolution, not a second climax.
That is a deliberate second shape after the 84 s Riemann film, which peaks at 41 s.

## Beat map

- `scene:open` = 0.0 s, `scene:primes` = 4.8 s, `scene:zeros` = 12.0 s, `scene:end` = 19.2 s.
- Score marks on the same bars: `!mark:open!` bar 1, `!mark:primes!` bar 3, `!mark:zeros!` bar 6,
  `!mark:end!` bar 9.
- Sound events: riser at 11.1 s, one `pop` per prime (15), one `chime` per zero pair (6), whoosh at
  19.4 s. No `impact`, `hit`, `thud`, `subdrop`, or drum voice anywhere.

## Four stops (check these frames, not the code)

1. **Hook, 0.6 s** — one line, one question; the type and the line both point down.
2. **Hero, 9.5 s** — the axis full of primes; bead spacing 24 px, glow 12–17 px so they stay beads.
3. **Densest, 17.5 s** — six zero pairs, twelve waves, labels on both sides; the frame still reads.
4. **End, 21.5 s** — the title, `1859 — ?`, and the line reduced to a thread behind the type.

## Continuity chain

```
thread ──> number axis ──> critical line ──> dash in "1859 — ?"
  ↑            ↑                  ↑                    ↑
grows       primes lit       zeros ±γ            camera pulls back
```

Each transition keeps the same object at the same x; only its role changes. The camera drifts ±10 px
and ±0.6 % zoom for the whole 25 s, so no frame is ever parked.

## Sound

D minor. 5 voices: `lowstr` drone (carries the marks), `strings` pad, `violins` melody, `piano` one
chord or figure per bar, `harp` arpeggios from bar 3. Final chord is **D add-9**, unresolved.

Rule applied from `references/mix-and-master.md`: no percussion at all, and no piano bass octave on
the beat. A quiet opening must stay quiet — a periodic low bump there is the failure this demo is
built to catch.

## Acceptance

- `om check` 0/0, and the four stops above look right at full resolution.
- every voice ends at beat 40; marks match the scene labels to ≤ 0.3 %.
- `probe-pulse` at 1–4.5 s: no spike at phase 0 (a peak mid-bar with a negative z is acceptable).
- master −14 ± 1 LUFS, ≤ −1 dBTP; the video stream MD5 is unchanged if only the mix is re-cut.
