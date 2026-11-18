'use strict';

/** The PLC that receives the pressure transmitter PT-104. */

const icons = require('../../drawing/icons');
const { anchors } = require('../layout');

function drawPlc(sk) {
  const [x, y] = anchors.plc;
  sk.mask(218, 1512, 92, 120, 8);
  sk.placed(x, y, 3, () => icons.plc(sk, 0, 0, 21, 16));
  sk.text(x, 1626, 'PLC', 't-accent-sm');
}

module.exports = { drawPlc };
