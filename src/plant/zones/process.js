'use strict';

/**
 * The process at the top of the plant: the pipe, the local gauge PI-104 the
 * robot photographs, the transmitter PT-104 wired to the PLC and the manual
 * valve XV-104 the robot closes.
 */

const icons = require('../../drawing/icons');

function drawPipe(sk) {
  for (const y of [250, 292]) sk.line(110, y, 1180, y + (y === 250 ? 1 : -1), { strokeWidth: 1.1, roughness: 1.4 });
  for (const x of [196, 900, 1060]) {
    // flanges
    sk.line(x, 242, x, 300, { strokeWidth: 0.9 });
    sk.line(x + 8, 242, x + 8, 300, { strokeWidth: 0.9 });
  }
  for (const x of [330, 960]) {
    // flow direction
    const arrow = { stroke: sk.colors.accent, strokeWidth: 0.7 };
    sk.polyline([[x, 271], [x + 26, 271]], arrow);
    sk.polyline([[x + 18, 265], [x + 26, 271], [x + 18, 277]], arrow);
  }
}

function drawLocalGauge(sk) {
  sk.line(520, 222, 520, 250, { strokeWidth: 1 });
  sk.placed(520, 172, 3.2, () => icons.gauge(sk, 0, 0, 17));
  sk.text(520, 112, 'PI-104 · LOCAL', 't-note');
}

function drawTransmitter(sk) {
  sk.line(262, 292, 262, 318, { strokeWidth: 1 });
  sk.mask(240, 316, 44, 36, 6);
  sk.rect(244, 320, 36, 28, { strokeWidth: 0.9, roughness: 0.5 });
  sk.text(262, 339, 'PT', 't-accent');
  sk.text(290, 340, 'PT-104', 't-note', 'start');
  // 4-20 mA signal cable down to the PLC
  sk.line(262, 352, 262, 1512, { strokeWidth: 0.6, roughness: 0.5, stroke: sk.colors.accent }, 'stroke-dasharray="2 6"');
  sk.text(274, 1010, '4-20 mA', 't-note-sm', 'start');
}

function drawManualValve(sk) {
  sk.line(712, 292, 712, 404, { strokeWidth: 1 });
  sk.line(728, 292, 728, 404, { strokeWidth: 1 });
  sk.line(706, 404, 734, 404, { strokeWidth: 1.2 });
  sk.polygon([[708, 318], [732, 318], [714, 340], [726, 340]], { strokeWidth: 0.8 }); // valve body (bow tie)
  sk.polygon([[714, 340], [726, 340], [708, 362], [732, 362]], { strokeWidth: 0.8 });
  sk.line(706, 340, 690, 340, { strokeWidth: 1 }); // stem to the handwheel (see actors.js)
  sk.text(760, 344, 'XV-104 · MANUAL', 't-note', 'start');
}

function drawFloor(sk) {
  sk.line(110, 482, 1180, 481, { strokeWidth: 0.8, roughness: 1.2 });
  sk.line(150, 498, 1150, 498, { strokeWidth: 0.5, roughness: 0.6 }, 'stroke-dasharray="6 10"');
}

function drawProcess(sk) {
  drawPipe(sk);
  drawLocalGauge(sk);
  drawTransmitter(sk);
  drawManualValve(sk);
  drawFloor(sk);
}

module.exports = { drawProcess };
