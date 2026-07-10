#!/usr/bin/env node
// Verifies key parity and placeholder parity across messages/*.json locales.
// Source of truth: en.json. Exits 1 on any mismatch.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(__dirname, '..', 'messages');
const SOURCE = 'en';
const TARGETS = ['es', 'de', 'fr', 'ru'];

function load(locale) {
  const path = join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = v;
    }
  }
  return out;
}

function placeholders(str) {
  if (typeof str !== 'string') return new Set();
  const matches = str.match(/\{[a-zA-Z_][a-zA-Z0-9_]*\}/g) || [];
  return new Set(matches);
}

function diffSets(a, b) {
  const onlyA = [...a].filter((x) => !b.has(x));
  const onlyB = [...b].filter((x) => !a.has(x));
  return { onlyA, onlyB };
}

const source = flatten(load(SOURCE));
const sourceKeys = new Set(Object.keys(source));

let failed = false;

for (const locale of TARGETS) {
  const target = flatten(load(locale));
  const targetKeys = new Set(Object.keys(target));

  // Key parity
  const { onlyA: missing, onlyB: extra } = diffSets(sourceKeys, targetKeys);
  if (missing.length || extra.length) {
    failed = true;
    console.error(`[${locale}] key parity mismatch:`);
    if (missing.length) console.error(`  missing: ${missing.join(', ')}`);
    if (extra.length) console.error(`  extra:   ${extra.join(', ')}`);
  }

  // Placeholder parity (only for keys present in both)
  for (const key of sourceKeys) {
    if (!targetKeys.has(key)) continue;
    const srcPh = placeholders(source[key]);
    const tgtPh = placeholders(target[key]);
    const { onlyA: srcOnly, onlyB: tgtOnly } = diffSets(srcPh, tgtPh);
    if (srcOnly.length || tgtOnly.length) {
      failed = true;
      console.error(`[${locale}] placeholder mismatch at "${key}":`);
      if (srcOnly.length) console.error(`  missing in target: ${srcOnly.join(', ')}`);
      if (tgtOnly.length) console.error(`  extra in target:   ${tgtOnly.join(', ')}`);
    }
  }
}

if (failed) {
  console.error('\nTranslation check FAILED');
  process.exit(1);
}
console.log('Translation check passed (key + placeholder parity across locales).');