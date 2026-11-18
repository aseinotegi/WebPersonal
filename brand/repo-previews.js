'use strict';

/**
 * GitHub social previews (1280 × 640) for the pinned repositories: the image shown
 * when a repository link is shared. Same whiteboard style as the site and the card.
 *
 *   npm run previews   → brand/exports/github-previews/<repo>.png
 *
 * Text on the left, a small drawing of what the repository does on the right.
 */

const fs = require('fs');
const path = require('path');
const { Sketch, DASHED } = require('../src/drawing/sketch');
const icons = require('../src/drawing/icons');
const { palette, fonts } = require('../src/config/site');
const { dotGrid } = require('./common');

const W = 640;
const H = 320;
const SOFT = '#A3B3C9';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Draws icons at their usual size, scaled around their own centre. */
const enlarged = (sk, x, y, scale, draw) => sk.group(`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`, draw);

function label(sk, x, y, text, { size = 8, color = SOFT, anchor = 'middle', weight = 600, font = 'JetBrains Mono' } = {}) {
  sk.raw(
    `<text x="${x}" y="${y}" fill="${color}" font-family="${font}" font-weight="${weight}" font-size="${size}" ` +
      `text-anchor="${anchor}">${esc(text)}</text>`,
  );
}

function hub(sk, x, y, r, text) {
  sk.circle(x, y, r * 2, { stroke: sk.colors.accent, width: 1.6, fill: palette.background, passes: 2, wobble: 0.4 });
  label(sk, x, y + 5, text, { size: 13, color: '#E6EDF7', weight: 800, font: 'Montserrat' });
}

// -- one drawing per repository ----------------------------------------------

const drawings = {
  'industrial-uns-demo'(sk) {
    const c = [480, 165];
    const nodes = { robot: [395, 85], plc: [390, 245], rules: [570, 85], dash: [570, 245] };
    for (const [x, y] of Object.values(nodes)) sk.line(c[0], c[1], x, y, { strokeWidth: 1.1 });
    hub(sk, ...c, 36, 'UNS');
    enlarged(sk, ...nodes.robot, 2.2, () => icons.inspectionRobot(sk, ...nodes.robot, 26));
    enlarged(sk, ...nodes.plc, 2.4, () => icons.plc(sk, ...nodes.plc, 20, 16));
    enlarged(sk, ...nodes.rules, 2.4, () => icons.codeWindow(sk, ...nodes.rules, 24, 17));
    enlarged(sk, ...nodes.dash, 2.2, () => icons.industrialPc(sk, ...nodes.dash, 30, 20));
    label(sk, 395, 128, 'pi-104/presion 6,8', { color: palette.accent });
    label(sk, 390, 283, 'pt-104/presion 6,7');
    label(sk, 570, 128, 'if vision and plc');
    label(sk, 570, 283, 'pico 6,8 → 4,2 bar');
  },

  'poi-vision-inspector'(sk) {
    const robot = [410, 235];
    const gauge = [548, 112];
    sk.line(426, 205, 512, 128, { stroke: sk.colors.accent, strokeWidth: 0.9 }, DASHED);
    sk.line(426, 205, 520, 150, { stroke: sk.colors.accent, strokeWidth: 0.9 }, DASHED);
    enlarged(sk, ...robot, 2.6, () => icons.inspectionRobot(sk, ...robot, 26));
    enlarged(sk, ...gauge, 3.2, () => icons.gauge(sk, ...gauge, 17));
    // the marker loop of the site, around the point of interest
    sk.ellipse(548, 116, 92, 88, { stroke: sk.colors.accent, strokeWidth: 2, roughness: 0.6 });
    label(sk, 548, 58, 'POI · PI-104', { color: palette.accent, size: 8.5 });
    sk.rect(470, 200, 150, 64, { stroke: '#E6EDF7', strokeWidth: 0.9 });
    label(sk, 480, 220, '{"value": 6.8, "unit": "bar",', { anchor: 'start', size: 7.6, color: '#E6EDF7' });
    label(sk, 480, 234, ' "quality": "good",', { anchor: 'start', size: 7.6, color: '#E6EDF7' });
    label(sk, 480, 248, ' "model": "qwen3-vl"}', { anchor: 'start', size: 7.6, color: palette.accent });
    label(sk, 410, 290, 'local · Ollama / Gemini', { size: 7.5 });
  },

  'plc-mqtt-gateway'(sk) {
    const plc = [400, 160];
    sk.line(440, 160, 520, 160, { strokeWidth: 1.2 });
    sk.line(512, 154, 521, 160, { strokeWidth: 1.2 });
    sk.line(512, 166, 521, 160, { strokeWidth: 1.2 });
    enlarged(sk, ...plc, 3.4, () => icons.plc(sk, ...plc, 20, 16));
    hub(sk, 565, 160, 34, 'MQTT');
    label(sk, 480, 150, 'S7 · DB1', { color: palette.accent, size: 8.5 });
    label(sk, 400, 212, 'Siemens S7', { size: 8 });
    const topics = ['pt-104/presion   6,71 bar', 'pt-104/alarma     true', 'xv-104/cerrada    true'];
    topics.forEach((t, i) => label(sk, 520, 225 + i * 14, t, { anchor: 'start', size: 7.6, color: i === 0 ? palette.accent : SOFT }));
    label(sk, 480, 92, 'solo lo que cambia', { size: 8 });
  },

  'robot-fleet-watchdogs'(sk) {
    const watchdog = [480, 92];
    const robots = [[400, 235], [480, 235], [560, 235]];
    for (const [x, y] of robots) sk.line(watchdog[0], watchdog[1] + 26, x, y - 30, { strokeWidth: 0.9 }, DASHED);
    enlarged(sk, ...watchdog, 2.8, () => icons.codeWindow(sk, ...watchdog, 24, 17));
    robots.forEach(([x, y]) => enlarged(sk, x, y, 2, () => icons.inspectionRobot(sk, x, y, 26)));
    const tags = ['misión reanudada', 'ATEX ok', 'batería 18 %'];
    robots.forEach(([x, y], i) => label(sk, x, y + 42, tags[i], { size: 7.6, color: i === 2 ? palette.alarm : SOFT }));
    label(sk, 480, 48, 'watchdog 24/7', { color: palette.accent, size: 8.5 });
  },

  'robot-mission-scheduler-showcase'(sk) {
    const screen = [480, 108];
    enlarged(sk, ...screen, 3.6, () => icons.industrialPc(sk, ...screen, 30, 20));
    const plants = [[395, 250, 'planta 1'], [480, 250, 'planta 2'], [565, 250, 'planta 3']];
    for (const [x, y] of plants) sk.line(screen[0], screen[1] + 38, x, y - 26, { strokeWidth: 0.9 }, DASHED);
    plants.forEach(([x, y, name]) => {
      enlarged(sk, x, y, 1.9, () => icons.inspectionRobot(sk, x, y, 26));
      label(sk, x, y + 40, name, { size: 7.6 });
    });
    label(sk, 480, 50, 'misiones · KPIs · informes', { color: palette.accent, size: 8.5 });
  },

  DGT(sk) {
    // abstract road map with active V16 beacons (amber, like the real ones)
    sk.curve([[365, 70], [420, 120], [470, 150], [540, 170], [625, 230]], { strokeWidth: 2.2, roughness: 0.6 });
    sk.curve([[380, 270], [430, 220], [480, 180], [520, 120], [560, 60]], { strokeWidth: 2.2, roughness: 0.6 });
    sk.curve([[360, 190], [430, 195], [500, 215], [600, 285]], { strokeWidth: 1.2, roughness: 0.8 }, DASHED);
    const beacons = [[430, 127], [512, 133], [585, 203], [455, 202], [540, 236], [395, 245]];
    for (const [x, y] of beacons) {
      sk.raw(`<circle cx="${x}" cy="${y}" r="11" fill="${palette.alarm}" opacity="0.18"/>`);
      sk.raw(`<circle cx="${x}" cy="${y}" r="4.2" fill="${palette.alarm}"/>`);
    }
    label(sk, 575, 120, 'V16 activa', { color: palette.alarm, size: 8 });
    label(sk, 490, 296, 'mapabalizasv16.info', { size: 8, color: palette.accent });
  },
};

const texts = {
  'industrial-uns-demo': {
    eyebrow: 'IIoT · UNIFIED NAMESPACE',
    title: ['Unified Namespace', 'de una planta'],
    body: ['Robot, visión y PLC publican en MQTT.', 'Una regla cruza las fuentes y el robot', 'cierra la válvula. Un comando, sin hardware.'],
  },
  'poi-vision-inspector': {
    eyebrow: 'VISIÓN · IA LOCAL',
    title: ['Inspección por', 'punto de interés'],
    body: ['Un modelo multimodal local o en la nube', 'lee manómetros y extintores en JSON.', 'Sin entrenar, con validación propia.'],
  },
  'plc-mqtt-gateway': {
    eyebrow: 'PLC · IIoT',
    title: ['Pasarela PLC', 'Siemens → MQTT'],
    body: ['Lee los bloques de datos sin tocar el', 'proceso y publica solo lo que cambia.', 'Con PLC simulado para probarla.'],
  },
  'robot-fleet-watchdogs': {
    eyebrow: 'ROBÓTICA · OPERACIÓN 24/7',
    title: ['Watchdogs para', 'flotas de robots'],
    body: ['Reanudan misiones, vigilan presión ATEX', 'y batería, y avisan solo cuando hace falta.', 'Código abierto con simulador de flota.'],
  },
  'robot-mission-scheduler-showcase': {
    eyebrow: 'ROBÓTICA · CASO REAL',
    title: ['Plataforma de misiones', 'para robots'],
    body: ['Planificación y supervisión multiplanta', 'en tiempo real, con KPIs, informes', 'y visión artificial.'],
  },
  DGT: {
    eyebrow: 'DATOS ABIERTOS · EN PRODUCCIÓN',
    title: ['Mapa de', 'balizas V16'],
    body: ['Balizas activas de la DGT en tiempo real,', 'con histórico geoespacial e índice', 'de vulnerabilidad de conductores.'],
  },
};

function preview(repo, seed) {
  const sk = new Sketch({ seed });
  drawings[repo](sk);
  const t = texts[repo];
  const x = 36;

  const mark = new Sketch({ seed: 5 });
  mark.circle(x + 11, 287, 22, { stroke: palette.accent, width: 1.3, passes: 2, wobble: 0.4 });

  const underline = new Sketch({ seed: 3 });
  const uy = 92 + t.title.length * 28 + 2;
  underline.curve([[x, uy], [x + 9, uy - 1.5], [x + 18, uy + 0.5], [x + 27, uy - 1.5], [x + 36, uy], [x + 44, uy - 1.2]],
    { stroke: palette.accent, strokeWidth: 1.4, roughness: 0.3 });

  const title = t.title
    .map((line, i) => `<text x="${x - 1}" y="${100 + i * 28}" fill="#FFFFFF" font-family="Montserrat" font-weight="800" font-size="25">${esc(line)}</text>`)
    .join('');
  const bodyY = uy + 22;
  const body = t.body
    .map((line, i) => `<text x="${x}" y="${bodyY + i * 15}" fill="${SOFT}" font-family="Inter" font-size="10.5">${esc(line)}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${palette.background}"/>
${dotGrid({ toX: W, toY: H, step: 14 })}
<g>${sk.strokeMarkup('\n')}</g>
<text x="${x}" y="62" fill="${palette.accent}" font-family="Inter" font-weight="700" font-size="8.5" letter-spacing="1.6">${esc(t.eyebrow)}</text>
${title}
<g>${underline.strokeMarkup()}</g>
${body}
<g>${mark.strokeMarkup()}</g>
<text x="${x + 11}" y="290" fill="#E6EDF7" font-family="Montserrat" font-weight="800" font-size="8" text-anchor="middle">AS</text>
<text x="${x + 30}" y="284" fill="#E6EDF7" font-family="Inter" font-weight="700" font-size="9">Ander Sein</text>
<text x="${x + 30}" y="296" fill="${SOFT}" font-family="JetBrains Mono" font-size="7.5">github.com/aseinotegi/${esc(repo)}</text>
</svg>`;
}

async function main() {
  const { chromium } = require('playwright-core');
  const root = path.join(__dirname, '..');
  const out = path.join(__dirname, 'exports', 'github-previews');
  fs.mkdirSync(out, { recursive: true });
  const faces = fonts
    .map(([family, file, weight, style]) => {
      // inline, so the page does not depend on file:// access
      const data = fs.readFileSync(path.join(root, 'fonts', `${file}.woff2`)).toString('base64');
      return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${data}) format("woff2");font-weight:${weight};font-style:${style}}`;
    })
    .join('');

  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 640 } });
  const repos = Object.keys(drawings);
  for (const [i, repo] of repos.entries()) {
    const svg = preview(repo, 71 + i);
    await page.setContent(`<html><head><style>${faces}html,body{margin:0;background:${palette.background}}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(out, `${repo}.png`), clip: { x: 0, y: 0, width: 1280, height: 640 } });
    console.log(`${repo}.png`);
  }
  await browser.close();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { preview };
