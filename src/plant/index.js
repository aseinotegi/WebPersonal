'use strict';

/**
 * Draws the whole plant for the scroll story.
 *
 * Zones are drawn in a fixed order: connections first, so the icons of each
 * zone mask the ends of the cables, and labels last, on top of everything.
 */

const { Sketch } = require('../drawing/sketch');
const { thickenStrokes } = require('../drawing/svg');
const { drawRuler } = require('./zones/ruler');
const { drawConnections } = require('./zones/connections');
const { drawProcess } = require('./zones/process');
const { drawEdge } = require('./zones/edge');
const { drawVision } = require('./zones/vision');
const { drawUns } = require('./zones/uns');
const { drawPlc } = require('./zones/plc');
const { drawRuleEngine } = require('./zones/rule-engine');
const { drawDashboard } = require('./zones/dashboard');
const { drawOverlays } = require('./overlays');
const { drawMarks } = require('./marks');
const { drawHandwheel, drawRobotBody, drawArm } = require('./actors');
const layout = require('./layout');

function drawPlant() {
  const sk = new Sketch({ seed: 97 });
  drawRuler(sk);
  drawConnections(sk);
  drawProcess(sk);
  drawEdge(sk);
  drawVision(sk);
  drawUns(sk);
  drawPlc(sk);
  drawRuleEngine(sk);
  drawDashboard(sk);

  const scenery =
    `<g class="ink">${thickenStrokes(sk.strokeMarkup())}</g>` +
    sk.labelMarkup() +
    `<g id="wheel" class="ink">${thickenStrokes(drawHandwheel())}</g>` +
    drawOverlays() +
    drawMarks();

  const robot = `${thickenStrokes(drawRobotBody())}<g id="arm" class="ink">${thickenStrokes(drawArm())}</g>`;

  return { scenery, robot, layout };
}

module.exports = { drawPlant };
