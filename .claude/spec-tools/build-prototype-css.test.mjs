// build-prototype-css.test.mjs — run: node .claude/spec-tools/build-prototype-css.test.mjs
import { extractTheme, extractRootVars } from './build-prototype-css.mjs';
import assert from 'node:assert';

const css = 'x{}\n@theme {\n  --color-brand: #123456;\n}\ny{}';
const t = extractTheme(css);
assert.ok(t.includes('--color-brand: #123456'), 'keeps token');
assert.ok(t.trim().startsWith('@theme'), 'is a @theme block');

// :root and .dark, including when nested inside @layer base { … }
const layered = '@layer base {\n  :root {\n    --background: 0 0% 100%;\n  }\n  .dark {\n    --background: 240 10% 4%;\n  }\n}';
const vars = extractRootVars(layered);
assert.ok(vars.includes(':root'), 'captures :root (even nested in @layer)');
assert.ok(vars.includes('.dark'), 'captures .dark');
assert.ok(vars.includes('--background'), 'keeps var declarations');

console.log('theme + root-vars extract ok');
