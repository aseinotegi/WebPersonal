require('fs').mkdirSync(require('path').join(__dirname, '..', 'build', 'marca'), { recursive: true });
const fs = require('fs');
const L = require('../lib.js')(7);
const { gen, out, o, add, handCircle, dot, knock, line, DASH, INK, CYAN, NAVY } = L;
const W = 336, H = 192, S = 4, preview = process.argv.includes('--preview');
const dots = [];
for (let x = 186; x <= 330; x += 12) for (let y = 8; y <= 186; y += 12) dots.push(`<circle cx="${x}" cy="${y}" r="0.45" fill="${INK}" opacity="0.18"/>`);

// ---- links (drawn first, icons knock them out) ----
line(239, 24, 271, 34, { strokeWidth: 0.75 });                 // containers - PC  (MQTT)
line(276, 49, 254, 58, { strokeWidth: 0.75 });                 // PC - PLC (OPC UA)
line(300, 49, 309, 57, { strokeWidth: 0.75 });                 // PC - camera
line(303, 30, 340, 12, { strokeWidth: 0.75 });                 // -> back (y=12)
line(327, 63, 340, 64, { strokeWidth: 0.75 });                 // -> back (y=64)
line(222, 31, 240, 54, { strokeWidth: 0.6 }, DASH);           // containers - PLC mesh
// data link PLC -> robot wrist
add(gen.curve([[244, 71], [238, 81], [233, 91], [232, 99]], o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.4 })), 'stroke-dasharray="1.6 2.8"');
// bottom cable gear -> back (y=180)
line(249, 180, 340, 180, { strokeWidth: 0.7, roughness: 1.2 }, DASH);

// ---- robot arm (as before) ----
line(176, 190, 250, 189.5, { strokeWidth: 0.7, roughness: 1.2 });
add(gen.polygon([[197, 190], [229, 190], [224, 179], [202, 179]], o({ fill: INK, fillStyle: 'hachure', hachureGap: 2.2, hachureAngle: -41, fillWeight: 0.45 })));
add(gen.ellipse(213, 178.5, 28, 7, o({})));
function link(x1, y1, x2, y2, w, opts) { const dx = x2 - x1, dy = y2 - y1, Ln = Math.hypot(dx, dy), nx = -dy / Ln * w / 2, ny = dx / Ln * w / 2; add(gen.polygon([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], o(opts))); }
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
(function gear(cx, cy, r, teeth) { const pts = []; for (let i = 0; i < teeth * 2; i++) { const a1 = i / (teeth * 2) * Math.PI * 2, a2 = (i + 1) / (teeth * 2) * Math.PI * 2, rr = i % 2 ? r : r + 2.6; pts.push([cx + rr * Math.cos(a1), cy + rr * Math.sin(a1)], [cx + rr * Math.cos(a2), cy + rr * Math.sin(a2)]); } knock(cx - r - 3, cy - r - 3, 2 * r + 6, 2 * r + 6, 6); add(gen.polygon(pts, o({ strokeWidth: 0.8, roughness: 0.6 }))); handCircle(cx, cy, r * 0.8, { stroke: CYAN, sw: 0.8 }); })(241, 178, 6.5, 8);

// ---- icons ----
L.containers(224, 23, 30);
L.embeddedPC(288, 38, 34, 22);
line(276, 28, 275, 17, { strokeWidth: 0.7 }); L.wifi(275, 14);
L.plc(244, 62, 20, 16);
L.camera(316, 61, 23, 13);

// label knockouts (text added in Canva)
const LABELS = { MQTT: [243, 15, 22], 'OPC UA': [258, 59, 28] };
for (const k in LABELS) { const [x, y, w] = LABELS[k]; knock(x, y, w, 8); }

const lbl = preview ? Object.entries(LABELS).map(([t, [x, y, w]]) => `<text x="${x + w / 2}" y="${y + 6}" fill="#B6C4D8" font-family="DejaVu Sans" font-style="italic" font-weight="700" font-size="5.6" text-anchor="middle">${t}</text>`).join('') : '';
const ph = preview ? `<rect width="${W}" height="${H}" fill="${NAVY}"/>
  <rect x="24" y="22" width="150" height="8" fill="#22D3EE" opacity=".35"/><rect x="23" y="33" width="125" height="28" fill="#fff" opacity=".35"/>
  <rect x="24" y="66" width="150" height="10" fill="#22D3EE" opacity=".35"/><rect x="24" y="102" width="160" height="46" fill="#fff" opacity=".2"/>
  <rect x="252" y="77" width="72" height="8" fill="#22D3EE" opacity=".35"/><rect x="252" y="90" width="72" height="72" rx="10" fill="#22D3EE" opacity=".25"/><rect x="255" y="93" width="66" height="66" rx="8" fill="#fff"/>` : '';
fs.writeFileSync(preview ? require('path').join(__dirname, '..', 'build', 'marca', 'f2_preview.svg') : require('path').join(__dirname, '..', 'build', 'marca', 'f2.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}">${ph}<g>${dots.join('')}</g><g>${out.join('\n')}</g>${lbl}</svg>`);
console.log(JSON.stringify(LABELS));
