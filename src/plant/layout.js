'use strict';

/**
 * Where everything is in the plant drawing.
 *
 * The plant is one tall SVG (1240 × 2140 world units) read from top to bottom:
 * process → edge → vision → UNS → dashboard. The camera in the browser moves
 * over it, so every position the story refers to is defined here, by name,
 * and the zone files only draw around these points.
 */

const world = { width: 1240, height: 2140 };

// The robot is drawn at icon scale and placed with a transform (see actors.js).
const robot = { y: 420, scale: 4, parkedX: 180, inspectionX: 560 };
const robotCamera = [robot.inspectionX + 4 * robot.scale, robot.y - 10.5 * robot.scale];

const valveWheel = [690, 340];
const unsHub = [600, 1560];
const ruleEngine = [930, 1545];

// Points where the travelling data packet stops, one per kind of scene.
const anchors = {
  robotCamera,
  industrialPc: [760, 860],
  containers: [470, 860],
  vision: [600, 1296],
  uns: [600, 1498],
  plc: [262, 1560],
  ruleEngine,
  valve: [valveWheel[0] - 6, valveWheel[1]],
  transmitter: [262, 336],
  dashboard: [758, 1965],
};

// Path of the main packet. Anchors are referenced (not copied) so the drawing
// can find each stretch of cable between two of them.
const packetRoute = [
  anchors.robotCamera, [620, 520], [700, 700], anchors.industrialPc,
  [640, 860], anchors.containers,
  [520, 980], [615, 1030], [640, 1140], anchors.vision,
  [600, 1400], anchors.uns,
  [652, 1528], [780, 1545], anchors.ruleEngine,
  [1060, 1420], [1150, 1260], [1170, 900], [1090, 470], [800, 320], anchors.valve,
  [480, 326], anchors.transmitter,
  [263, 900], [262, 1500], anchors.plc,
  [430, 1572], [540, 1570], [580, 1650], [600, 1760], [660, 1900], anchors.dashboard,
];

// The PLC value travels on its own: PLC → UNS → rule engine, next to the vision value.
const plcInlet = [538, 1562];
const plcRoute = [anchors.plc, [400, 1562], plcInlet, [600, 1622], [700, 1588], [800, 1582], [ruleEngine[0], ruleEngine[1] + 32]];

const routeIndex = (point) => packetRoute.findIndex((p) => p === point);

module.exports = { world, robot, robotCamera, valveWheel, unsHub, ruleEngine, anchors, packetRoute, plcRoute, plcInlet, routeIndex };
