'use strict';

/**
 * Closing drawing for the footer: the inspection robot drives back to its
 * charging station and the charge light comes on.
 *
 * Drawn in its own small coordinate system (viewBox 0 0 260 52). The robot is
 * a separate group so the browser can slide it from START_X to HOME_X.
 */

const { Sketch } = require('../drawing/sketch');
const icons = require('../drawing/icons');
const { thickenStrokes } = require('../drawing/svg');

const VIEWBOX = '0 0 260 52';
const FLOOR_Y = 46;
const ROBOT_Y = FLOOR_Y - 14.5; // inspectionRobot at (0,0) touches the floor at y = 14.5
const START_X = 26;
const HOME_X = 194.5; // front of the body against the contact plate

function drawStation() {
  const sk = new Sketch({ seed: 52 });
  sk.line(4, FLOOR_Y, 256, FLOOR_Y, { strokeWidth: 0.8, roughness: 0.6 }); // floor
  for (let x = 30; x < 180; x += 18) sk.line(x, FLOOR_Y + 3, x + 8, FLOOR_Y + 3, { strokeWidth: 0.5, roughness: 0.3, stroke: sk.colors.accent }); // route marks

  sk.rect(212, 18, 24, 28, { strokeWidth: 0.9 }); // station
  sk.rect(208, 34, 4, 6, { strokeWidth: 0.7 }); // contact plate
  sk.polyline([[226, 25], [220, 32.5], [225, 32.5], [219, 40]], { strokeWidth: 0.8, roughness: 0.3 }); // bolt
  sk.curve([[236, 40], [246, 41], [252, 45], [256, 46]], { strokeWidth: 0.6, roughness: 0.4 }); // cable

  // Battery above the parked robot, with a bolt that lights up when it starts charging.
  const battery = new Sketch({ seed: 57 });
  battery.rect(176, 2, 21, 10.5, { strokeWidth: 0.7, roughness: 0.4 });
  battery.rect(197, 5.5, 2.4, 4, { strokeWidth: 0.6, roughness: 0.3 });
  const bolt = '<path class="bolt" d="M188.6 3 L183.4 7.9 H186.9 L185.1 11.5 L190.8 6.3 H187.3 Z"/>';

  return (
    `<g class="ink">${thickenStrokes(sk.strokeMarkup())}</g>` +
    `<circle id="dock-led" cx="224" cy="21.5" r="1.6"/>` +
    `<g class="battery"><g class="ink">${thickenStrokes(battery.strokeMarkup())}</g>${bolt}</g>`
  );
}

function drawRobot() {
  const sk = new Sketch({ seed: 29 }); // same seed as the robot in the story
  icons.inspectionRobot(sk, 0, 0, 27);
  return `<g class="ink bob">${thickenStrokes(sk.strokeMarkup())}</g>`;
}

function drawDock() {
  return (
    `<svg viewBox="${VIEWBOX}" role="img" aria-label="El robot de inspección vuelve a su base de carga">` +
    drawStation() +
    `<g id="dock-bot" style="--start:${START_X}px;--home:${HOME_X}px;--y:${ROBOT_Y}px">${drawRobot()}</g>` +
    '</svg>'
  );
}

module.exports = { drawDock };
