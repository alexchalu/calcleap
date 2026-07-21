#!/usr/bin/env node
/*
 * verify-html.js — sitewide HTML sanity check.
 *
 * Purpose: catch three whole-repo P0 regression classes at push time (before a
 * broken file lands on production and breaks a calculator, leaks a raw
 * generator placeholder to end users, or ships a dead in-page link):
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
 *   3. Broken links: href="/foo.html" where /foo.html does not exist in the
 *      repo, href="#anchor" where #anchor is not defined on the page, and
 *      href="/foo.html#anchor" where either the file or the anchor is missing.
 *      Added 2026-07-21 evening (queue item rrrrrrrrrrrr). Skips external
 *      schemes (http://, https://, mailto:, tel:, sms:, javascript:, data:,
 *      blob:, about:), protocol-relative (//), dynamic JS template literals
 *      (${var}), and empty/bare-# hrefs.
 *
 * Usage:
 *   node verify-html.js               # sweep whole repo, exit non-zero on any hit
 *   node verify-html.js --quiet       # same but only print summary
 *   node verify-html.js --no-links    # skip the link/anchor sweep (faster)
 *   node verify-html.js path/to/x.html [more.html]  # sweep only listed files
 *
 * Ignores: .git, node_modules, __pycache__. Skips <script type="application/ld+json">
 * (schema JSON legitimately uses {}). Strips HTML comments + JS block/line comments +
 * JS string/template literals before running placeholder patterns, so AUDIT comment
 * blocks and legit `${var}` template literals don't false-alarm. For the link
 * sweep, strips script/style bodies AND HTML comments before extracting hrefs
 * so dynamic hrefs constructed in JS and hrefs mentioned in AUDIT prose comments
 * do not false-alarm.
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
const SKIP_LINKS = args.includes('--no-links');
const targets = args.filter(a => !a.startsWith('--'));

const PLACEHOLDER_HITS = [];
const PARSE_ERRORS = [];
const BROKEN_LINKS = [];

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

// --- Broken-link + broken-anchor sweep (queue item rrrrrrrrrrrr) ---
//
// Two data structures built once from the file list:
//   FILE_SET   : Set of repo-relative POSIX paths that exist as regular files.
//                Used to validate href file targets (`/foo.html` or `foo.html`).
//   ANCHOR_MAP : Map<repoRelativeHtmlPath, Set<idOrAnchorName>>.
//                Used to validate fragment targets (`#section-id` or
//                `/foo.html#section-id`).
//
// Rules:
//   - href is stripped of scripts/styles/comments before extraction so dynamic
//     hrefs constructed in JS and hrefs mentioned in AUDIT prose comments do
//     not false-alarm.
//   - Skip external schemes, protocol-relative URLs, dynamic `${...}` strings,
//     empty hrefs, and bare `#` / `#top` placeholders.
//   - Query string is stripped from the file part before existence check.
//   - Directory targets (`foo/`) resolve to `foo/index.html`.
//   - Extensionless targets (`/foo`) resolve to `/foo.html` OR `/foo/index.html`.

const FILE_SET = new Set();
const ANCHOR_MAP = new Map();

const HREF_RE = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const ID_ATTR_RE = /\bid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const A_NAME_RE = /<a\b[^>]*\bname\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

function toPosix(p) { return p.split(path.sep).join('/'); }

function stripScriptsAndStyles(src) {
  let out = whiteout(src, /<script\b[^>]*>[\s\S]*?<\/script>/gi);
  out = whiteout(out, /<style\b[^>]*>[\s\S]*?<\/style>/gi);
  return out;
}

function extractAnchors(src) {
  const anchors = new Set();
  const cleaned = stripScriptsAndStyles(stripHtmlComments(src));
  let m;
  ID_ATTR_RE.lastIndex = 0;
  while ((m = ID_ATTR_RE.exec(cleaned)) !== null) {
    const id = m[1] || m[2];
    if (id) anchors.add(id);
  }
  A_NAME_RE.lastIndex = 0;
  while ((m = A_NAME_RE.exec(cleaned)) !== null) {
    const name = m[1] || m[2];
    if (name) anchors.add(name);
  }
  // Universally-resolvable fragments per HTML spec.
  anchors.add('');       // href="#" scrolls to top
  anchors.add('top');    // href="#top" scrolls to top
  return anchors;
}

function buildLinkIndex(allHtmlFiles) {
  // Index EVERY file in the repo (not just .html) so we can validate hrefs to
  // sitemap.xml, images, .txt, .pdf, .js, .css, etc. Uses one walk with
  // withFileTypes rather than fs.existsSync per candidate — much faster.
  function walkAll(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkAll(full);
      else if (entry.isFile()) FILE_SET.add(toPosix(path.relative(ROOT, full)));
    }
  }
  walkAll(ROOT);

  // Anchor index is scoped to .html files only.
  for (const abs of allHtmlFiles) {
    const rel = toPosix(path.relative(ROOT, abs));
    try {
      const src = fs.readFileSync(abs, 'utf8');
      ANCHOR_MAP.set(rel, extractAnchors(src));
    } catch (_) { /* unreadable file — skip */ }
  }
}

function isSkippedHref(h) {
  if (h === '' || h === '#' || h === '#top') return true;
  // External schemes / protocol-relative / dynamic JS interpolation
  if (/^(?:https?:|mailto:|tel:|sms:|javascript:|data:|blob:|about:|ftp:|file:)/i.test(h)) return true;
  if (/^\/\//.test(h)) return true;                 // protocol-relative
  if (/\$\{[^}]*\}/.test(h)) return true;           // dynamic JS template literal
  if (/^\{\{/.test(h) || /^\{%/.test(h)) return true; // template placeholder (caught by checkPlaceholders)
  return false;
}

function resolveTarget(fromRelHtml, href) {
  // Returns { filePart, fragment } as repo-relative POSIX paths.
  // filePart is '' if the href is fragment-only (same-page anchor).
  let raw = href;
  const hashIdx = raw.indexOf('#');
  let fragment = null;
  if (hashIdx >= 0) {
    fragment = raw.slice(hashIdx + 1);
    raw = raw.slice(0, hashIdx);
  }
  // Strip query string from the file part.
  const qIdx = raw.indexOf('?');
  if (qIdx >= 0) raw = raw.slice(0, qIdx);

  let filePart = '';
  if (raw === '') {
    filePart = fromRelHtml; // fragment-only link resolves to same file
  } else if (raw.startsWith('/')) {
    filePart = raw.slice(1); // repo-root-relative
  } else {
    const fromDir = path.posix.dirname(fromRelHtml);
    filePart = path.posix.normalize(path.posix.join(fromDir, raw));
    if (filePart.startsWith('./')) filePart = filePart.slice(2);
  }
  // Decode %20 etc. so hrefs to files with spaces or non-ASCII resolve.
  try { filePart = decodeURI(filePart); } catch (_) { /* leave as-is */ }
  return { filePart, fragment };
}

function resolveFileTarget(filePart) {
  // Returns the canonical file that a href file part actually serves, or null
  // if nothing exists. GitHub Pages semantics:
  //   /foo/       → /foo/index.html
  //   /foo        → /foo.html OR /foo/index.html (either works)
  //   /foo.html   → /foo.html exact
  if (filePart === '' || filePart === '/') filePart = 'index.html';
  if (filePart.endsWith('/')) {
    const idx = filePart + 'index.html';
    return FILE_SET.has(idx) ? idx : null;
  }
  if (FILE_SET.has(filePart)) return filePart;
  // Extensionless: try .html and /index.html
  if (!/\.[a-z0-9]{1,6}$/i.test(filePart)) {
    if (FILE_SET.has(filePart + '.html')) return filePart + '.html';
    if (FILE_SET.has(filePart + '/index.html')) return filePart + '/index.html';
  }
  return null;
}

function checkLinks(full) {
  const src = fs.readFileSync(full, 'utf8');
  const rel = toPosix(path.relative(ROOT, full));
  const scrubbed = stripScriptsAndStyles(stripHtmlComments(src));
  const origLines = src.split('\n');
  HREF_RE.lastIndex = 0;
  let m;
  while ((m = HREF_RE.exec(scrubbed)) !== null) {
    const href = (m[1] || m[2] || '').trim();
    if (isSkippedHref(href)) continue;
    const { filePart, fragment } = resolveTarget(rel, href);
    const line = scrubbed.slice(0, m.index).split('\n').length;
    const snippet = (origLines[line - 1] || '').trim().slice(0, 180);

    let resolved = null;
    if (filePart) {
      resolved = resolveFileTarget(filePart);
      if (!resolved) {
        BROKEN_LINKS.push({ file: rel, line, kind: 'missing-file', href, target: filePart, snippet });
        continue;
      }
    }
    if (fragment !== null && fragment !== '' && fragment !== 'top') {
      const targetFile = resolved || rel;
      // Only check fragments on .html targets — no reason to look for anchors
      // in .pdf / .txt / .xml / images.
      if (!targetFile.endsWith('.html')) continue;
      const anchors = ANCHOR_MAP.get(targetFile);
      if (!anchors) continue; // target not indexed (e.g. anchor-only, no HTML index)
      // Decode fragment (percent-escapes and URL-safe id fragments).
      let frag = fragment;
      try { frag = decodeURIComponent(frag); } catch (_) { /* leave */ }
      if (!anchors.has(frag)) {
        BROKEN_LINKS.push({ file: rel, line, kind: 'missing-anchor', href, target: targetFile + '#' + frag, snippet });
      }
    }
  }
}

function report() {
  const filesWithPlaceholders = new Set(PLACEHOLDER_HITS.map(h => h.file));
  const filesWithParseErrors = new Set(PARSE_ERRORS.map(h => h.file));
  const filesWithBrokenLinks = new Set(BROKEN_LINKS.map(h => h.file));

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
    if (BROKEN_LINKS.length) {
      const byKind = {};
      for (const h of BROKEN_LINKS) (byKind[h.kind] ||= []).push(h);
      for (const [kind, hits] of Object.entries(byKind)) {
        console.log(`\n=== BROKEN LINK: ${kind} (${hits.length} hits) ===`);
        for (const h of hits.slice(0, 40)) console.log(`  ${h.file}:${h.line}  href=${h.href}  → ${h.target}`);
        if (hits.length > 40) console.log(`  ... +${hits.length - 40} more`);
      }
    }
  }

  console.log(`\n== verify-html.js summary ==`);
  console.log(`  Placeholder hits: ${PLACEHOLDER_HITS.length} across ${filesWithPlaceholders.size} files`);
  console.log(`  JS parse errors : ${PARSE_ERRORS.length} across ${filesWithParseErrors.size} files`);
  console.log(`  Broken links    : ${BROKEN_LINKS.length} across ${filesWithBrokenLinks.size} files${SKIP_LINKS ? ' (SKIPPED via --no-links)' : ''}`);

  const ok = PLACEHOLDER_HITS.length === 0 && PARSE_ERRORS.length === 0 && BROKEN_LINKS.length === 0;
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
  // Link sweep needs a repo-wide file index + anchor index built once.
  if (!SKIP_LINKS) buildLinkIndex(files);
  for (const f of files) {
    try {
      checkPlaceholders(f);
      checkJsParse(f);
      if (!SKIP_LINKS) checkLinks(f);
    } catch (e) {
      console.error(`ERROR reading ${f}: ${e.message}`);
    }
  }
  report();
}

main();
