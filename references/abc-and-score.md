# ABC score: what the parser actually reads

The score lives in `<script type="text/vnd.abc" id="om-score">` next to the timeline. `om sound`
parses it, fits its `!mark:scene!`s to the film's scene labels, and synthesizes the audio.

## The trap that costs an hour

With `L:1/8`:

```
D4      = pitch D (octave 4 by default) with LENGTH 4 eighths  →  a half note
d       = D5,    D,  = D3,    D,, = D2,    D,,, = D1
D2      = D with length 2 eighths  →  a quarter note
```

Octaves are written **only** with `,` and `'`. Never `D4` for "D in octave 4". A line meant as
`D4 2 F4 2 …` becomes four half notes, a voice grows dozens of bars, and `om sound` prints
`ends 116.25s`, past the film — with every tempo fit still at 0 %, which makes it easy to miss.

**Always verify before rendering:**

```powershell
node scripts/probe-score.mjs D:\path\film
# LOW  end beat 140 = 35.00 bars     ← every voice, same number
# marks open@0 primes@8 sieve@20 … end@116
```

## Voices used in the reference film

| id | instrument | role |
|---|---|---|
| `LOW` | `lowstr` | drone / bass pedal, one whole note per bar; carries the `!mark!`s |
| `STR` | `strings` | pad chords, whole notes |
| `VLN` | `violins role=melody` | the tune, one line |
| `HRN` | `horn` | low pedal, octave below the pad |
| `PNO` | `piano` | arpeggios early, sustained octaves late |
| `HARP` | `harp` | eighth-note arpeggios, the sparkle |
| `DR` | `drums kit=cinematic` | taiko / big snare — **removed entirely in the final mix** (see mix-and-master.md) |

Write **every bar in every voice**, including `z8` / `Z4` rests. Voices must total the same length.

## Marks, decorations, structure

- `!mark:name!` at the first token of a bar in the bass voice → lands on `scene:name`.
- `!hit!` = impact + subdrop, i.e. a **cymbal-ish slam**. Avoid unless the user asked for it.
- `!stop(! … !stop)!` tape stop; put a bar of rests after it for the held breath.
- `!rise( … !rise)!` a riser that lands where it closes; `!filter(! … )!` opens the mix;
  `!stutter( … )!` beat repeat.
- `!p! !mp! !mf! !f! !ff!` dynamics; `!crescendo(! … )!`, `!fermata!`, `!accent!`, `!breath!`.
- `!ped! … !ped-up!` piano pedal.

## Fitting to the picture

Build the film on the score's grid: `OM.music({ bpm: 100 })`, scene labels at `OM.beat(n)` on the
bars where the marks sit. `om sound` then reports 0.0–0.3 % bend. If a stretch bends more than ~8 %,
the bar count is wrong — fix bars, not tempo.

`om sound` also prints per-stretch RMS: read it as the energy curve. Reference film:

```
open -23.9 · primes -21.3 · sieve -19.4 · euler -16.3 · plane -17.9 · zeros -17.8
music -13.2 · hyp -14.1 · evid -17.2 · end -18.6 dB
```

A dip before the drop and a clear peak at it are the point.

## Musical shape that worked for a dark science film

D minor, 100 BPM, 35 bars (84 s):

1. drone + one piano note (the question)
2. theme on violins, string pad, taiko downbeat
3. pulse doubles, harp arpeggios enter
4. half-time, horn pedal, suspended harmony (the "mystery" section)
5. rising tension → tape stop → 1.3 s of near silence
6. full band at the drop
7. brass states the thesis, then thins
8. theme alone, final chord is **D add-9** — unresolved, matching an unsolved problem
