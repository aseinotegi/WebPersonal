'use strict';

/**
 * Business card, back: a hub with the eight things I work with around it.
 * The lines entering on the left continue the ones leaving the front.
 * Labels are set in Canva on the masked areas; their boxes are printed by the
 * build so they can be placed precisely.
 */

const { Sketch, DASHED } = require('../src/drawing/sketch');
const icons = require('../src/drawing/icons');
const { dotGrid } = require('./common');

const WIDTH = 336;
const HEIGHT = 192;
const EXPORT_SCALE = 4;

const HUB = [168, 82];
const HUB_RADIUS = 30;

const nodes = {
  plc: [58, 36],
  docker: [122, 25],
  sensor: [36, 95],
  vision: [100, 128],
  robot: [220, 23],
  ai: [292, 44],
  amr: [284, 104],
  python: [240, 128],
};

const labelPositions = {
  PLC: [58, 47],
  DOCKER: [122, 37],
  SENSORES: [36, 109],
  'VISIÓN': [100, 141],
  'ROBÓTICA': [220, 41],
  IA: [292, 57],
  'ROBOT AUTÓNOMO': [284, 120],
  PYTHON: [240, 140],
};

const protocolsOnSpokes = [['plc', 'PROFINET'], ['sensor', 'MODBUS'], ['amr', 'ROS 2'], ['python', 'REST']];

function drawCardBack() {
  const sk = new Sketch({ seed: 21 });
  const { accent, background } = sk.colors;

  // entries from the front, at the same heights as its exits
  sk.line(-4, 12, 47, 31, { strokeWidth: 0.75 });
  sk.line(-4, 64, 28, 89, { strokeWidth: 0.75 });
  sk.line(-4, 180, 88, 131, { strokeWidth: 0.7, roughness: 1.2 }, DASHED);
  // exits on the right
  sk.line(300, 40, 340, 26, { strokeWidth: 0.6 }, DASHED);
  sk.line(297, 108, 340, 150, { strokeWidth: 0.6 }, DASHED);

  // spokes from the hub to every node
  for (const [x, y] of Object.values(nodes)) {
    const dx = x - HUB[0];
    const dy = y - HUB[1];
    const d = Math.hypot(dx, dy);
    sk.line(HUB[0] + (dx / d) * (HUB_RADIUS + 3), HUB[1] + (dy / d) * (HUB_RADIUS + 3), x, y, { strokeWidth: 0.75 });
  }
  // dashed mesh between neighbours
  for (const [a, b] of [['plc', 'docker'], ['plc', 'sensor'], ['sensor', 'vision'], ['robot', 'ai'], ['amr', 'python'], ['ai', 'amr']]) {
    sk.line(...nodes[a], ...nodes[b], { strokeWidth: 0.55 }, DASHED);
  }

  // hub
  sk.arc(HUB[0], HUB[1], 82, 82, -0.3, 1.9, { stroke: accent, strokeWidth: 0.6, roughness: 0.4 }, DASHED);
  sk.arc(HUB[0], HUB[1], 82, 82, 2.4, 4.9, { stroke: accent, strokeWidth: 0.6, roughness: 0.4 }, DASHED);
  sk.circle(HUB[0], HUB[1], HUB_RADIUS * 2, { fill: background, stroke: accent, width: 1.2, passes: 2, wobble: 0.35 });

  icons.plc(sk, ...nodes.plc, 21, 16);
  icons.containers(sk, nodes.docker[0], nodes.docker[1] + 1, 28);
  icons.gauge(sk, nodes.sensor[0], nodes.sensor[1] - 1, 17);
  icons.camera(sk, ...nodes.vision, 23, 13);
  icons.smallArm(sk, ...nodes.robot, 26);
  icons.aiChip(sk, ...nodes.ai, 15);
  icons.inspectionRobot(sk, nodes.amr[0], nodes.amr[1], 27);
  icons.codeWindow(sk, ...nodes.python, 24, 17);

  // masked areas for the labels set in Canva
  const textWidth = (text, k = 4.3) => Math.round(text.length * k + 5);
  const spokeMiddle = (key) => {
    const [x, y] = nodes[key];
    const dx = x - HUB[0];
    const dy = y - HUB[1];
    const d = Math.hypot(dx, dy);
    const m = (HUB_RADIUS + 3 + d - 13) / 2;
    return [HUB[0] + (dx / d) * m, HUB[1] + (dy / d) * m];
  };
  const boxes = { labels: {}, protocols: {} };
  for (const [text, [cx, y]] of Object.entries(labelPositions)) {
    const w = textWidth(text);
    sk.mask(cx - w / 2, y, w, 8.5);
    boxes.labels[text] = [Math.round((cx - w / 2) * 10) / 10, y, w];
  }
  for (const [key, text] of protocolsOnSpokes) {
    const w = textWidth(text, 3.9);
    const [cx, cy] = spokeMiddle(key);
    sk.mask(cx - w / 2, cy - 4, w, 8);
    boxes.protocols[text] = [Math.round((cx - w / 2) * 10) / 10, Math.round((cy - 4) * 10) / 10, w];
  }

  // underline for the motto
  sk.curve([[148, 180], [156, 178.5], [164, 180.5], [172, 178.5], [180, 180], [188, 178.8]], { stroke: accent, strokeWidth: 0.9, roughness: 0.3 });

  const grid = dotGrid({ toX: 330, toY: 186, opacity: 0.14 });
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH * EXPORT_SCALE}" height="${HEIGHT * EXPORT_SCALE}" viewBox="0 0 ${WIDTH} ${HEIGHT}">` +
    `<g>${grid}</g><g>${sk.strokeMarkup('\n')}</g></svg>`;
  return { svg, boxes };
}

module.exports = { drawCardBack };
