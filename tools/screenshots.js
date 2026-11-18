'use strict';

/**
 * Screenshots of every scene of the story, on desktop and on a phone, to
 * review changes before publishing.
 *
 *   npm run screenshots                 → build/screenshots/
 *   node tools/screenshots.js page.html out/
 *
 * Needs a local Chrome or Chromium (CHROME_PATH overrides the default path).
 */

const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..');
const page = path.resolve(process.argv[2] || path.join(ROOT, 'index.html'));
const outDir = path.resolve(process.argv[3] || path.join(ROOT, 'build', 'screenshots'));
const executablePath = process.env.CHROME_PATH || '/usr/bin/google-chrome';

const viewports = [
  { name: 'desktop', width: 1366, height: 800, isMobile: false },
  { name: 'mobile', width: 390, height: 800, isMobile: true },
];

async function capture() {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ executablePath });

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.isMobile,
    });
    const tab = await context.newPage();
    const errors = [];
    tab.on('pageerror', (error) => errors.push(error.message));
    await tab.goto(`file://${page}`);
    await tab.waitForTimeout(600);

    const sceneCount = await tab.evaluate(() => document.querySelectorAll('.cap').length);
    for (let scene = 0; scene < sceneCount; scene++) {
      await tab.evaluate((index) => {
        const story = document.getElementById('dato');
        const span = story.offsetHeight - innerHeight;
        const last = document.querySelectorAll('.cap').length - 1;
        scrollTo({ top: story.offsetTop + span * (index / last), behavior: 'instant' });
      }, scene);
      await tab.waitForTimeout(700);
      await tab.screenshot({ path: path.join(outDir, `${viewport.name}-${String(scene).padStart(2, '0')}.png`) });
    }

    // the page below the story
    await tab.evaluate(() => document.getElementById('ander').scrollIntoView({ behavior: 'instant' }));
    await tab.waitForTimeout(400);
    await tab.screenshot({ path: path.join(outDir, `${viewport.name}-profile.png`), fullPage: false });

    console.log(`${viewport.name}: ${sceneCount} scenes${errors.length ? `, errors: ${errors.join(' | ')}` : ''}`);
    await context.close();
  }
  await browser.close();
}

capture().catch((error) => {
  console.error(error);
  process.exit(1);
});
