---
name: cinematic-science-film
description: "Make a cinematic explainer film about a hard idea (a theorem, a proof, a physical law) with code: one continuous world, a score written in ABC, a mix the viewer will actually accept, and a master that does not clip. 用代码做「电影感」数学/科学科普短片的诀窍：连续世界、网格化配乐、按频段定位的混音返工、母版交付。"
---

# cinematic-science-film

For "给我做一条讲 XX 的视频，要电影感 / 要高级 / 像网上那种 AI 生成的片子" where XX is a
mathematical or scientific idea. The picture is code, the music is notation, and the last 20% of the
work is always the mix — the viewer hears a "咚咚" you cannot hear, so the method below is built
around locating sound numerically instead of guessing.

Built on `huashu-motion` (the om CLI, one `index.html` composition, GSAP + Canvas, Chrome renders it).
Read that skill's `SKILL.md` and `references/contract.md` first; this file is what the film taught
that is not in there.

**What this is:** field notes from two delivered films, written as rules with checks you can run.
**What it is not:** a renderer, a font pack or a taste engine — `huashu-motion` provides those. The
`demo/riemann-lite/` project is the smallest film that still exercises every check in §10.

## 1. The shape that worked

- **One world, one recurring object.** Here a single vertical line: it is the open question, then the
  axis of symmetry, then the critical line, then the horizon of the end card. Every scene is the
  same line seen differently, so the film never looks like slides.
- **35 bars at 100 BPM = 84 s.** Every scene is a bar number, every label sits on `OM.beat(n)`, and
  the score's `!mark:scene!`s land on the same bars → `om sound` reports 0.0–0.3 % tempo bend.
- **Energy**: hook −24 dB → build −20 → −16 → a half-time dip → the drop at −13 → resolve −19.
  One real stop (1.3 s of near silence) before the drop; `om qa` will call that stop "still" — that
  one is intentional, keep it.
- **Text is the narration.** No voice-over: 一句一屏, ≤ 12 characters per line at 80–96 px.
  Headlines in Noto Sans SC 900, formulas in CMU Serif italic, numerals in Cinzel.

## 2. Windows reality check

This skill drives [`huashu-motion`](https://github.com/alchaincyf/huashu-motion): its `om` CLI owns the
composition contract, the score engine and the renderer. Install that skill first. On Windows the `om`
entry point is a POSIX shim, so call the JS file directly:

```powershell
$OM = "$HOME\.claude\skills\huashu-motion\cli\om.js"   # wherever huashu-motion is cloned
node $OM new D:\path\film
node $OM check D:\path\film        # 0 errors / 0 warnings before any render
node $OM still D:\path\film --at 1,34,47,58,76
node $OM sound D:\path\film        # energy curve + tempo fit, prints per-stretch dB
node $OM render D:\path\film [--blur]
node $OM qa D:\path\film
node $OM studio D:\path\film --no-open   # http://localhost:4848/
```

The probes in `scripts/` need the same `cli/` folder for the ABC parser; they find it themselves
(`OM_CLI` wins, then a local `node_modules/huashu-motion`, then the usual `~/.claude`, `~/.codex`,
`~/.dsh` skill folders). Chrome and ffmpeg must be available; nothing is downloaded per render.

## 3. `om check` false positive: whitespace text nodes

The layout checker walks text nodes and treats **any** element whose `textContent` is long enough as
a text box. A container (`body`, `#film`, `.ui`) that holds only a newline therefore gets measured as
a full-frame text box and reported as `low-contrast 1.2:1`. Fix inside the composition, once at parse
and once on `load`:

```js
const stripSpace = () => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const kill = [];
  for (let n; (n = w.nextNode());) if (!n.nodeValue.trim()) kill.push(n);
  kill.forEach((n) => n.remove());
};
stripSpace(); addEventListener('load', stripSpace);
```

After that `om check` goes to 0/0 and stays there.

## 4. `om qa` "still" is a downscaled grey-frame difference

It decodes at 96×54 and flags runs where consecutive frames differ by < 0.25 grey levels. A dark film
with thin glowing lines scores low no matter how alive it feels. Do not chase the number; add motion
that a viewer actually sees:

- **moving light**: two or three large soft radial "lamps" (r 700–900, alpha .03–.06) drifting
  across the frame at 40–60 px/s;
- **breathing ground**: the background radial's centre drifts a few percent and its intensity
  breathes ± 8 % over 6–10 s;
- **hand-held camera**: add perpetual small offsets to the camera keyframes
  (`+ sin(t*.53)*5 + sin(t*.19)*9` on x, similar on y/z) so nothing is ever parked;
- **a scanner**: a wide soft band crossing the plate/data every few seconds;
- **a travelling highlight**: one bright dot running along the curve or the line.

Those five took this film from ~0.1 to 0.2–0.5 motion/s without touching the pacing. Expect the
drop and the end hold to remain the only big and small extremes.

## 5. Score in ABC — the notation trap that costs an hour

**`D4` is not "D4".** In ABC with `L:1/8`, `D4` is the pitch **D** (octave 4 by default) with
**length 4**. Octaves are `,` and `'` only: `D` = D4, `d` = D5, `D,` = D3, `D,,` = D2.

Consequences that bit this film: `D4 2 F4 2 A4 2` parses as four half notes (16 eighths = two bars),
a piano voice grew 13 bars, and `om sound` reported "ends 116 s, past the film's end". Always verify:

```powershell
node <skill>/scripts/probe-score.mjs D:\path\film
# every voice must end at the same beat, e.g. 140 quarters = 35 bars
```

Other score facts worth knowing:

- `!hit!` = impact + subdrop (a cymbal-ish slam) — see §6 before using it;
- `!mark:scene!` must sit at the first token of the bar in one voice (use the bass/drone voice);
- `!stop(! … !stop)!` gives the tape stop; a bar of rests right after is the held breath;
- voices used here: `lowstr` drone, `strings`, `violins` (melody), `horn`, `piano`, `harp`,
  `drums kit=cinematic`. D minor, lift to F at the end, final chord D add-9 (unresolved).

**Better than verifying the notation: generate it.** Keep the chord grid, each voice's register,
the dynamics and the sync points as data, and let a script emit the ABC. It can count lengths itself
(every bar exactly 8 units; 480 units per voice for 60 bars) *and* cross-check with the engine's own
`parseAbc` before writing the file — hand-checking voice lengths is not work anyone should do twice.

Two traps inside that: **a space between pitch and length is not a fix** — the tokeniser reads `A 4`
as "A, default length" and silently drops the `4`; glue the length to the note and use `,`/`'` for
octaves, never digits. And **let the music testify for the picture**: if a caption claims "T and I
generate 24 operations", write the motif's transposition and inversion into those bars, then check the
pitch classes against what the screen draws. That is how the inversion in this film turned out to be a
*diatonic contour* mirror (E A G F) rather than the pitch-class inversion I₈ (E B A A♭) — two
different operations, and only one of them made the sentence true. Fixing it also improved the
harmony (the E-major bar that follows is better than the one it replaced).

## 6. The mix: locate numerically, then delete the layer

The taste this method encodes, and a hard rule unless the brief says otherwise: **no sharp cymbal
anywhere, and no "咚咚" pulse under quiet passages.** A "sound is noisy" complaint is never solved by
turning a fader down a little; find which layer produces the pulse. If the client asks for weight, ask
before reaching for `impact` / `hit` / `thud` — they read as cymbals on small speakers.

Two probes (in `scripts/`):

- `probe-loud.mjs <wav> <from> <to>` — 0.1 s RMS and a high-frequency (first-difference) energy.
  Periodic HF spikes at exactly 0.6 s = 100 BPM quarter-note percussion.
- `probe-band.mjs <wav> <from> <to>` — one-pole lowpass at 160 Hz vs the residual. A 0.6 s-period
  bump in the **low** band is a kick or a bass octave; a bump in **high** is a snare/cymbal.

A third one is worth writing once and keeping (`probe-pulse.mjs`): **fold the low- and high-band
envelopes at the bar period** (0.75 / 1.5 / 3.0 s at 80 BPM) and print the phase profile. This is the
decisive test for "is something hitting on the downbeat", and it is the one that still works after the
sound source changes. **Read the peak position and the sign, not just |z|**: |z| = 3 with the peak at
18 % of the bar and a negative value at phase 0 means the downbeat is *quieter* than the middle — a
slow breath, not a hit. Only a spike **at** phase 0 is a "咚".

Sources found in this film, in the order they were removed:

1. drum kit on every beat (`C,,2 C,,2 D,,2 C,,2` = 4 kicks/bar);
2. **bass piano octaves** `[D,,D,]2` ×4/bar — the loudest "咚" of all, and the one a drum-only fix
   leaves behind;
3. `impact` SFX (title slam — contains a cymbal) and `!hit!`;
4. `thud`, `subdrop`, `hit` (kick + click) SFX;
5. a reversed cymbal (`reverse`) swelling into the collapse.

The final accepted state: **no drums at all** (the drum voice is all rests, the tape-stop cue moved
onto a rest bar), no thud/subdrop/hit, and the piano reduced to one chord per bar. The drop is
carried by the full orchestral chord plus a picture flash. 27 non-percussive effects remain
(riser, pop, whoosh, chime, count).

Practical consequences for the next film:

- never place `impact`/`hit`/`thud` "for weight" without asking — they read as cymbals;
- if the brief needs a drop, write a riser + a long crescendo in the score instead of a hit;
- after any score edit: `score-src → set-score → om sound → probe-pulse`, then only re-mux the
  audio (the picture has not changed, so a full re-render is wasted — see §7 for the proof).

### Changing the sound source is a re-mix, not a swap

The same score on real samples is a different mix, and a worse one until you fix it. Two things
happen: real sustained strings are much hotter than the synth, so the section dynamics **flatten**
(the 180 s group-theory film lost its peak at the bloom and its dip at the quiet scene — everything
sat within 0.6 dB); and `sound.js` runs a bus compressor (`compress(out2, -16, 2.5)`) that by design
squeezes whatever is left. Do not fight that with faders. **Write the shape into the dynamics** — the
section that should breathe gets `p`, the bloom gets `f`, and the constant pad goes down — then re-read
the per-stretch dB `om sound` prints and confirm the peak and the dip came back.

Then re-run the pulse probe, because **a real grand piano has a hammer attack**, exactly the class of
sound the brief rejects. That check is not optional after a source change.

## 7. Master and deliver

`om render` masters to −14 LUFS but AAC adds 1–2 dB of true peak; a film that measures −1.5 dBFS
sample peak can hit 0.0 dBTP after encoding. Re-mux the picture with a limiter and measure:

```powershell
ffmpeg -i out\v5.mp4 -i assets\sound.wav -map 0:v:0 -map 1:a:0 -c:v copy ^
  -af "alimiter=limit=0.70:level=false" -c:a aac -b:a 256k -ar 48000 -shortest out\final.mp4
ffmpeg -nostats -hide_banner -i out\final.mp4 -af "ebur128=peak=true" -f null - 2>&1 | Select-String "I:|Peak:"
```

Target −14 ± 1 LUFS, ≤ −1 dBTP, LRA 6–10 LU. 84 s at 1080p30 with `--blur` renders in ~10 min.

**Prove that the picture did not move instead of trusting it.** `ffmpeg -i a.mp4 -map 0:v -c copy -f md5 -`
must print the same digest for the old and the new file. With that proof, re-muxing an audio change
costs 10 s instead of a 5 400-frame re-render (20 min at 180 s); only re-render when the picture code
changed too.

**Measure before you limit.** The recipe above assumes AAC pushed the peak up. Check first: if the
encoded file already measures ≤ −1 dBTP, skip `alimiter` — a second AAC generation is a real loss for
no gain. (The synth-only cut of the group-theory film measured −1.5 dBFS encoded, so it was re-muxed
without a limiter; the sample version measured −2.0 dBFS with a non-engaging limiter at `limit=0.85`.
Its LRA went 5.1 → 6.1 LU, i.e. real samples can also *raise* LRA into the 6–10 band.)

## 8. Sample instruments — "blocked" usually means one host, not the pack

`om samples build` fetches CC0/CC-BY instruments from a handful of GitHub repos at pinned commits
(through `raw.githubusercontent.com`) and unpacks with `bsdtar` (`C:\Windows\system32\tar.exe` copied
to `bsdtar.exe` on PATH is enough). Instruments land in `~/.cache/huashu-motion/samples`.

The first attempt on the development machine failed 573 of 585 files. **That is not the pack being unavailable.**
Diagnose in this order before falling back to synths:

1. **Host matrix.** `curl -sI` each host involved. Here `raw.githubusercontent.com` timed out while
   `api.github.com` and `codeload.github.com` both answered 200 — one domain, not the ecosystem.
   Try the canonical IPs with `--resolve` to separate a DNS problem from a blocked route. Check
   `HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings` for a local proxy
   (`ProxyEnable` / `ProxyServer`) and export it as `HTTP_PROXY` / `HTTPS_PROXY` — curl inside the
   builder honours the env var, and that alone fixed it (430 KB/s, 321 files, one pass).
2. **Do not download the archives instead.** `codeload` will serve whole repos, but at 72 KB/s here
   (6.5 MB in 90 s) a 1–2 GB archive is hours. Wrong lever.
3. **The builder skips files already in its cache** (`samples-build.js`: `existsSync → continue`).
   So dropping files into `…\samples\.src\raw\<owner_repo>\<path>` makes the build fully offline —
   useful when the download has to happen on another machine.
4. **To get the exact file list, let the build enumerate.** `tree()` goes through `api.github.com`
   (reachable) and caches the recursive listing as JSON; every failed download logs
   `warning <path>: download failed`. Log + cached tree JSONs (each blob carries a `size`) gives a
   precise manifest with real volumes, without re-implementing the filters or the regexes.
5. **Build only what the score uses.** `om samples build piano violins violas celli basses violin harp
   flute horn` — 9 ids, 321 files, 549 MB raw, **33.5 MB packed**. The full pack is several times that
   for instruments this film never plays.

Keep `warmpad` on the synth: it is a bed with no attack, and a real section sample would put an
onset where the arrangement wants none.

## 9. Historical imagery inside a dark film

A film that wants a face (Galois, Noether, a page of handwriting) reaches for public-domain archive
images — and those are **black line on white paper**. Pasted in, they punch a white hole through a
dark frame.

- **Negative them.** `ctx.filter = 'invert(1) grayscale(1) contrast(1.16)'`, then tint with
  `globalCompositeOperation = 'multiply'` — the black ground stays black and the lines take the colour.
  An 1848 engraving becomes luminous white-on-black line art, closer to the film than the original
  ever was; handwriting becomes glowing script. Photographs should stay positive: split-tone them
  instead (warm `multiply` for the highlights, dark-blue `screen` to lift the shadows).
- **Build the feathered mask as its own canvas**, then apply it with one `destination-in`. Two
  sequential `destination-*` fills on the same canvas is where this goes wrong: drawing a bottom fade
  while `destination-in` is still active multiplies alpha by 0 at the start of the band and erases
  the face — the frame then looks like a missing asset ("just some fabric in the corner"), not like a
  compositing bug, which is why it survives a quick look.
- **Feather harder than feels right.** A radial mask with outer radius `0.8 × max(w,h)` still leaves a
  visible rectangle; `~0.52 ×` fades the edges out properly.
- Public domain only — the famous 1930s Noether photograph is CC BY-SA, so take a PD likeness
  instead — and record each file's Commons page, author and licence template in
  `assets/portraits/SOURCES.md`. CC-BY sources (e.g. Salamander Grand Piano) need the credit in the
  README and on screen.

## 10. Delivery checklist

- [ ] `om check` 0 errors, 0 warnings
- [ ] stills at hook / hero / densest / end looked at (not just generated)
- [ ] `om qa`: no pops; remaining "still" stretches are only the planned stop and the end hold
- [ ] every flagged "still" stretch checked with frame-to-frame PSNR (22–28 dB = it is moving;
      `om qa` over-reports on dark films with thin glowing lines) — and the ones that really have no
      event got one, instead of the number being explained away
- [ ] **caption time-overlap checked** — `om check` only sees resting frames and cannot see two
      captions printed on top of each other (see huashu-motion `references/verification.md`)
- [ ] score voices all end on the same beat; marks all matched (0 % bend)
- [ ] mix probes show no periodic low or high pulse in quiet sections — read the pulse plot's peak
      position and sign, not just |z|
- [ ] if the sound source changed: energy curve re-read (peak / dip intact) **and** pulse probe re-run
- [ ] −14 LUFS, ≤ −1 dBTP, duration and codec verified with ffprobe; LRA noted
- [ ] re-mux instead of re-render for audio-only changes, proven by matching video-stream MD5
- [ ] `DEVELOPMENT.md` in the project records the traps hit (and a `treatment.md`)
- [ ] studio URL handed over for frame-level comments

## References

- `references/abc-and-score.md` — notation cheat-sheet, voice roster, dynamic marks, fitting.
- `references/mix-and-master.md` — probe output reading, the layer list, limiter recipe.
- `examples/riemann-film.md` — the 84 s Riemann film: structure, what was rejected and why.
- `examples/group-theory-film.md` — the 180 s group-theory film: twelve scenes, no drop, archive
  negatives, the sample-pack route, and the five things that went wrong first.
- `scripts/` (paths relative to this skill) — `probe-score.mjs` (voice lengths), `probe-loud.mjs`
  (0.1 s RMS + HF energy), `probe-band.mjs` (low vs high attribution), **`probe-pulse.mjs` (fold the
  envelopes at the bar period; the decisive "is it hitting on the downbeat" test — pass
  `<wav> <from> <to> [period]`)**), `set-score.mjs`, `mux-audio.ps1`; `scripts/lib/` holds the WAV
  reader and the `huashu-motion` locator.
