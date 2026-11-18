// World v3: photo -> MQTT -> edge PC + containers + vision model -> alarm -> robot closes the valve -> data lake -> dashboard
const make = require('../lib.js');

const post = (body) => body
  .replace(/stroke-width="([\d.]+)"/g, (m, v) => `stroke-width="${(v * 2.1).toFixed(2)}"`)
  .replace(/stroke-dasharray="([\d. ]+)"/g, (m, v) => `stroke-dasharray="${v.split(' ').map((n) => (n * 2.2).toFixed(1)).join(' ')}"`)
  .replace(/-?\d+\.\d{2,}/g, (m) => (+m).toFixed(1));

module.exports = function world() {
  const W = 1240, H = 2140, BOT_Y = 420, BOT_K = 4, BOT_X = 560;
  const AMBER = '#F5A524';
  const L = make(97);
  const { line, add, gen, o, CYAN, INK } = L;
  const txt = [], badges = [];
  const T = (x, y, s, cls = 'wc', anchor = 'middle') => txt.push(`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`);
  const big = (k, x, y, draw) => { L.g(`translate(${x} ${y}) scale(${k})`); draw(); L.gend(); };
  const protoTag = (s, x, y) => { const w = s.length * 7.8 + 16; L.knock(x - w / 2, y - 11, w, 21, 6); txt.push(`<text x="${x}" y="${y + 4.5}" class="wp" text-anchor="middle">${s}</text>`); };
  const badge = (id, x, y, s, cls = '') => { const w = s.length * 8.6 + 26; badges.push(`<g class="badge ${cls}" id="${id}" transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-16" width="${w}" height="32" rx="8"/><text y="5" text-anchor="middle">${s}</text></g>`); };

  const R = [BOT_X + 4 * BOT_K, BOT_Y - 10.5 * BOT_K];   // robot camera (576, 378)
  const WHEEL = [690, 340];
  const HUB = [600, 1560], RULES = [930, 1545];
  const P = { bot: R, pc: [760, 860], cont: [470, 860], vis: [600, 1296], uns: [600, 1498], plc: [262, 1560], dec: RULES, wheel: [WHEEL[0] - 6, WHEEL[1]], pt: [262, 336], dash: [758, 1965] };
  const route = [
    P.bot, [620, 520], [700, 700], P.pc,
    [640, 860], P.cont,
    [520, 980], [615, 1030], [640, 1140], P.vis,
    [600, 1400], P.uns,
    [652, 1528], [780, 1545], P.dec,
    [1060, 1420], [1150, 1260], [1170, 900], [1090, 470], [800, 320], P.wheel,
    [480, 326], P.pt,
    [263, 900], [262, 1500], P.plc,
    [430, 1572], [540, 1570], [580, 1650], [600, 1760], [660, 1900], P.dash,
  ];
  // second packet: the PLC value travelling to the hub and on to the rule engine
  const route2 = [P.plc, [400, 1562], [538, 1562], [600, 1622], [700, 1588], [800, 1582], [RULES[0], RULES[1] + 32]];
  const at = (pt) => route.findIndex((q) => q === pt);

  // ---- ruler ----
  line(84, 40, 84, 2080, { strokeWidth: 0.5, roughness: 0.4 }, 'stroke-dasharray="4 7"');
  for (const [y, s] of [[150, 'PLANTA'], [790, 'EDGE'], [1150, 'VISIÓN'], [1500, 'UNS'], [1790, 'DASHBOARD']]) { L.dot(84, y, 4.5); T(100, y + 5, s, 'wr', 'start'); }

  // ---- cables along the route ----
  const seg = (a, b, opt = {}, extra = '') => add(gen.curve(route.slice(a, b + 1), o(Object.assign({ strokeWidth: 0.85, roughness: 0.5 }, opt))), extra);
  seg(0, at(P.pc));
  seg(at(P.pc), at(P.cont));
  seg(at(P.cont), at(P.vis));
  const curve = (pts, opt = {}, extra = '') => add(gen.curve(pts, o(Object.assign({ strokeWidth: 0.85, roughness: 0.5 }, opt))), extra);
  curve([[600, 1340], [600, 1420], P.uns]);                                   // vision -> UNS
  curve([P.plc, [400, 1562], [538, 1562]]);                                   // PLC -> UNS
  curve([[656, 1536], [780, 1545], [RULES[0], RULES[1]]], { stroke: CYAN, strokeWidth: 0.75 });      // UNS -> rules (vision)
  curve([[656, 1588], [800, 1582], [RULES[0], RULES[1] + 32]], { strokeWidth: 0.75 });            // UNS -> rules (PLC)
  curve([[1040, 1500], [1060, 1420], [1150, 1260], [1170, 900], [1090, 470], [800, 320], P.wheel],
        { stroke: CYAN, strokeWidth: 0.75 }, 'stroke-dasharray="3 6"');   // rule result -> robot
  curve([[600, 1620], [600, 1760], [610, 1800]]);                             // UNS -> dashboard
  for (const pts of [[[526, 1555], [538, 1562], [526, 1569]], [[593, 1482], [600, 1494], [607, 1482]],
                     [[RULES[0] - 12, RULES[1] - 7], [RULES[0], RULES[1]], [RULES[0] - 12, RULES[1] + 7]],
                     [[RULES[0] - 12, RULES[1] + 25], [RULES[0], RULES[1] + 32], [RULES[0] - 12, RULES[1] + 39]],
                     [[603, 1788], [610, 1800], [617, 1788]]]) add(gen.linearPath(pts, o({ strokeWidth: 0.8 })));
  protoTag('MQTT', 640, 610); protoTag('MQTT · ORDEN', 1170, 1100); protoTag('S7 → MQTT', 400, 1600);
  T(780, 1534, '6,8 · visión', 'wcs');
  T(860, 1606, '6,7 · PLC', 'wd');

  // ---- plant ----
  for (const y of [250, 292]) line(110, y, 1180, y + (y === 250 ? 1 : -1), { strokeWidth: 1.1, roughness: 1.4 });
  for (const x of [196, 900, 1060]) { line(x, 242, x, 300, { strokeWidth: 0.9 }); line(x + 8, 242, x + 8, 300, { strokeWidth: 0.9 }); }
  for (const x of [330, 960]) { add(gen.linearPath([[x, 271], [x + 26, 271]], o({ stroke: CYAN, strokeWidth: 0.7 }))); add(gen.linearPath([[x + 18, 265], [x + 26, 271], [x + 18, 277]], o({ stroke: CYAN, strokeWidth: 0.7 }))); }
  // manometer PI-104
  line(520, 222, 520, 250, { strokeWidth: 1 });
  big(3.2, 520, 172, () => L.gauge(0, 0, 17));
  T(520, 112, 'PI-104 · LOCAL', 'wd');
  // pressure transmitter PT-104, wired to the PLC (4-20 mA)
  line(262, 292, 262, 318, { strokeWidth: 1 });
  L.knock(240, 316, 44, 36, 6);
  L.rect(244, 320, 36, 28, { strokeWidth: 0.9, roughness: 0.5 });
  T(262, 339, 'PT', 'wc');
  T(290, 340, 'PT-104', 'wd', 'start');
  line(262, 352, 262, 1512, { strokeWidth: 0.6, roughness: 0.5, stroke: CYAN }, 'stroke-dasharray="2 6"');
  T(274, 1010, '4-20 mA', 'wds', 'start');
  // branch with the valve (llave)
  line(712, 292, 712, 404, { strokeWidth: 1 }); line(728, 292, 728, 404, { strokeWidth: 1 }); line(706, 404, 734, 404, { strokeWidth: 1.2 });
  add(gen.polygon([[708, 318], [732, 318], [714, 340], [726, 340]], o({ strokeWidth: 0.8 })));
  add(gen.polygon([[714, 340], [726, 340], [708, 362], [732, 362]], o({ strokeWidth: 0.8 })));
  line(706, 340, 690, 340, { strokeWidth: 1 });
  T(760, 344, 'XV-104 · MANUAL', 'wd', 'start');
  // floor
  line(110, 482, 1180, 481, { strokeWidth: 0.8, roughness: 1.2 });
  line(150, 498, 1150, 498, { strokeWidth: 0.5, roughness: 0.6 }, 'stroke-dasharray="6 10"');
  // camera flash
  badges.push(`<polygon class="badge flash" id="b-flash" points="${R[0]},${R[1]} 484,146 558,146"/>`);

  // ---- edge: industrial PC, containers, vision model ----
  big(3.6, 760, 860, () => { L.embeddedPC(0, 0, 34, 22); L.line(-11, -11, -12, -19, { strokeWidth: 0.7 }); L.wifi(-12, -22); });
  T(760, 930, 'PC INDUSTRIAL');
  big(3.4, 470, 854, () => L.containers(0, 0, 28));
  T(470, 932, 'CONTENEDORES');
  line(470, 900, 470, 925, { strokeWidth: 0.5 });
  big(3.2, 615, 1030, () => L.aiChip(0, 0, 15));
  T(615, 1100, 'MODELO DE VISIÓN', 'wcs');
  line(760, 885, 640, 1015, { strokeWidth: 0.6 }, 'stroke-dasharray="4 6"');
  // dashed box: everything runs on the PC
  L.rect(380, 790, 470, 330, { strokeWidth: 0.5, roughness: 0.6, stroke: '#5B6E8C' });
  T(392, 812, 'EN EL PC INDUSTRIAL', 'wd', 'start');

  // ---- vision result on the photo ----
  const fx = 440, fy = 1130, fw = 320, fh = 210;
  L.knock(fx - 6, fy - 6, fw + 12, fh + 12, 8);
  L.rect(fx, fy, fw, fh, { strokeWidth: 1, roughness: 0.8 });
  line(fx + 10, fy + 150, fx + fw - 10, fy + 151, { strokeWidth: 0.8, roughness: 1 }); line(fx + 10, fy + 176, fx + fw - 10, fy + 175, { strokeWidth: 0.8, roughness: 1 });
  line(600, fy + 128, 600, fy + 150, { strokeWidth: 0.9 });
  big(2.6, 600, fy + 92, () => L.gauge(0, 0, 17));
  L.rect(552, 1186, 96, 106, { stroke: CYAN, strokeWidth: 0.9, roughness: 0.4 });
  T(552, 1178, 'MANÓMETRO · conf. 0,98', 'wcs', 'start');
  T(664, 1222, 'LECTURA', 'wds', 'start');
  T(664, 1256, '6,8 bar', 'wbig', 'start');
  T(fx + 12, fy + fh - 10, 'IMG_0412 · PI-104', 'wd', 'start');

  // ---- Unified Namespace: the hub every source publishes to ----
  L.knock(HUB[0] - 66, HUB[1] - 66, 132, 132, 66);
  L.handCircle(HUB[0], HUB[1], 60, { passes: 2, sw: 1 });
  L.handCircle(HUB[0], HUB[1], 44, { sw: 0.5 });
  T(HUB[0], HUB[1] + 7, 'UNS', 'wq');
  const topics = [['planta1/exterior/', 'wc'], ['  pi-104/presion  6,8', 'wd'], ['  pt-104/presion  6,7', 'wd'],
                  ['  xv-104/orden    cerrar', 'wd'], ['planta2/ · planta3/ …', 'wds']];
  L.knock(640, 1622, 236, 128, 8);
  topics.forEach(([t, cls], i) => T(648, 1642 + i * 23, t.replace(/ /g, '\u00a0'), cls, 'start'));

  // ---- PLC that receives PT-104 ----
  L.knock(218, 1512, 92, 120, 8);
  big(3, P.plc[0], P.plc[1], () => L.plc(0, 0, 21, 16));
  T(P.plc[0], 1626, 'PLC', 'wcs');

  // ---- rule engine: a service subscribed to the UNS ----
  const rx = RULES[0], ry = RULES[1] - 40;
  L.knock(rx - 6, ry - 6, 232, 148, 10);
  L.rect(rx, ry, 220, 136, { strokeWidth: 1, roughness: 0.7 });
  line(rx, ry + 28, rx + 220, ry + 28, { strokeWidth: 0.6, roughness: 0.3 });
  T(rx + 12, ry + 19, 'MOTOR DE REGLAS', 'wc', 'start');
  T(rx + 12, ry + 54, 'si visión &gt; 6 bar', 'wd', 'start');
  T(rx + 12, ry + 78, 'y PLC &gt; 6 bar', 'wd', 'start');
  T(rx + 12, ry + 110, '→ cerrar XV-104', 'wq', 'start');

  // ---- dashboard: the peak and its resolution ----
  const dx = 420, dy = 1800, dw = 360, dh = 210;
  L.knock(dx - 6, dy - 6, dw + 12, dh + 12, 10);
  L.rect(dx, dy, dw, dh, { strokeWidth: 1, roughness: 0.8 });
  line(dx, dy + 30, dx + dw, dy + 30, { strokeWidth: 0.6, roughness: 0.3 });
  L.dot(dx + 16, dy + 15, 3.5); L.dot(dx + 30, dy + 15, 3.5, INK); L.dot(dx + 44, dy + 15, 3.5, INK);
  T(dx + 22, dy + 60, 'PT-104 · PRESIÓN (PLC)', 'wd', 'start');
  T(dx + 22, dy + 94, '4,2 bar', 'wbig', 'start');
  T(dx + 338, dy + 60, 'ALARMA CERRADA ✓', 'wcs', 'end');
  line(dx + 22, dy + 116, dx + 338, dy + 116, { strokeWidth: 0.5, roughness: 0.2, stroke: AMBER }, 'stroke-dasharray="5 6"');
  T(dx + 22, dy + 110, '6 bar', 'wd', 'start');
  line(dx + 236, dy + 84, dx + 236, dy + 196, { strokeWidth: 0.5, roughness: 0.2 }, 'stroke-dasharray="3 5"');
  T(dx + 242, dy + 194, 'XV-104 cerrada', 'wds', 'start');
  add(gen.linearPath([[dx + 22, dy + 166], [dx + 70, dy + 160], [dx + 110, dy + 168], [dx + 150, dy + 156], [dx + 178, dy + 128], [dx + 204, dy + 98], [dx + 222, dy + 104], [dx + 244, dy + 140], [dx + 268, dy + 162], [dx + 300, dy + 168], [P.dash[0], P.dash[1] - dy + dy]], o({ stroke: CYAN, strokeWidth: 1, roughness: 0.4 })));
  L.dot(dx + 204, dy + 98, 5, AMBER);
  T(dx + 204, dy + 86, 'pico 6,8 bar', 'wa');
  line(dx + 150, dy + dh, dx + 150, dy + dh + 28, { strokeWidth: 1 }); line(dx + 210, dy + dh, dx + 210, dy + dh + 28, { strokeWidth: 1 });
  line(dx + 110, dy + dh + 30, dx + 250, dy + dh + 30, { strokeWidth: 1.2 });

  badge('b-photo', 520, 70, 'foto · PI-104');
  badge('b-alarm', RULES[0] + 110, RULES[1] - 70, 'ALARMA CONFIRMADA', 'alarm');
  badge('b-valve', 760, 400, 'XV-104 cerrada ✓');

  // ---- handwheel (rotated by script) ----
  const HW = make(41);
  HW.handCircle(WHEEL[0], WHEEL[1], 30, { fill: '#060D1B', passes: 2, sw: 0.9 });
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; HW.line(WHEEL[0], WHEEL[1], WHEEL[0] + Math.cos(a) * 14, WHEEL[1] + Math.sin(a) * 14, { strokeWidth: 0.8, roughness: 0.3 }); }
  HW.dot(WHEEL[0], WHEEL[1], 3);

  // ---- robot + small arm (arm in robot-local units; pivot at (8,2), gripper at (28.5,-20)) ----
  const RB = make(29);
  RB.inspectionRobot(0, 0, 27);
  const AR = make(33);
  AR.line(8, 2, 16, -14, { strokeWidth: 1.2, roughness: 0.4 });
  AR.line(16, -14, 27, -19.4, { strokeWidth: 1.1, roughness: 0.4 });
  AR.handCircle(16, -14, 2.6, { fill: '#060D1B', sw: 0.7 });
  AR.handCircle(8, 2, 3, { fill: '#060D1B', sw: 0.7 }); AR.dot(8, 2, 0.8);
  AR.line(27, -19.4, 29.6, -21.6, { strokeWidth: 0.8, roughness: 0.2, stroke: CYAN });
  AR.line(27, -19.4, 29.8, -17.6, { strokeWidth: 0.8, roughness: 0.2, stroke: CYAN });

  return {
    W, H, P, route, route2, BOT_Y, BOT_K, BOT_X, WHEEL,
    svg: `<g class="ink">${post(L.out.join(''))}</g>${txt.join('')}<g id="wheel" class="ink">${post(HW.out.join(''))}</g>${badges.join('')}`,
    bot: `${post(RB.out.join(''))}<g id="arm" class="ink">${post(AR.out.join(''))}</g>`,
  };
};
