'use strict';

/** Small text transformations applied to generated SVG markup. */

/** rough.js writes coordinates with ~15 decimals; one is plenty and halves the file size. */
function compactNumbers(markup) {
  return markup.replace(/-?\d+\.\d{2,}/g, (n) => (+n).toFixed(1));
}

/**
 * The plant is drawn in "icon units" but shown much larger, with
 * `vector-effect: non-scaling-stroke` so lines keep the same width at any zoom.
 * That makes them look thin, so widths and dash lengths are scaled up here.
 */
function thickenStrokes(markup, { width = 2.1, dash = 2.2 } = {}) {
  return compactNumbers(
    markup
      .replace(/stroke-width="([\d.]+)"/g, (_, v) => `stroke-width="${(v * width).toFixed(2)}"`)
      .replace(/stroke-dasharray="([\d. ]+)"/g, (_, v) => `stroke-dasharray="${v.split(' ').map((n) => (n * dash).toFixed(1)).join(' ')}"`),
  );
}

module.exports = { compactNumbers, thickenStrokes };
