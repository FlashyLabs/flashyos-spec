// The shell's honesty, asserted rather than promised.
//
// This repository is a licensed, documented SHELL: the format packages (src/,
// schema/, profiles/, a package.json and its test harness) are not carried out
// of the monorepo yet. The docs are allowed to describe that future — but a
// command shown as runnable *today* against a file that does not exist is the
// docs lying about what runs, which is exactly the drift this repository was
// built to refuse elsewhere.
//
// The rule enforced here: in every documentation file below, any fenced code
// block that is NOT explicitly marked planned must reference only local paths
// (and, for `npm` commands, a package.json) that actually exist on disk. A
// block that demonstrates the planned workflow is exempt, and is exempt only
// because it carries an `<!-- planned -->` marker immediately before its fence
// — so marking a block planned is a deliberate, greppable act, never a default.
//
// node --test, node: builtins only. No install, no network, no dependency.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// The docs that present commands to a reader. SECURITY.md and SUPPORT.md carry
// no runnable command blocks, so they are deliberately out of scope; adding a
// command block to one of them without adding it here is a gap, but a smaller
// one than a false pass would be.
const DOCS = ['README.md', 'CONTRIBUTING.md', 'MESH.md'];

// Shell words that are commands or builtins, never a path we could check.
const KNOWN_WORDS = new Set([
  'git', 'clone', 'ls', 'cat', 'jq', 'node', 'npx', 'tsx', 'cd', 'echo',
  'grep', 'test', 'set', 'for', 'in', 'do', 'done', 'then', 'fi', 'if',
  'else', 'mkdir', 'rm', 'cp', 'mv', 'sudo', 'sh', 'bash', 'export', 'env',
  'true', 'false', 'exit', 'validate', 'emit', 'check', 'observe',
]);

// npm subcommands that need a package.json + its scripts to be runnable.
const NPM_NEEDS_MANIFEST = new Set(['ci', 'install', 'test', 'run', 'start', 'build']);

function parseBlocks(md) {
  const lines = md.split('\n');
  const blocks = [];
  let lastMeaningful = '';
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(/^```(\w*)\s*$/);
    if (open) {
      const body = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        body.push(lines[i]);
        i++;
      }
      blocks.push({
        lang: open[1],
        body,
        planned: /<!--\s*planned/i.test(lastMeaningful),
      });
      continue;
    }
    if (lines[i].trim() !== '') lastMeaningful = lines[i].trim();
  }
  return blocks;
}

function referenced(body) {
  const paths = new Set();
  let needsManifest = false;
  for (const raw of body) {
    const t = raw.trim();
    if (t === '' || t.startsWith('#')) continue; // blank or comment/output line
    // Drop quoted substrings (jq expressions, quoted globs) before tokenizing.
    const line = raw.replace(/'[^']*'/g, ' ').replace(/"[^"]*"/g, ' ');
    const tokens = line.split(/[\s;|&]+/).filter(Boolean);
    for (let k = 0; k < tokens.length; k++) {
      const tok = tokens[k];
      if (tok === 'npm') {
        if (NPM_NEEDS_MANIFEST.has(tokens[k + 1] || '')) needsManifest = true;
        continue;
      }
      if (tok.includes('://')) continue;   // URL
      if (tok.startsWith('-')) continue;    // flag
      if (tok.startsWith('@')) continue;    // scoped npm package (npx @scope/x)
      if (tok.startsWith('<') && tok.endsWith('>')) continue; // <placeholder>
      if (KNOWN_WORDS.has(tok)) continue;
      const looksLikePath = tok.includes('/') || /\.(json|mjs|js|ts|md|ya?ml)$/.test(tok);
      if (looksLikePath) paths.add(tok.replace(/\/+$/, ''));
    }
  }
  return { paths: [...paths], needsManifest };
}

function pathPresent(p) {
  const abs = join(ROOT, p);
  if (!p.includes('*')) return existsSync(abs);
  // A glob is present if it matches at least one file; fall back to its
  // literal prefix directory if globSync is unavailable in this runtime.
  try {
    return globSync(abs).length > 0;
  } catch {
    const prefix = p.slice(0, p.indexOf('*'));
    return existsSync(join(ROOT, dirname(prefix || '.')));
  }
}

// --- The assertions -------------------------------------------------------

test('every documentation file exists and carries code blocks (the walk found something)', () => {
  let total = 0;
  for (const doc of DOCS) {
    const file = join(ROOT, doc);
    assert.ok(existsSync(file), `${doc} is missing`);
    const blocks = parseBlocks(readFileSync(file, 'utf8'));
    total += blocks.length;
  }
  // Guard against a parser that silently resolves nothing and reads as a pass.
  assert.ok(total > 0, 'no fenced code blocks were parsed from any doc — the walk resolved nothing');
});

test('at least one block is marked planned (the planned-marker parsing works)', () => {
  let planned = 0;
  for (const doc of DOCS) {
    planned += parseBlocks(readFileSync(join(ROOT, doc), 'utf8')).filter((b) => b.planned).length;
  }
  // These docs describe a future the shell cannot run yet; if none is marked
  // planned, either the marker convention broke or a planned block lost its tag.
  assert.ok(planned > 0, 'no code block is marked <!-- planned --> — the exemption convention is not wired');
});

test('no unmarked code block references a file or manifest that is absent', () => {
  const lies = [];
  for (const doc of DOCS) {
    const blocks = parseBlocks(readFileSync(join(ROOT, doc), 'utf8'));
    for (const block of blocks) {
      if (block.planned) continue;
      const { paths, needsManifest } = referenced(block.body);
      if (needsManifest && !existsSync(join(ROOT, 'package.json'))) {
        lies.push(`${doc}: an unmarked block runs an npm command but package.json is absent`);
      }
      for (const p of paths) {
        if (!pathPresent(p)) {
          lies.push(`${doc}: an unmarked block references '${p}', which does not exist`);
        }
      }
    }
  }
  assert.deepEqual(lies, [], `docs present unrunnable commands as runnable:\n  ${lies.join('\n  ')}`);
});

test('the LICENSE is Apache-2.0, holder Flashy Labs (the register is the authority)', () => {
  const license = readFileSync(join(ROOT, 'LICENSE'), 'utf8');
  assert.match(license, /Apache License/, 'LICENSE is not the Apache License text');
  assert.match(license, /Copyright 2026 Flashy Labs/, 'LICENSE does not name the copyright holder');
});
