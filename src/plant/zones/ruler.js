'use strict';

/** Dashed ruler on the left with the name of each level of the plant. */

const levels = [
  [150, 'PLANTA'],
  [790, 'EDGE'],
  [1150, 'VISIÓN'],
  [1500, 'UNS'],
  [1790, 'DASHBOARD'],
];

function drawRuler(sk) {
  sk.line(84, 40, 84, 2080, { strokeWidth: 0.5, roughness: 0.4 }, 'stroke-dasharray="4 7"');
  for (const [y, name] of levels) {
    sk.dot(84, y, 4.5);
    sk.text(100, y + 5, name, 't-ruler', 'start');
  }
}

module.exports = { drawRuler };
