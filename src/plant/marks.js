'use strict';

/**
 * Marker loops: the hand-drawn circle around each piece I have built, with its
 * project number next to it, as if annotated on a whiteboard.
 *
 * Each mark is a badge (the browser switches it on in its scene): the loop is
 * drawn on as the scene arrives and the number appears after it. In the last
 * scene all of them are on at once, so the plant becomes the project map.
 */

const { Sketch } = require('../drawing/sketch');
const { compactNumbers } = require('../drawing/svg');

// center, radii and tilt (degrees) of the loop; tag = angle (degrees) where the number sits.
const marks = {
  '01': { center: [716, 728], radii: [46, 88], tilt: -22, tag: -20 }, // MQTT link arriving at the PC
  '02': { center: [470, 872], radii: [88, 70], tilt: 0, tag: -40 }, // containers
  '03': { center: [665, 1205], radii: [152, 108], tilt: 0, tag: -35 }, // vision result
  '04': { center: [600, 1560], radii: [74, 66], tilt: 0, tag: 215 }, // UNS hub
  '05': { center: [262, 1574], radii: [78, 72], tilt: 0, tag: -45 }, // PLC
  '06': { center: [1040, 1574], radii: [166, 100], tilt: 0, tag: 150 }, // rule engine
  '07': { center: [612, 396], radii: [142, 96], tilt: -6, tag: 35 }, // robot arm and valve
  '08': { center: [600, 1916], radii: [228, 152], tilt: 0, tag: -30 }, // dashboard
};

const TAG_RADIUS = 17;
const OVERSHOOT = 0.38; // a marker loop never closes exactly where it started

const rad = (deg) => (deg * Math.PI) / 180;

function pointOnLoop([cx, cy], [rx, ry], tilt, angle, scale = 1) {
  const x = rx * scale * Math.cos(angle);
  const y = ry * scale * Math.sin(angle);
  const t = rad(tilt);
  return [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
}

function drawMark(number, { center, radii, tilt, tag }, seed) {
  const loop = new Sketch({ seed });
  const { accent, background } = loop.colors;

  // One continuous stroke, slightly wobbly, starting near the tag.
  const start = rad(tag) + 0.5;
  const steps = 26;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const angle = start + ((2 * Math.PI + OVERSHOOT) * i) / steps;
    const wobble = 1 + (loop.random() - 0.5) * 0.06 + (i / steps) * 0.05;
    points.push(pointOnLoop(center, radii, tilt, angle, wobble));
  }
  loop.curve(points, { stroke: accent, strokeWidth: 2.2, roughness: 0.4, disableMultiStroke: true }, 'class="loop" pathLength="1"');

  // Number tag just outside the loop, joined to it by a short stroke.
  const tagSketch = new Sketch({ seed: seed + 100 });
  const edge = pointOnLoop(center, radii, tilt, rad(tag), 1.04);
  const [tx, ty] = pointOnLoop(center, radii, tilt, rad(tag), 1);
  const dx = edge[0] - tx;
  const dy = edge[1] - ty;
  const d = Math.hypot(dx, dy) || 1;
  const reach = TAG_RADIUS + 16;
  const tagCenter = [edge[0] + (dx / d) * reach, edge[1] + (dy / d) * reach];
  tagSketch.line(edge[0], edge[1], tagCenter[0] - (dx / d) * TAG_RADIUS, tagCenter[1] - (dy / d) * TAG_RADIUS, { stroke: accent, strokeWidth: 2, roughness: 0.4 });
  tagSketch.circle(tagCenter[0], tagCenter[1], TAG_RADIUS * 2, { stroke: accent, width: 2, fill: background, passes: 2, wobble: 0.4 });
  tagSketch.raw(`<text class="t-mark" x="${tagCenter[0].toFixed(1)}" y="${(tagCenter[1] + 6).toFixed(1)}" text-anchor="middle">${number}</text>`);

  return compactNumbers(
    `<g class="badge mark" id="m-${number}">${loop.strokeMarkup()}` +
      `<g class="tag">${tagSketch.strokeMarkup()}</g></g>`,
  );
}

function drawMarks() {
  return Object.entries(marks)
    .map(([number, mark], i) => drawMark(number, mark, 61 + i))
    .join('');
}

module.exports = { drawMarks, marks };
