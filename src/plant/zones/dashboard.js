'use strict';

/** The operator's dashboard: PT-104 from the PLC, the peak and its resolution. */

const { palette } = require('../../config/site');
const { anchors } = require('../layout');

const screen = { x: 420, y: 1800, width: 360, height: 210 };

// Pressure trend inside the screen, relative to its top-left corner.
// The last point is where the data packet ends its journey.
const trend = [[22, 166], [70, 160], [110, 168], [150, 156], [178, 128], [204, 98], [222, 104], [244, 140], [268, 162], [300, 168]];
const peak = [204, 98];

function drawDashboard(sk) {
  const { x, y, width, height } = screen;
  const alarm = palette.alarm;

  sk.mask(x - 6, y - 6, width + 12, height + 12, 10);
  sk.rect(x, y, width, height, { strokeWidth: 1, roughness: 0.8 });
  sk.line(x, y + 30, x + width, y + 30, { strokeWidth: 0.6, roughness: 0.3 }); // title bar
  sk.dot(x + 16, y + 15, 3.5);
  sk.dot(x + 30, y + 15, 3.5, sk.colors.ink);
  sk.dot(x + 44, y + 15, 3.5, sk.colors.ink);

  sk.text(x + 22, y + 60, 'PT-104 · PRESIÓN (PLC)', 't-note', 'start');
  sk.text(x + 22, y + 94, '4,2 bar', 't-value', 'start');
  sk.text(x + 338, y + 60, 'ALARMA CERRADA ✓', 't-accent-sm', 'end');

  sk.line(x + 22, y + 116, x + 338, y + 116, { strokeWidth: 0.5, roughness: 0.2, stroke: alarm }, 'stroke-dasharray="5 6"'); // limit
  sk.text(x + 22, y + 110, '6 bar', 't-note', 'start');
  sk.line(x + 236, y + 84, x + 236, y + 196, { strokeWidth: 0.5, roughness: 0.2 }, 'stroke-dasharray="3 5"'); // valve closed
  sk.text(x + 242, y + 194, 'XV-104 cerrada', 't-note-sm', 'start');

  const points = trend.map(([dx, dy]) => [x + dx, y + dy]).concat([anchors.dashboard]);
  sk.polyline(points, { stroke: sk.colors.accent, strokeWidth: 1, roughness: 0.4 });
  sk.dot(x + peak[0], y + peak[1], 5, alarm);
  sk.text(x + peak[0], y + peak[1] - 12, 'pico 6,8 bar', 't-alarm');

  // stand
  sk.line(x + 150, y + height, x + 150, y + height + 28, { strokeWidth: 1 });
  sk.line(x + 210, y + height, x + 210, y + height + 28, { strokeWidth: 1 });
  sk.line(x + 110, y + height + 30, x + 250, y + height + 30, { strokeWidth: 1.2 });
}

module.exports = { drawDashboard };
