# Mix: locate the complaint numerically, then delete the layer

You cannot hear the film. The viewer can, and says things like "有点吵", "一直有个咚", "是比较尖锐的
镲". Turning a fader down 1 dB has never satisfied that; finding the layer has.

## The two probes

```powershell
node scripts/probe-loud.mjs <wav> 20 30   # 0.1 s RMS + high-frequency energy
node scripts/probe-band.mjs <wav> 20 30   # <160 Hz band vs the rest
```

Reading them:

| pattern | meaning |
|---|---|
| HF spikes exactly every 0.6 s (100 BPM) | quarter-note percussion (snare / cymbal / click) |
| low-band bump every 0.6 s | kick, taiko, or a bass octave in the piano |
| low-band bump every 1.2 s / 2.4 s | half notes / bar-level harmony — usually fine |
| smooth ±2 dB swells | melody and chords, leave it alone |

A "sharp cymbal" is broadband: it shows as an HF spike 5–10× the baseline (0.05–0.2 vs 0.01).

## Every layer that produced "咚咚" in the reference film

Removed in this order; each one alone was still audible after the previous was fixed:

1. `drums kit=cinematic` playing `C,,2 C,,2 D,,2 C,,2` — four kicks a bar;
2. **piano bass octaves** `[D,,D,]2` ×4 a bar — the loudest thump of all and the one a drum-only fix
   leaves behind (a low octave on every beat);
3. `impact` SFX (a title slam with a cymbal layer) and the `!hit!` decoration (impact + subdrop);
4. `thud`, `subdrop`, `hit` SFX;
5. `reverse` (reversed cymbal) swelling into a collapse;
6. `^C,` crash notes in the score.

Final accepted state: the drum voice is **all rests** (the tape-stop cue moved onto a rest bar), no
thud/subdrop/hit, piano reduced to one chord per bar. 27 effects remain, all tonal or airy
(riser, pop, whoosh, chime, count). The drop is carried by the full orchestral chord plus a picture
flash — it still lifts, without a hit.

Rule of thumb for the next film: **do not place `impact` / `hit` / `thud` "for weight" without asking.**
If the brief wants a drop, write a riser plus a long crescendo in the score.

## Editing loop (cheap)

```powershell
node scripts/probe-score.mjs D:\film          # voices still equal?
node scripts/set-score.mjs D:\film D:\film\tools\score.abc.txt
node $OM sound D:\film                         # prints new energy curve + effect count
node scripts/probe-band.mjs D:\film\assets\sound.wav 55 62
powershell -File scripts/mux-audio.ps1 -Video out\v5.mp4 -Wav assets\sound.wav -Out out\final.mp4
```

Only the audio changed, so re-muxing the existing render (`-c:v copy`) is correct and takes seconds.
Re-render the picture only when the picture changed.

## Master

`om sound` masters to −14 LUFS, but AAC adds 1–2 dB of true peak: a file at −1.5 dBFS sample peak
can measure 0.0 dBTP after encoding. The mux script applies `alimiter=limit=0.70:level=false`
(≈ −3 dBFS ceiling → about −1 dBTP after AAC). Verify:

```
I: -14.3 LUFS   LRA: 8.7 LU   Peak: -1.5 dBFS
```

Targets: −14 ± 1 LUFS integrated, ≤ −1 dBTP, LRA 6–10 LU, stereo 48 kHz AAC 256k.

## Visual check of the sound

```
ffmpeg -v error -i assets/sound.wav -lavfi "showspectrumpic=s=1600x500:legend=0:scale=log:fscale=log" spec.png
```

Vertical stripes are hits — they should sit where things land on screen. A band of hiss that runs
continuously is a riser or noise layer that will read as "镲" on small speakers.
