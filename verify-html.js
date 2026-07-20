#!/usr/bin/env node
/*
 * verify-html.js — sitewide HTML sanity check.
 *
 * Purpose: catch two whole-repo P0 regression classes at push time (before a
 * broken file lands on production and breaks a calculator or leaks a raw
 * generator placeholder to end users):
 *
 *   1. Un-rendered template placeholders in emitted HTML.
 *      Signature we've seen: `const FPL={"fpl_table" if slug != "alaska" else "fpl_alaska"};`
 *      on 50 medicaid pages (fixed 2026-07-19 evening). Also catches Jinja
 *      `{% if %}` / mustache `{{ name }}` / EJS `<%= x %>` / Python `.format` leaks
 *      in href/src/id/class/alt/title/content attributes.
 *
 *   2. JS SyntaxError in any non-JSON <script> block in any .html file.
 *      Signature we've seen: `You'll` (unescaped apostrophe in single-quoted string),
 *      `Course Count` (space-separated identifier), `const FPL={"x" if slug ...}`
 *      (Python-inline in JS), duplicate `const/let` declarations. Fixes:
 *      2026-05-17 (property-tax dup <script>), 2026-07-11 (34 unit converters),
 *      2026-07-18 (6 investment calcs missing `calculate` on shared calcConfig),
 *      2026-07-19 (52 broken calcs across 3 root causes).
 *
 * Usage:
 *   node verify-html.js               # sweep whole repo, exit non-zero on any hit
 *   node verify-html.js --quiet       # same but only print summary
 *   node verify-html.js path/to/x.html [more.html]  # sweep only listed files
 *
 * Ignores: .git, node_modules, __pycache__. Skips <script type="application/ld+json">
 * (schema JSON legitimately uses {}). Strips HTML comments + JS block/line comments +
 * JS string/template literals before running placeholder patterns, so AUDIT comment
 * blocks and legit `${var}` template literals don't false-alarm.
 *
 * Suggested hook wire-up (once Actions is unblocked and pre-commit hooks are welcome):
 *   .git/hooks/pre-push:  node verify-html.js --quiet || { echo "verify-html.js FAILED"; exit 1; }
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set(['.git', 'node_modules', '__pycache__']);
const args = process.argv.slice(2);
const QUIET = args.includes('--quiet');
const targets = args.filter(a => !a.startsWith('--'));

const PLACEHOLDER_HITS = [];
const PARSE_ERRORS = [];

function walk(dir, cb) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else if (entry.isFile() && entry.name.endsWith('.html')) cb(full);
  }
}

function whiteout(src, re) { return src.replace(re, m => m.replace(/[^\n]/g, ' ')); }

function zones(src) {
  const out = [];
  const re = /<(script|style)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let last = 0, m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push({ start: last, end: m.index, kind: 'html' });
    const openLen = m[0].indexOf('>') + 1;
    const bodyStart = m.index + openLen;
    const bodyEnd = m.index + m[0].length - `</${m[1]}>`.length;
    out.push({ start: m.index, end: bodyStart, kind: 'html' });
    out.push({ start: bodyStart, end: bodyEnd, kind: m[1].toLowerCase(), tag: m[0].slice(0, openLen) });
    out.push({ start: bodyEnd, end: m.index + m[0].length, kind: 'html' });
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push({ start: last, end: src.length, kind: 'html' });
  return out;
}

function stripHtmlComments(s) { return whiteout(s, /<!--[\s\S]*?-->/g); }
function stripCssComments(s) { return whiteout(s, /\/\*[\s\S]*?\*\//g); }
function stripJsCommentsAndStrings(s) {
  let out = whiteout(s, /\/\*[\s\S]*?\*\//g);
  out = whiteout(out, /\/\/[^\n]*/g);
  out = whiteout(out, /`(?:\\.|[^\\`])*`/g);
  out = whiteout(out, /"(?:\\.|[^"\\])*"/g);
  out = whiteout(out, /'(?:\\.|[^'\\])*'/g);
  return out;
}
function isJsonLd(tag) { return /type\s*=\s*["']application\/(?:ld\+json|json)["']/i.test(tag || ''); }

const HTML_PATTERNS = [
  { name: 'jinja-block',    re: /\{%\s*(if|for|endif|endfor|include|extends|block|endblock|elif|else)\b/g },
  { name: 'mustache-var',   re: /\{\{\s*[a-zA-Z_][\w.]*\s*(?:\|[^}]*)?\}\}/g },
  { name: 'ejs-erb',        re: /<%[=%-]?[\s\S]*?%>/g },
  { name: 'py-format-attr', re: /\b(?:href|src|id|class|alt|title|content)\s*=\s*["'][^"']*\{[a-z_][\w]*\}[^"']*["']/g },
];
const SCRIPT_PATTERNS = [
  { name: 'py-inline-if', re: /\{\s*["'][\w_]+["']\s+if\s+[\w_]+/g },
  { name: 'jinja-block',  re: /\{%\s*(if|for|endif|endfor|include|extends|block|endblock|elif|else)\b/g },
  { name: 'mustache-var', re: /\{\{\s*[a-zA-Z_][\w.]*\s*(?:\|[^}]*)?\}\}/g },
  { name: 'py-fstring',   re: /\bf["']\{[a-zA-Z_]/g },
  { name: 'ejs-erb',      re: /<%[=%-]?[\s\S]*?%>/g },
];
const STYLE_PATTERNS = [
  { name: 'jinja-block',  re: /\{%\s*(if|for|endif|endfor)\b/g },
  { name: 'mustache-var', re: /\{\{\s*[a-zA-Z_][\w.]*\s*\}\}/g },
];

// Files that are INTENTIONAL generator scaffolds — placeholders inside them are
// expected. They must be blocked from search-engine indexing separately
// (e.g. via robots.txt + <meta name="robots" content="noindex">).
const PLACEHOLDER_ALLOWLIST = new Set(['TEMPLATE.html']);

function checkPlaceholders(full) {
  const src = fs.readFileSync(full, 'utf8');
  const rel = path.relative(ROOT, full);
  if (PLACEHOLDER_ALLOWLIST.has(rel)) return;
  const zs = zones(src);
  let stripped = src;
  for (const z of zs) {
    const seg = src.slice(z.start, z.end);
    let out;
    if (z.kind === 'html') out = stripHtmlComments(seg);
    else if (z.kind === 'style') out = stripCssComments(seg);
    else if (z.kind === 'script') out = isJsonLd(z.tag) ? seg : stripJsCommentsAndStrings(seg);
    else out = seg;
    stripped = stripped.slice(0, z.start) + out + stripped.slice(z.end);
  }
  const origLines = src.split('\n');
  for (const z of zs) {
    if (z.kind === 'script' && isJsonLd(z.tag)) continue;
    const chunk = stripped.slice(z.start, z.end);
    const patterns = z.kind === 'html' ? HTML_PATTERNS : z.kind === 'style' ? STYLE_PATTERNS : SCRIPT_PATTERNS;
    for (const { name, re } of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(chunk)) !== null) {
        const absIdx = z.start + m.index;
        const line = src.slice(0, absIdx).split('\n').length;
        const snippet = (origLines[line - 1] || '').trim().slice(0, 180);
        PLACEHOLDER_HITS.push({ file: rel, line, zone: z.kind, pattern: name, snippet });
      }
    }
  }
}

function checkJsParse(full) {
  const src = fs.readFileSync(full, 'utf8');
  const rel = path.relative(ROOT, full);
  // Strip HTML comments FIRST — AUDIT blocks like "the file has two <script> blocks"
  // legitimately mention <script> in prose, and we don't want to walk into that as if
  // it were real markup. Preserve line offsets by replacing with whitespace.
  const scrubbed = whiteout(src, /<!--[\s\S]*?-->/g);
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m, idx = 0;
  while ((m = re.exec(scrubbed)) !== null) {
    idx++;
    const attrs = m[1] || '';
    const body = m[2] || '';
    // Only parse if type is absent or explicitly a JS variant. JSON-LD, importmap, etc. skip.
    const typeMatch = attrs.match(/type\s*=\s*["']([^"']+)["']/);
    if (typeMatch) {
      const t = typeMatch[1].toLowerCase();
      if (!(t === 'text/javascript' || t === 'application/javascript' || t === 'module')) continue;
    }
    // Skip external scripts (src=...) — no body to parse.
    if (/\bsrc\s*=/i.test(attrs)) continue;
    if (!body.trim()) continue;
    try { new Function(body); }
    catch (e) {
      const line = scrubbed.slice(0, m.index).split('\n').length;
      PARSE_ERRORS.push({ file: rel, scriptIndex: idx, openTagLine: line, error: e.message.slice(0, 200) });
    }
  }
}

function report() {
  const filesWithPlaceholders = new Set(PLACEHOLDER_HITS.map(h => h.file));
  const filesWithParseErrors = new Set(PARSE_ERRORS.map(h => h.file));

  if (!QUIET) {
    if (PLACEHOLDER_HITS.length) {
      const byPattern = {};
      for (const h of PLACEHOLDER_HITS) (byPattern[h.pattern] ||= []).push(h);
      for (const [pat, hits] of Object.entries(byPattern)) {
        console.log(`\n=== PLACEHOLDER: ${pat} (${hits.length} hits) ===`);
        for (const h of hits.slice(0, 40)) console.log(`  [${h.zone}] ${h.file}:${h.line}: ${h.snippet}`);
        if (hits.length > 40) console.log(`  ... +${hits.length - 40} more`);
      }
    }
    if (PARSE_ERRORS.length) {
      console.log(`\n=== JS PARSE ERRORS (${PARSE_ERRORS.length} hits) ===`);
      for (const e of PARSE_ERRORS.slice(0, 40))
        console.log(`  ${e.file} script#${e.scriptIndex} @line ${e.openTagLine}: ${e.error}`);
      if (PARSE_ERRORS.length > 40) console.log(`  ... +${PARSE_ERRORS.length - 40} more`);
    }
  }

  console.log(`\n== verify-html.js summary ==`);
  console.log(`  Placeholder hits: ${PLACEHOLDER_HITS.length} across ${filesWithPlaceholders.size} files`);
  console.log(`  JS parse errors : ${PARSE_ERRORS.length} across ${filesWithParseErrors.size} files`);

  const ok = PLACEHOLDER_HITS.length === 0 && PARSE_ERRORS.length === 0;
  console.log(ok ? '  Status: CLEAN ✓' : '  Status: FAIL ✗');
  process.exit(ok ? 0 : 1);
}

function main() {
  const files = [];
  if (targets.length) {
    for (const t of targets) {
      const abs = path.resolve(ROOT, t);
      if (fs.statSync(abs).isDirectory()) walk(abs, f => files.push(f));
      else files.push(abs);
    }
  } else {
    walk(ROOT, f => files.push(f));
  }
  for (const f of files) {
    try {
      checkPlaceholders(f);
      checkJsParse(f);
    } catch (e) {
      console.error(`ERROR reading ${f}: ${e.message}`);
    }
  }
  report();
}

main();
