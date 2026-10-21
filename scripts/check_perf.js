#!/usr/bin/env node
/**
 * scripts/check_perf.js
 * Asserts performance budget rules (S4-04):
 * 1. All external <script src="..."> tags must include `defer`
 * 2. All Google Fonts URLs must include `&display=swap`
 * 3. Hero images must be eager and have fetchpriority="high"
 * 4. Image assets within the responsive pipeline must be within budget (< 150 KB for responsive WebP/AVIF)
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlFiles = [
  ...fs.readdirSync(root).filter(f => f.endsWith('.html') && !f.startsWith('test_')).map(f => path.join(root, f)),
  ...fs.readdirSync(path.join(root, 'ou-acheter')).filter(f => f.endsWith('.html')).map(f => path.join(root, 'ou-acheter', f))
];

const errors = [];

for (const filePath of htmlFiles) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Script defer check
  const scriptRegex = /<script\s+([^>]*src=[^>]*)>/gi;
  let match;
  while ((match = scriptRegex.exec(content)) !== null) {
    const attrs = match[1];
    if (!/\bdefer\b/i.test(attrs)) {
      errors.push(`${rel}: script tag missing defer attribute: <script ${attrs}>`);
    }
  }

  // 2. Google Fonts display=swap check
  const fontRegex = /<link\s+[^>]*href=["'](https:\/\/fonts\.googleapis\.com\/css2[^"']*)["'][^>]*>/gi;
  while ((match = fontRegex.exec(content)) !== null) {
    const url = match[1];
    if (!url.includes('display=swap')) {
      errors.push(`${rel}: Google Fonts URL missing display=swap: ${url}`);
    }
  }
}

// 3. Hero images check
const heroChecks = [
  { file: 'brands.html', pattern: /<img[^>]*src="[^"]*(theros-pro-slim|theros_brand_page|brand-hero-theros)[^"]*"[^>]*>/i }
];

for (const hc of heroChecks) {
  const p = path.join(root, hc.file);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    const imgMatch = content.match(hc.pattern);
    if (imgMatch) {
      const tag = imgMatch[0];
      if (/loading=["']lazy["']/i.test(tag)) {
        errors.push(`${hc.file}: hero image should not have loading="lazy": ${tag}`);
      }
      if (!/fetchpriority=["']high["']/i.test(tag)) {
        errors.push(`${hc.file}: hero image should have fetchpriority="high": ${tag}`);
      }
    } else {
      errors.push(`${hc.file}: could not find expected hero image`);
    }
  }
}

// 4. Image budget check (< 150 KB for pipeline WebP/AVIF)
const imgDir = path.join(root, 'assets', 'img');
if (fs.existsSync(imgDir)) {
  const imgs = fs.readdirSync(imgDir).filter(f => f.endsWith('.webp') || f.endsWith('.avif'));
  for (const img of imgs) {
    const stat = fs.statSync(path.join(imgDir, img));
    if (stat.size > 150 * 1024) {
      errors.push(`assets/img/${img} exceeds 150 KB budget (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }
}

if (errors.length > 0) {
  console.error(`✗ check_perf.js failed with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('✓ check_perf.js: all performance budget and script defer checks passed');
  process.exit(0);
}
