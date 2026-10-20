# Changelog

All notable changes to this skill are recorded here. Dates are local (Asia/Shanghai).

## 1.0.1 — 2026-10-20

First public release. The skill is distilled from two delivered films (84 s Riemann, 180 s group
theory) and made portable:

### Added

- `SKILL.md` — the film shape, the five traps, the mix workflow, the master and the delivery checklist.
- `references/abc-and-score.md` — what the ABC parser actually reads (`D4` is length 4, not octave 4),
  the voice roster, dynamics and the scene-mark contract.
- `references/mix-and-master.md` — how to read the probes, the six layers that produced "thump",
  the limiter recipe and the −14 LUFS / −1 dBTP targets.
- `examples/riemann-film.md`, `examples/group-theory-film.md` — structure tables, measured numbers,
  what the viewer rejected and why.
- `scripts/` — `probe-score`, `probe-loud`, `probe-band`, `probe-pulse`, `set-score`, `mux-audio`.
- `demo/riemann-lite/` — a runnable 25 s film with its score, treatment and measured output.

### Changed for public use

- The probes no longer hard-code a machine path: they resolve `huashu-motion/cli` from `OM_CLI`, a
  local `node_modules`, or the usual `~/.claude`, `~/.codex`, `~/.dsh` skill folders.
- The probes read WAV directly (`scripts/lib/wav.mjs`) instead of importing the engine's audio module.
- `probe-pulse` folds by whole 25 ms cells; the previous float phase calculation could leave bins
  empty and print `-Infinity`.
- `probe-pulse` anchors phase 0 to `t = 0` (the score's first downbeat), not to the analysis window
  start; a window that began mid-bar used to shift every reported phase.
