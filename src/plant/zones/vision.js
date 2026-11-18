'use strict';

/**
 * The photo the robot took, as the vision model returns it: what it is
 * (class + confidence) and what it reads (the value that goes to the UNS).
 */

const icons = require('../../drawing/icons');

const photo = { x: 440, y: 1130, width: 320, height: 210 };
const detection = { x: 552, y: 1186, width: 96, height: 106 };

function drawVision(sk) {
  const { x, y, width, height } = photo;
  sk.mask(x - 6, y - 6, width + 12, height + 12, 8);
  sk.rect(x, y, width, height, { strokeWidth: 1, roughness: 0.8 });

  // the pipe and the gauge, as seen in the photo
  sk.line(x + 10, y + 150, x + width - 10, y + 151, { strokeWidth: 0.8, roughness: 1 });
  sk.line(x + 10, y + 176, x + width - 10, y + 175, { strokeWidth: 0.8, roughness: 1 });
  sk.line(600, y + 128, 600, y + 150, { strokeWidth: 0.9 });
  sk.placed(600, y + 92, 2.6, () => icons.gauge(sk, 0, 0, 17));

  // model output
  sk.rect(detection.x, detection.y, detection.width, detection.height, { stroke: sk.colors.accent, strokeWidth: 0.9, roughness: 0.4 });
  sk.text(detection.x, detection.y - 8, 'MANÓMETRO · conf. 0,98', 't-accent-sm', 'start');
  sk.text(664, 1222, 'LECTURA', 't-note-sm', 'start');
  sk.text(664, 1256, '6,8 bar', 't-value', 'start');
  sk.text(x + 12, y + height - 10, 'IMG_0412 · PI-104', 't-note', 'start');
}

module.exports = { drawVision };
