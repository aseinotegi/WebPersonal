'use strict';

/**
 * Business card, front (336 × 192 units = 89 × 51 mm, exported ×4).
 *
 * Only the illustration is generated: name, title, contact and QR are laid out
 * in Canva. The masks under MQTT / OPC UA leave room for those two labels, and
 * the lines leaving on the right continue on the back of the card.
 */

const { Sketch, DASHED } = require('../src/drawing/sketch');
const icons = require('../src/drawing/icons');
const { dotGrid } = require('./common');

const WIDTH = 336;
const HEIGHT = 192;
const EXPORT_SCALE = 4;

// Free areas for the protocol labels added in Canva: [x, y, width].
const LABEL_AREAS = { MQTT: [243, 15, 22], 'OPC UA': [258, 59, 28] };

function drawCardFront() {
  const sk = new Sketch({ seed: 7 });
  const { accent } = sk.colors;

  // links first: icons mask their ends
  sk.line(239, 24, 271, 34, { strokeWidth: 0.75 }); // containers – PC
  sk.line(276, 49, 254, 58, { strokeWidth: 0.75 }); // PC – PLC
  sk.line(300, 49, 309, 57, { strokeWidth: 0.75 }); // PC – camera
  sk.line(303, 30, 340, 12, { strokeWidth: 0.75 }); // continues on the back (y = 12)
  sk.line(327, 63, 340, 64, { strokeWidth: 0.75 }); // continues on the back (y = 64)
  sk.line(222, 31, 240, 54, { strokeWidth: 0.6 }, DASHED); // containers – PLC
  sk.curve([[244, 71], [238, 81], [233, 91], [232, 99]], { stroke: accent, strokeWidth: 0.8, roughness: 0.4 }, 'stroke-dasharray="1.6 2.8"'); // PLC → robot wrist
  sk.line(249, 180, 340, 180, { strokeWidth: 0.7, roughness: 1.2 }, DASHED); // floor cable, continues on the back

  icons.robotArm(sk);
  icons.gear(sk, 241, 178, 6.5, 8);

  icons.containers(sk, 224, 23, 30);
  icons.industrialPc(sk, 288, 38, 34, 22);
  sk.line(276, 28, 275, 17, { strokeWidth: 0.7 });
  icons.wifi(sk, 275, 14);
  icons.plc(sk, 244, 62, 20, 16);
  icons.camera(sk, 316, 61, 23, 13);

  for (const [x, y, width] of Object.values(LABEL_AREAS)) sk.mask(x, y, width, 8);

  const grid = dotGrid({ fromX: 186, toX: 330, fromY: 8, toY: 186, opacity: 0.18 });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH * EXPORT_SCALE}" height="${HEIGHT * EXPORT_SCALE}" viewBox="0 0 ${WIDTH} ${HEIGHT}">` +
    `<g>${grid}</g><g>${sk.strokeMarkup('\n')}</g></svg>`
  );
}

module.exports = { drawCardFront, LABEL_AREAS };
