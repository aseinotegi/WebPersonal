require('fs').mkdirSync(require('path').join(__dirname, '..', 'build', 'marca'), { recursive: true });
const fs = require('fs');
const L = require('../lib.js')(21);
const { gen, out, o, add, handCircle, dot, knock, line, DASH, INK, CYAN, NAVY } = L;
const W = 336, H = 192, S = 4, preview = process.argv.includes('--preview');
const dots = [];
for (let x = 6; x <= 330; x += 12) for (let y = 6; y <= 186; y += 12) dots.push(`<circle cx="${x}" cy="${y}" r="0.45" fill="${INK}" opacity="0.14"/>`);

const HUB = [168, 82], HR = 30;
const N = {
  plc: [58, 36], docker: [122, 25], sensor: [36, 95], vision: [100, 128],
  robot: [220, 23], ia: [292, 44], amr: [284, 104], python: [240, 128],
};
// entries from the front (same heights as the front's exits)
line(-4, 12, 47, 31, { strokeWidth: 0.75 });
line(-4, 64, 28, 89, { strokeWidth: 0.75 });
line(-4, 180, 88, 131, { strokeWidth: 0.7, roughness: 1.2 }, DASH);
// exits on the right
line(300, 40, 340, 26, { strokeWidth: 0.6 }, DASH);
line(297, 108, 340, 150, { strokeWidth: 0.6 }, DASH);
// spokes
for (const k in N) { const [x, y] = N[k], dx = x - HUB[0], dy = y - HUB[1], d = Math.hypot(dx, dy); line(HUB[0] + dx / d * (HR + 3), HUB[1] + dy / d * (HR + 3), x, y, { strokeWidth: 0.75 }); }
// mesh
const mesh = [['plc', 'docker'], ['plc', 'sensor'], ['sensor', 'vision'], ['robot', 'ia'], ['amr', 'python'], ['ia', 'amr']];
for (const [a, b] of mesh) line(...N[a], ...N[b], { strokeWidth: 0.55 }, DASH);

// hub
add(gen.arc(HUB[0], HUB[1], 82, 82, -0.3, 1.9, false, o({ stroke: CYAN, strokeWidth: 0.6, roughness: 0.4 })), DASH);
add(gen.arc(HUB[0], HUB[1], 82, 82, 2.4, 4.9, false, o({ stroke: CYAN, strokeWidth: 0.6, roughness: 0.4 })), DASH);
handCircle(HUB[0], HUB[1], HR * 2, { fill: NAVY, stroke: CYAN, sw: 1.2, passes: 2, wob: 0.35 });

// icons
L.plc(...N.plc, 21, 16);
L.containers(N.docker[0], N.docker[1] + 1, 28);
L.gauge(N.sensor[0], N.sensor[1] - 1, 17);
L.camera(...N.vision, 23, 13);
L.miniArm(...N.robot, 26);
L.aiChip(...N.ia, 15);
L.inspectionRobot(N.amr[0], N.amr[1], 27);
L.codeWin(...N.python, 24, 17);

// labels under icons + protocol labels on spokes (knockouts; text set in Canva)
const cw = (t, k = 4.3) => Math.round(t.length * k + 5);
const LBL = {
  PLC: [58, 47], DOCKER: [122, 37], SENSORES: [36, 109], 'VISIÓN': [100, 141],
  'ROBÓTICA': [220, 41], IA: [292, 57], 'ROBOT AUTÓNOMO': [284, 120], PYTHON: [240, 140],
};
const PROTO = {};
const spokeMid = (k, t) => { const [x, y] = N[k], dx = x - HUB[0], dy = y - HUB[1], d = Math.hypot(dx, dy); const a = HR + 3, b = d - 13; const m = (a + b) / 2; return [HUB[0] + dx / d * m, HUB[1] + dy / d * m]; };
for (const [k, t] of [['plc', 'PROFINET'], ['sensor', 'MODBUS'], ['amr', 'ROS 2'], ['python', 'REST']]) PROTO[t] = spokeMid(k, t);
const boxes = { labels: {}, proto: {} };
for (const t in LBL) { const w = cw(t), [cx, y] = LBL[t]; knock(cx - w / 2, y, w, 8.5); boxes.labels[t] = [Math.round((cx - w / 2) * 10) / 10, y, w]; }
for (const t in PROTO) { const w = cw(t, 3.9), [cx, cy] = PROTO[t]; knock(cx - w / 2, cy - 4, w, 8); boxes.proto[t] = [Math.round((cx - w / 2) * 10) / 10, Math.round((cy - 4) * 10) / 10, w]; }

add(gen.curve([[148, 180], [156, 178.5], [164, 180.5], [172, 178.5], [180, 180], [188, 178.8]], o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.3 })));

const txt = (t, x, y, w, it) => `<text x="${x + w / 2}" y="${y + 6.2}" fill="${it ? '#B6C4D8' : CYAN}" font-family="DejaVu Sans" ${it ? 'font-style="italic"' : ''} font-weight="700" font-size="5.6" text-anchor="middle">${t}</text>`;
const lbl = preview ? Object.entries(boxes.labels).map(([t, [x, y, w]]) => txt(t, x, y, w)).join('') + Object.entries(boxes.proto).map(([t, [x, y, w]]) => txt(t, x, y, w, 1)).join('')
  + `<text x="168" y="89" fill="#fff" font-family="DejaVu Sans" font-weight="700" font-size="20" text-anchor="middle">AS</text><text x="168" y="170" fill="#B6C4D8" font-family="DejaVu Sans" font-style="italic" font-size="8.5" text-anchor="middle">Del sensor al dato, del dato a la decisión.</text>` : '';
const ph = preview ? `<rect width="${W}" height="${H}" fill="${NAVY}"/>` : '';
fs.writeFileSync(preview ? require('path').join(__dirname, '..', 'build', 'marca', 'b2_preview.svg') : require('path').join(__dirname, '..', 'build', 'marca', 'b2.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}">${ph}<g>${dots.join('')}</g><g>${out.join('\n')}</g>${lbl}</svg>`);
console.log(JSON.stringify(boxes));
