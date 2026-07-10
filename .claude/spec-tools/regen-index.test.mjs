// regen-index.test.mjs — run with: node .claude/spec-tools/regen-index.test.mjs
import { buildIndex } from './regen-index.mjs';
import assert from 'node:assert';

const fixture = {
  'specs/raw/platform/search/README.md': '---\nproduct: platform\nfeature: search\nflow: new\ncreated: 2026-06-09\n---\n',
  'specs/ready/admin/users/README.md': '---\nproduct: admin\nfeature: users\nflow: new\ncreated: 2026-06-01\n---\n',
};
const md = buildIndex(fixture);
assert.ok(md.includes('## platform'), 'has platform group');
assert.ok(/search\s*\|\s*raw\s*\|\s*new/.test(md), 'search row with zone raw');
assert.ok(/users\s*\|\s*ready/.test(md), 'users row with zone ready');
assert.ok(md.startsWith('<!-- AUTO-GENERATED'), 'has auto-gen header');
console.log('regen-index tests passed');
