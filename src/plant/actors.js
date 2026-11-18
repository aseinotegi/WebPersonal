'use strict';

/**
 * Parts of the plant that move: the inspection robot with its small arm and
 * the valve handwheel. Each one is its own sketch so the browser can transform
 * it without touching the rest of the drawing.
 */

const { Sketch } = require('../drawing/sketch');
const icons = require('../drawing/icons');
const { valveWheel } = require('./layout');

function drawHandwheel() {
  const sk = new Sketch({ seed: 41 });
  const [x, y] = valveWheel;
  sk.circle(x, y, 30, { fill: sk.colors.background, passes: 2, width: 0.9 });
  for (let k = 0; k < 4; k++) {
    const angle = (k * Math.PI) / 2;
    sk.line(x, y, x + Math.cos(angle) * 14, y + Math.sin(angle) * 14, { strokeWidth: 0.8, roughness: 0.3 }); // spokes
  }
  sk.dot(x, y, 3);
  return sk.strokeMarkup();
}

function drawRobotBody() {
  const sk = new Sketch({ seed: 29 });
  icons.inspectionRobot(sk, 0, 0, 27);
  return sk.strokeMarkup();
}

/**
 * Two-segment arm in robot units. It pivots at (8, 2); fully extended the
 * gripper sits at (28.5, -20), which lands on the handwheel when the robot
 * stops at its inspection point.
 */
function drawArm() {
  const sk = new Sketch({ seed: 33 });
  const gripper = { strokeWidth: 0.8, roughness: 0.2, stroke: sk.colors.accent };
  sk.line(8, 2, 16, -14, { strokeWidth: 1.2, roughness: 0.4 });
  sk.line(16, -14, 27, -19.4, { strokeWidth: 1.1, roughness: 0.4 });
  sk.circle(16, -14, 2.6, { fill: sk.colors.background, width: 0.7 }); // elbow
  sk.circle(8, 2, 3, { fill: sk.colors.background, width: 0.7 }); // shoulder
  sk.dot(8, 2, 0.8);
  sk.line(27, -19.4, 29.6, -21.6, gripper);
  sk.line(27, -19.4, 29.8, -17.6, gripper);
  return sk.strokeMarkup();
}

const armPivot = [8, 2];

module.exports = { drawHandwheel, drawRobotBody, drawArm, armPivot };
