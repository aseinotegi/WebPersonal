// Shared hand-drawn helpers + icon library (card units: 336 x 192)
const rough = require('roughjs');

module.exports = function make(seed = 7, pal = {}) {
  const gen = rough.generator({ options: { seed } });
  const INK = pal.ink || '#E6EDF7', CYAN = pal.accent || '#22D3EE', NAVY = pal.bg || '#060D1B';
  const base = { maxRandomnessOffset: 0.6, roughness: 1.0, bowing: 1.1, stroke: INK, strokeWidth: 0.8, seed: seed + 4 };
  const out = [];
  const o = (x) => Object.assign({}, base, x);
  const add = (d, extra = '') => { for (const p of gen.toPaths(d)) out.push(`<path ${extra} d="${p.d}" stroke="${p.stroke}" stroke-width="${p.strokeWidth}" fill="${p.fill || 'none'}" stroke-linecap="round" stroke-linejoin="round"/>`); };
  let _s = seed * 13 + 1;
  const rnd = () => { _s = (_s * 16807) % 2147483647; return _s / 2147483647; };
  function handCircle(cx, cy, d, { stroke = INK, sw = 0.8, fill = null, passes = 1, wob = 1 } = {}) {
    const r = d / 2;
    if (fill) out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`);
    for (let p = 0; p < passes; p++) {
      const start = rnd() * 6.28, sweep = 6.28 + 0.35 + rnd() * 0.3, n = 32, ph1 = rnd() * 6, ph2 = rnd() * 6, k = (0.03 + rnd() * 0.015) * wob;
      const pts = [];
      for (let i = 0; i <= n; i++) { const t = i / n, a = start + sweep * t; const rr = r * (1 + k * Math.sin(a * 2 + ph1) + k * .6 * Math.sin(a * 3 + ph2)) * (1 + .035 * (t - .5)); pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
      let s = `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
      for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2; s += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)} ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`; }
      out.push(`<path d="${s}" stroke="${stroke}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`);
    }
  }
  const dot = (cx, cy, r, c = CYAN) => out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`);
  const knock = (x, y, w, h, rx = 2) => out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${NAVY}"/>`);
  const line = (x1, y1, x2, y2, opt = {}, extra = '') => add(gen.line(x1, y1, x2, y2, o(opt)), extra);
  const rect = (x, y, w, h, opt = {}) => add(gen.rectangle(x, y, w, h, o(Object.assign({ roughness: 0.7 }, opt))));
  const DASH = 'stroke-dasharray="2 2.6"';

  // ---------- icons (all return their bounding box) ----------
  function embeddedPC(cx, cy, w = 30, h = 20) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 4);
    for (let i = 2; i < w - 1; i += 2.6) line(x + i, y, x + i, y + 4, { strokeWidth: 0.55, roughness: 0.3 });
    rect(x, y + 4, w, h - 4);
    rect(x + 3, y + h - 7, 4.5, 3, { strokeWidth: 0.6 });
    rect(x + 9, y + h - 7, 4.5, 3, { strokeWidth: 0.6 });
    rect(x + 15, y + h - 7, 3, 3, { strokeWidth: 0.6 });
    line(x + 3, y + 8.5, x + 13, y + 8.5, { strokeWidth: 0.5, roughness: 0.3 });
    dot(x + w - 4, y + h - 5.5, 1.1);
    dot(x + w - 8, y + h - 5.5, 0.8, INK);
    return { x, y, w, h };
  }
  function containers(cx, cy, w = 26) {
    const h = 8, x = cx - w / 2, y = cy;
    knock(x - 2, y - h - 3, w + 4, 2 * h + 5);
    const box = (bx, by, bw) => {
      rect(bx, by, bw, h);
      for (let i = 2.6; i < bw - 3; i += 2.4) line(bx + i, by + 1.2, bx + i, by + h - 1.2, { strokeWidth: 0.45, roughness: 0.2 });
      line(bx + bw - 2.2, by + 1.2, bx + bw - 2.2, by + h - 1.2, { stroke: CYAN, strokeWidth: 0.7, roughness: 0.2 });
    };
    box(x, y, w);
    box(x + 3, y - h - 1, w * 0.62);
    return { x, y: y - h - 1, w, h: 2 * h + 1 };
  }
  function camera(cx, cy, w = 22, h = 12) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 6);
    const bw = w * 0.58;
    rect(x + w - bw, y, bw, h);
    rect(x + 2.5, y + h * 0.18, w - bw - 2.5, h * 0.64, { strokeWidth: 0.7 });
    line(x + 6, y + h * 0.18, x + 6, y + h * 0.82, { strokeWidth: 0.5, roughness: 0.2 });
    add(gen.ellipse(x + 2.5, cy, 3.2, h * 0.64, o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.3 })));
    dot(x + w - 3, y + 2.6, 0.9);
    line(cx + 3, y + h, cx + 3, y + h + 3, { strokeWidth: 0.6 });
    line(cx, y + h + 3, cx + 6, y + h + 3, { strokeWidth: 0.6 });
    return { x, y, w, h: h + 3 };
  }
  function plc(cx, cy, w = 20, h = 16) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 4);
    rect(x, y, w, h);
    for (let i = 2; i < w - 2; i += 3) { rect(x + i, y + 1.5, 2, 2, { strokeWidth: 0.45, roughness: 0.2 }); rect(x + i, y + h - 3.5, 2, 2, { strokeWidth: 0.45, roughness: 0.2 }); }
    rect(x + 2.5, y + 5.5, w * 0.45, h - 11, { strokeWidth: 0.55 });
    for (let j = 0; j < 3; j++) dot(x + w - 4, y + 6 + j * 2, 0.6, j === 1 ? INK : CYAN);
    return { x, y, w, h };
  }
  function gauge(cx, cy, d = 17) {
    const r = d / 2;
    knock(cx - r - 2, cy - r - 2, d + 4, d + 8, 6);
    handCircle(cx, cy, d, { sw: 0.8 });
    for (let a = 200; a <= 340; a += 35) { const t = a * Math.PI / 180; line(cx + Math.cos(t) * (r - 1.2), cy + Math.sin(t) * (r - 1.2), cx + Math.cos(t) * (r - 3), cy + Math.sin(t) * (r - 3), { strokeWidth: 0.5, roughness: 0.2 }); }
    line(cx, cy, cx + 4.2, cy - 3.6, { stroke: CYAN, strokeWidth: 0.9, roughness: 0.2 });
    dot(cx, cy, 1, INK);
    rect(cx - 1.5, cy + r, 3, 2.5, { strokeWidth: 0.6 });
    line(cx - 7, cy + r + 3.5, cx + 7, cy + r + 3.5, { strokeWidth: 0.8 });
    return { x: cx - r, y: cy - r, w: d, h: d + 4 };
  }
  function miniArm(cx, cy, s = 20) {
    const k = s / 20;
    knock(cx - 9 * k, cy - 10 * k, 22 * k, 21 * k, 3);
    rect(cx - 6 * k, cy + 7 * k, 10 * k, 3 * k, { strokeWidth: 0.7 });
    line(cx - 1 * k, cy + 7 * k, cx - 3 * k, cy - 1 * k, { strokeWidth: 1.1 });
    line(cx - 3 * k, cy - 1 * k, cx + 5 * k, cy - 7 * k, { strokeWidth: 1.1 });
    handCircle(cx - 3 * k, cy - 1 * k, 3.4 * k, { fill: NAVY, sw: 0.7 });
    handCircle(cx - 1 * k, cy + 7 * k, 3.4 * k, { fill: NAVY, sw: 0.7 });
    line(cx + 5 * k, cy - 7 * k, cx + 9 * k, cy - 8.5 * k, { strokeWidth: 0.7 });
    line(cx + 5 * k, cy - 7 * k, cx + 8.5 * k, cy - 4.5 * k, { strokeWidth: 0.7 });
    dot(cx - 3 * k, cy - 1 * k, 0.8); dot(cx - 1 * k, cy + 7 * k, 0.8);
    return { x: cx - 9 * k, y: cy - 10 * k, w: 22 * k, h: 21 * k };
  }
  function aiChip(cx, cy, s = 16) {
    const x = cx - s / 2, y = cy - s / 2;
    knock(x - 4, y - 4, s + 8, s + 8);
    rect(x, y, s, s);
    for (let i = 1; i <= 3; i++) {
      const t = (i / 4) * s;
      line(x + t, y, x + t, y - 3, { strokeWidth: 0.55, roughness: 0.2 }); line(x + t, y + s, x + t, y + s + 3, { strokeWidth: 0.55, roughness: 0.2 });
      line(x, y + t, x - 3, y + t, { strokeWidth: 0.55, roughness: 0.2 }); line(x + s, y + t, x + s + 3, y + t, { strokeWidth: 0.55, roughness: 0.2 });
    }
    const n = [[cx - 3.5, cy - 2.5], [cx + 3.5, cy - 3], [cx, cy + 3.5]];
    line(...n[0], ...n[1], { stroke: CYAN, strokeWidth: 0.6, roughness: 0.2 }); line(...n[1], ...n[2], { stroke: CYAN, strokeWidth: 0.6, roughness: 0.2 }); line(...n[0], ...n[2], { stroke: CYAN, strokeWidth: 0.6, roughness: 0.2 });
    n.forEach(p => dot(p[0], p[1], 1.1));
    return { x: x - 3, y: y - 3, w: s + 6, h: s + 6 };
  }
  function inspectionRobot(cx, cy, w = 26) {
    // wheeled autonomous inspection robot with mast + PTZ camera
    const bh = 8, x = cx - w / 2, by = cy + 2;
    knock(x - 2, cy - 15, w + 4, 27, 3);
    rect(x, by, w, bh);
    handCircle(x + 5, by + bh + 1.5, 6, { fill: NAVY, sw: 0.8 });
    handCircle(x + w - 5, by + bh + 1.5, 6, { fill: NAVY, sw: 0.8 });
    dot(x + 5, by + bh + 1.5, 0.8, INK); dot(x + w - 5, by + bh + 1.5, 0.8, INK);
    line(cx + 4, by, cx + 4, cy - 8, { strokeWidth: 0.9 });
    rect(cx + 0.5, cy - 13, 7, 5, { strokeWidth: 0.7 });
    dot(cx + 7.5, cy - 10.5, 0.9);
    // lidar puck + scan arcs
    rect(x + 3, by - 2.5, 5, 2.5, { strokeWidth: 0.6 });
    add(gen.arc(x + 5.5, by - 2.5, 9, 9, Math.PI * 1.15, Math.PI * 1.55, false, o({ stroke: CYAN, strokeWidth: 0.6, roughness: 0.2 })));
    add(gen.arc(x + 5.5, by - 2.5, 15, 15, Math.PI * 1.15, Math.PI * 1.55, false, o({ stroke: CYAN, strokeWidth: 0.6, roughness: 0.2 })));
    return { x, y: cy - 15, w, h: 27 };
  }
  function codeWin(cx, cy, w = 24, h = 17) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 4);
    rect(x, y, w, h);
    line(x, y + 4, x + w, y + 4, { strokeWidth: 0.6, roughness: 0.2 });
    dot(x + 2.5, y + 2, 0.7); dot(x + 5, y + 2, 0.7, INK); dot(x + 7.5, y + 2, 0.7, INK);
    add(gen.linearPath([[cx - 4, cy + 0.5], [cx - 7, cy + 3.5], [cx - 4, cy + 6.5]], o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.2 })));
    add(gen.linearPath([[cx + 4, cy + 0.5], [cx + 7, cy + 3.5], [cx + 4, cy + 6.5]], o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.2 })));
    line(cx + 1.5, cy, cx - 1.5, cy + 7, { stroke: CYAN, strokeWidth: 0.9, roughness: 0.2 });
    return { x, y, w, h };
  }
  function wifi(cx, cy) {
    add(gen.arc(cx, cy, 6, 4.5, Math.PI * 1.2, Math.PI * 1.8, false, o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.3 })));
    add(gen.arc(cx, cy, 11, 8, Math.PI * 1.2, Math.PI * 1.8, false, o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.3 })));
  }

  // full robot arm in card coordinates (x 176-260, y 96-191); place with g()
  function robotArm(withFloor = true) {
    if (withFloor) line(176, 190, 250, 189.5, { strokeWidth: 0.7, roughness: 1.2 });
    add(gen.polygon([[197, 190], [229, 190], [224, 179], [202, 179]], o({ fill: INK, fillStyle: 'hachure', hachureGap: 2.2, hachureAngle: -41, fillWeight: 0.45 })));
    add(gen.ellipse(213, 178.5, 28, 7, o({})));
    const link = (x1, y1, x2, y2, w, opts) => { const dx = x2 - x1, dy = y2 - y1, Ln = Math.hypot(dx, dy), nx = -dy / Ln * w / 2, ny = dx / Ln * w / 2; add(gen.polygon([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], o(opts))); };
    link(213, 170, 204, 126, 10, { fill: INK, fillStyle: 'hachure', hachureGap: 3, fillWeight: 0.35, hachureAngle: 60 });
    link(204, 126, 232, 106, 8, {});
    line(236, 100, 236, 112);
    add(gen.linearPath([[236, 101], [244, 98.5], [247.5, 101.5]], o({})));
    add(gen.linearPath([[236, 111], [244, 113.5], [247.5, 110.5]], o({})));
    add(gen.curve([[218, 179], [222, 160], [214, 140], [210, 124], [222, 112], [229, 104]], o({ stroke: CYAN, strokeWidth: 0.7, roughness: 0.6 })));
    handCircle(213, 170, 13, { fill: NAVY, passes: 2 }); dot(213, 170, 1.8);
    handCircle(204, 126, 11, { fill: NAVY, passes: 2 }); dot(204, 126, 1.6);
    handCircle(232, 106, 7, { fill: NAVY });
    add(gen.arc(249, 106, 6, 10, -Math.PI / 3, Math.PI / 3, false, o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.5 })));
    add(gen.arc(249, 106, 11, 17, -Math.PI / 3, Math.PI / 3, false, o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.5 })));
  }
  function gear(cx, cy, r = 6.5, teeth = 8) { const pts = []; for (let i = 0; i < teeth * 2; i++) { const a1 = i / (teeth * 2) * Math.PI * 2, a2 = (i + 1) / (teeth * 2) * Math.PI * 2, rr = i % 2 ? r : r + 2.6; pts.push([cx + rr * Math.cos(a1), cy + rr * Math.sin(a1)], [cx + rr * Math.cos(a2), cy + rr * Math.sin(a2)]); } knock(cx - r - 3, cy - r - 3, 2 * r + 6, 2 * r + 6, 6); add(gen.polygon(pts, o({ strokeWidth: 0.8, roughness: 0.6 }))); handCircle(cx, cy, r * 0.8, { stroke: CYAN, sw: 0.8 }); }
  const g = (t) => out.push(`<g transform="${t}">`), gend = () => out.push('</g>');

  function mail(cx, cy, w = 22, h = 15) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 4);
    rect(x, y, w, h);
    add(gen.linearPath([[x + 1, y + 1.5], [cx, cy + 1.5], [x + w - 1, y + 1.5]], o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.3 })));
    return { x, y, w, h };
  }
  function doc(cx, cy, w = 17, h = 21) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 4, h + 4);
    add(gen.polygon([[x, y], [x + w - 5, y], [x + w, y + 5], [x + w, y + h], [x, y + h]], o({ roughness: 0.7 })));
    add(gen.linearPath([[x + w - 5, y], [x + w - 5, y + 5], [x + w, y + 5]], o({ strokeWidth: 0.6, roughness: 0.3 })));
    for (let i = 0; i < 4; i++) line(x + 3, y + 8 + i * 3, x + w - (i === 3 ? 7 : 3), y + 8 + i * 3, { strokeWidth: 0.55, roughness: 0.2, stroke: i === 0 ? CYAN : INK });
    return { x, y, w, h };
  }
  function battery(cx, cy, w = 20, h = 11) {
    const x = cx - w / 2, y = cy - h / 2;
    knock(x - 2, y - 2, w + 6, h + 4);
    rect(x, y, w, h); rect(x + w, cy - 2, 2.5, 4, { strokeWidth: 0.6 });
    for (let i = 0; i < 3; i++) add(gen.rectangle(x + 2 + i * 5.5, y + 2, 4, h - 4, o({ stroke: CYAN, fill: CYAN, fillStyle: 'solid', roughness: 0.3, strokeWidth: 0.4 })));
    return { x, y, w, h };
  }
  return { mail, doc, battery, robotArm, gear, g, gend, gen, out, o, add, handCircle, dot, knock, line, rect, DASH, INK, CYAN, NAVY,
    embeddedPC, containers, camera, plc, gauge, miniArm, aiChip, inspectionRobot, codeWin, wifi };
};
