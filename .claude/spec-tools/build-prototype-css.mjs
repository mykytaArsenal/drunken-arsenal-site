import fs from 'node:fs';

// Extract top-level `@theme { … }` blocks from a Tailwind v4 globals.css so they can be
// inlined into a prototype's <style type="text/tailwindcss"> for faithful tokens.
export function extractTheme(css) {
  const blocks = [];
  const re = /@theme[^{]*\{[\s\S]*?\n\}/g;
  let m;
  while ((m = re.exec(css))) blocks.push(m[0]);
  return blocks.join('\n\n');
}

// @theme tokens reference CSS custom properties (e.g. hsl(var(--background))) that are declared
// in :root / .dark blocks. Extract those too so the prototype renders real colors. Returns the
// matching top-level rule blocks (`:root {…}`, `.dark {…}`) joined.
export function extractRootVars(css) {
  const blocks = [];
  // Match :root / .dark blocks at the start of a line (handles nesting inside @layer base).
  const re = /^[ \t]*(:root|\.dark)\b[^{]*\{[\s\S]*?\n[ \t]*\}/gm;
  let m;
  while ((m = re.exec(css))) blocks.push(m[0].trim());
  return blocks.join('\n\n');
}

export function extractFromFile(p) {
  return extractTheme(fs.readFileSync(p, 'utf8'));
}

// CLI: node build-prototype-css.mjs <path-to-globals.css>
// Prints the @theme block(s) followed by the :root/.dark var block(s), separated by a marker
// comment so the prototype generator can place @theme in <style type="text/tailwindcss"> and the
// var blocks in a plain <style>.
if (import.meta.url === `file://${process.argv[1]}`) {
  const p = process.argv[2];
  if (!p) {
    console.error('usage: node build-prototype-css.mjs <globals.css>');
    process.exit(1);
  }
  const css = fs.readFileSync(p, 'utf8');
  process.stdout.write(extractTheme(css));
  process.stdout.write('\n\n/* === ROOT VARS (plain <style>) === */\n\n');
  process.stdout.write(extractRootVars(css));
}
