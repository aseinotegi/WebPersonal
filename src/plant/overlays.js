'use strict';

/**
 * Badges that appear only in some scenes (the browser toggles their `on`
 * class): the camera flash, "photo taken", "alarm confirmed", "valve closed".
 */

const { robotCamera, ruleEngine } = require('./layout');

function badge(id, x, y, text, variant = '') {
  const width = text.length * 8.6 + 26;
  return (
    `<g class="badge ${variant}" id="${id}" transform="translate(${x} ${y})">` +
    `<rect x="${-width / 2}" y="-16" width="${width}" height="32" rx="8"/>` +
    `<text y="5" text-anchor="middle">${text}</text></g>`
  );
}

function drawOverlays() {
  return [
    `<polygon class="badge flash" id="b-flash" points="${robotCamera[0]},${robotCamera[1]} 484,146 558,146"/>`,
    badge('b-photo', 520, 70, 'foto · PI-104'),
    badge('b-alarm', ruleEngine[0] + 110, ruleEngine[1] - 70, 'ALARMA CONFIRMADA', 'alarm'),
    badge('b-valve', 760, 400, 'XV-104 cerrada ✓'),
  ].join('');
}

module.exports = { drawOverlays };
