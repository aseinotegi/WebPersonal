'use strict';

/** Helpers shared by the brand pieces (card, banners, CV header). */

const SOFT = '#B6C4D8';

/** Faint dot grid, the "whiteboard" background of every piece. */
function dotGrid({ fromX = 6, toX, fromY = 6, toY, step = 12, radius = 0.45, color = '#E6EDF7', opacity = 0.13 }) {
  const dots = [];
  for (let x = fromX; x <= toX; x += step) {
    for (let y = fromY; y <= toY; y += step) dots.push(`<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" opacity="${opacity}"/>`);
  }
  return dots.join('');
}

/** Italic protocol tag on a link (MQTT, OPC UA…), drawn into the sketch. */
function protocolTag(sk, text, cx, cy, size = 6.2) {
  const width = text.length * size * 0.62 + 5;
  sk.mask(cx - width / 2, cy - size * 0.75, width, size * 1.35);
  sk.raw(
    `<text x="${cx}" y="${cy + size * 0.35}" fill="${SOFT}" font-family="Inter" font-weight="700" font-style="italic" ` +
      `font-size="${size}" text-anchor="middle">${text}</text>`,
  );
}

function svgDocument({ width, height, pixelWidth, pixelHeight, body, background = null }) {
  const fill = background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelWidth}" height="${pixelHeight}" viewBox="0 0 ${width} ${height}">${fill}${body}</svg>`;
}

module.exports = { SOFT, dotGrid, protocolTag, svgDocument };
