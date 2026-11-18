// Geometry helpers shared by the story script.
// Runs in the browser; concatenated by src/build.js inside one closure.

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Smooth SVG path through the points (Catmull-Rom spline as cubic Béziers). */
function smoothPath(points) {
  let d = 'M' + points[0];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const controls = [
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
      p2[0], p2[1],
    ];
    d += ' C' + controls.map((v) => v.toFixed(1)).join(' ');
  }
  return d;
}

/** Distance along `path` of the point closest to `target`, searching from `from` onwards. */
function lengthAtPoint(path, target, from = 0, step = 3) {
  const total = path.getTotalLength();
  let best = from;
  let bestDistance = Infinity;
  for (let l = from; l <= total; l += step) {
    const q = path.getPointAtLength(l);
    const distance = (q.x - target[0]) ** 2 + (q.y - target[1]) ** 2;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = l;
    }
  }
  return best;
}
