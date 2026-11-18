'use strict';

/**
 * Cables and data links between the zones, with their direction arrows and
 * protocol tags. Drawn before the zones so every icon masks the cable ends.
 */

const { anchors, packetRoute, routeIndex, ruleEngine, plcInlet } = require('../layout');

const cable = { strokeWidth: 0.85, roughness: 0.5 };

/** Small italic tag sitting on a cable, e.g. "MQTT". */
function protocolTag(sk, label, x, y) {
  const width = label.length * 7.8 + 16;
  sk.mask(x - width / 2, y - 11, width, 21, 6);
  sk.text(x, y + 4.5, label, 't-protocol');
}

function arrowHead(sk, points) {
  sk.polyline(points, { strokeWidth: 0.8 });
}

function drawConnections(sk) {
  const { accent } = sk.colors;
  const routeBetween = (from, to) => packetRoute.slice(routeIndex(from), routeIndex(to) + 1);

  // Robot → PC → containers → vision model: the photo's way through the edge.
  sk.curve(routeBetween(anchors.robotCamera, anchors.industrialPc), cable);
  sk.curve(routeBetween(anchors.industrialPc, anchors.containers), cable);
  sk.curve(routeBetween(anchors.containers, anchors.vision), cable);

  // Everything around the UNS.
  sk.curve([[600, 1340], [600, 1420], anchors.uns], cable); // vision → UNS
  sk.curve([anchors.plc, [400, 1562], plcInlet], cable); // PLC → UNS
  sk.curve([[656, 1536], [780, 1545], [ruleEngine[0], ruleEngine[1]]], { ...cable, stroke: accent, strokeWidth: 0.75 }); // UNS → rules (vision value)
  sk.curve([[656, 1588], [800, 1582], [ruleEngine[0], ruleEngine[1] + 32]], { ...cable, strokeWidth: 0.75 }); // UNS → rules (PLC value)
  sk.curve(
    [[1040, 1500], [1060, 1420], [1150, 1260], [1170, 900], [1090, 470], [800, 320], anchors.valve],
    { ...cable, stroke: accent, strokeWidth: 0.75 },
    'stroke-dasharray="3 6"',
  ); // rule result → robot
  sk.curve([[600, 1620], [600, 1760], [610, 1800]], cable); // UNS → dashboard

  arrowHead(sk, [[526, 1555], plcInlet, [526, 1569]]);
  arrowHead(sk, [[593, 1482], [600, 1494], [607, 1482]]);
  arrowHead(sk, [[ruleEngine[0] - 12, ruleEngine[1] - 7], ruleEngine, [ruleEngine[0] - 12, ruleEngine[1] + 7]]);
  arrowHead(sk, [[ruleEngine[0] - 12, ruleEngine[1] + 25], [ruleEngine[0], ruleEngine[1] + 32], [ruleEngine[0] - 12, ruleEngine[1] + 39]]);
  arrowHead(sk, [[603, 1788], [610, 1800], [617, 1788]]);

  protocolTag(sk, 'MQTT', 640, 610);
  protocolTag(sk, 'MQTT · ORDEN', 1170, 1100);
  protocolTag(sk, 'S7 → MQTT', 400, 1600);
  sk.text(780, 1534, '6,8 · visión', 't-accent-sm');
  sk.text(860, 1606, '6,7 · PLC', 't-note');
}

module.exports = { drawConnections };
