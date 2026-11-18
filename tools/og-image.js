'use strict';

/**
 * Share image (og:image, 1200 × 630): the last scene of the story (the plant as
 * a map of projects), as a visitor sees it, without navigation, step dots,
 * skip link or buttons.
 *
 * Usage: npm run build && npm run og   → og.png (served at https://andersein.com/og.png)
 * Needs Playwright with Chromium installed.
 */

const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const SCENE = process.argv[2] === undefined ? -1 : Number(process.argv[2]); // -1 = last scene
const OUTPUT = path.join(ROOT, process.argv[3] || 'og.png');

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`file://${path.join(ROOT, 'index.html')}`);
  await page.addStyleTag({ content: 'header nav, .steps, .skip, .hint, .cap .btn { visibility: hidden !important; }' });
  await page.evaluate((index) => {
    const story = document.getElementById('dato');
    const span = story.offsetHeight - innerHeight;
    const last = document.querySelectorAll('.cap').length - 1;
    const scene = index < 0 ? last : index;
    scrollTo({ top: story.offsetTop + span * (scene / last), behavior: 'instant' });
  }, SCENE);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: OUTPUT });
  await browser.close();
  console.log(`${path.relative(ROOT, OUTPUT)} written`);
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
