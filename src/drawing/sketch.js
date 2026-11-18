'use strict';

/**
 * Sketch collects hand-drawn SVG markup.
 *
 * It wraps rough.js so every drawing on the site (the plant, the header
 * flourishes, the business card…) shares one look: slightly wobbly strokes,
 * round caps and a fixed seed, so two builds always produce the same picture.
 *
 * Strokes and labels are kept in separate lists because labels must be painted
 * on top of every stroke, even strokes drawn later.
 */

const rough = require('roughjs');
const { palette } = require('../config/site');

class Sketch {
  /**
   * @param {object} options
   * @param {number} options.seed   Same seed, same drawing.
   * @param {object} options.colors Optional { ink, accent, background } override.
   */
  constructor({ seed = 7, colors = {} } = {}) {
    this.colors = { ink: palette.ink, accent: palette.accent, background: palette.background, ...colors };
    this.generator = rough.generator({ options: { seed } });
    this.defaults = {
      maxRandomnessOffset: 0.6,
      roughness: 1.0,
      bowing: 1.1,
      stroke: this.colors.ink,
      strokeWidth: 0.8,
      seed: seed + 4,
    };
    this.strokes = [];
    this.labels = [];
    this.circleState = seed * 13 + 1; // own generator: rough.js circles look like diamonds when small
  }

  // ---------------------------------------------------------------- styles

  style(overrides = {}) {
    return Object.assign({}, this.defaults, overrides);
  }

  /** Adds a rough.js drawable; `attributes` is extra raw SVG (e.g. a dash pattern). */
  shape(drawable, attributes = '') {
    for (const p of this.generator.toPaths(drawable)) {
      this.strokes.push(
        `<path ${attributes} d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" ` +
          `fill="${p.fill || 'none'}" stroke-linecap="round" stroke-linejoin="round"/>`,
      );
    }
  }

  // ------------------------------------------------------------ primitives

  line(x1, y1, x2, y2, options = {}, attributes = '') {
    this.shape(this.generator.line(x1, y1, x2, y2, this.style(options)), attributes);
  }

  rect(x, y, width, height, options = {}) {
    this.shape(this.generator.rectangle(x, y, width, height, this.style({ roughness: 0.7, ...options })));
  }

  curve(points, options = {}, attributes = '') {
    this.shape(this.generator.curve(points, this.style(options)), attributes);
  }

  polyline(points, options = {}, attributes = '') {
    this.shape(this.generator.linearPath(points, this.style(options)), attributes);
  }

  polygon(points, options = {}, attributes = '') {
    this.shape(this.generator.polygon(points, this.style(options)), attributes);
  }

  ellipse(cx, cy, width, height, options = {}) {
    this.shape(this.generator.ellipse(cx, cy, width, height, this.style(options)));
  }

  arc(cx, cy, width, height, start, stop, options = {}, attributes = '') {
    this.shape(this.generator.arc(cx, cy, width, height, start, stop, false, this.style(options)), attributes);
  }

  /** A filled dot, no wobble (rivets, LEDs, ruler marks). */
  dot(cx, cy, r, color = this.colors.accent) {
    this.strokes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`);
  }

  /** Paints the background colour over a rectangle so lines behind an icon disappear. */
  mask(x, y, width, height, radius = 2) {
    this.strokes.push(`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${this.colors.background}"/>`);
  }

  /**
   * Hand-drawn circle: a closed spline whose radius wobbles a little and whose
   * end overshoots the start, like a circle drawn with a marker.
   */
  circle(cx, cy, diameter, { stroke = this.colors.ink, width = 0.8, fill = null, passes = 1, wobble = 1 } = {}) {
    const r = diameter / 2;
    if (fill) this.strokes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`);

    for (let pass = 0; pass < passes; pass++) {
      const start = this.random() * 6.28;
      const sweep = 6.28 + 0.35 + this.random() * 0.3;
      const phase1 = this.random() * 6;
      const phase2 = this.random() * 6;
      const amount = (0.03 + this.random() * 0.015) * wobble;
      const steps = 32;

      const points = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = start + sweep * t;
        const radius =
          r * (1 + amount * Math.sin(angle * 2 + phase1) + amount * 0.6 * Math.sin(angle * 3 + phase2)) * (1 + 0.035 * (t - 0.5));
        points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
      }
      this.strokes.push(`<path d="${splinePath(points)}" stroke="${stroke}" stroke-width="${width}" fill="none" stroke-linecap="round"/>`);
    }
  }

  // ------------------------------------------------------------ structure

  /** Draws `fn` inside an SVG group with the given transform. */
  group(transform, fn) {
    this.strokes.push(`<g transform="${transform}">`);
    fn();
    this.strokes.push('</g>');
  }

  /** Draws `fn` (which works around 0,0) moved to x,y and scaled. */
  placed(x, y, scale, fn) {
    this.group(`translate(${x} ${y}) scale(${scale})`, fn);
  }

  text(x, y, content, className, anchor = 'middle') {
    this.labels.push(`<text x="${x}" y="${y}" class="${className}" text-anchor="${anchor}">${content}</text>`);
  }

  raw(markup) {
    this.strokes.push(markup);
  }

  strokeMarkup(separator = '') {
    return this.strokes.join(separator);
  }

  labelMarkup() {
    return this.labels.join('');
  }

  // ---------------------------------------------------------------- utils

  random() {
    this.circleState = (this.circleState * 16807) % 2147483647; // Park–Miller
    return this.circleState / 2147483647;
  }
}

/** Catmull-Rom spline through the points, written as cubic Bézier segments. */
function splinePath(points) {
  const f = (v) => v.toFixed(2);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    d +=
      ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

const DASHED = 'stroke-dasharray="2 2.6"';

module.exports = { Sketch, DASHED };
