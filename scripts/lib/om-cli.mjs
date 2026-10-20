// Locate the huashu-motion cli/ folder, so probe-score.mjs can reuse the engine's own ABC parser
// instead of re-implementing it. Order: $OM_CLI, a local node_modules install, common skill folders.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

function looksLikeCli(dir) {
  return Boolean(dir) && fs.existsSync(path.join(dir, 'lib', 'composer.js'));
}

function nodeModulesCandidates() {
  const out = [];
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    out.push(path.join(dir, 'node_modules', 'huashu-motion', 'cli'));
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  return out;
}

function skillCandidates() {
  const home = os.homedir();
  return [
    path.join(home, '.claude', 'skills', 'huashu-motion', 'cli'),
    path.join(home, '.codex', 'skills', 'huashu-motion', 'cli'),
    path.join(home, '.dsh', 'skills', 'huashu-motion', 'cli'),
    path.join(home, '.dsh', 'skills-src', 'huashu-motion', 'cli'),
  ];
}

export function omCliCandidates() {
  const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
  return [
    process.env.OM_CLI,
    path.join(here, '..', 'huashu-motion', 'cli'),
    path.join(here, 'vendor', 'huashu-motion', 'cli'),
    ...nodeModulesCandidates(),
    ...skillCandidates(),
  ].filter(Boolean);
}

export function resolveOmCli() {
  return omCliCandidates().find(looksLikeCli) || null;
}

export async function loadComposer() {
  const dir = resolveOmCli();
  if (!dir) {
    throw new Error(
      'Could not find huashu-motion\'s cli/. Install the huashu-motion skill (https://github.com/alchaincyf/huashu-motion), '
      + 'or point OM_CLI at its cli folder, e.g. OM_CLI=C:\\path\\to\\huashu-motion\\cli',
    );
  }
  return import(pathToFileURL(path.join(dir, 'lib', 'composer.js')).href);
}
