'use strict';

/** Small hand-drawn details used in the page chrome. */

const { Sketch } = require('./sketch');
const { compactNumbers } = require('./svg');

/** "AS" inside a hand-drawn circle, used as the logo in the header. */
function monogram() {
  const sk = new Sketch({ seed: 5 });
  sk.circle(20, 20, 34, { stroke: sk.colors.accent, width: 1.6, passes: 2, wobble: 0.4 });
  return compactNumbers(
    `<svg viewBox="0 0 40 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${sk.strokeMarkup()}` +
      '<text x="20" y="25.2" text-anchor="middle" class="mono">AS</text></svg>',
  );
}

/** Short wavy underline below section titles. */
function squiggle(width = 72) {
  const sk = new Sketch({ seed: 3 });
  const points = [];
  for (let i = 0; i <= 6; i++) points.push([2 + (i * (width - 4)) / 6, 4 + (i % 2 ? -1.6 : 1.2)]);
  sk.curve(points, { stroke: sk.colors.accent, strokeWidth: 1.4, roughness: 0.3 });
  return compactNumbers(`<svg viewBox="0 0 ${width} 8" class="sq" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${sk.strokeMarkup()}</svg>`);
}

module.exports = { monogram, squiggle };
