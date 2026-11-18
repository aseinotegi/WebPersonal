require('fs').mkdirSync(require('path').join(__dirname, '..', 'build', 'marca'), { recursive: true });
// LinkedIn banner (1584x396) and 16:9 background (1920x1080) in the card's hand-drawn style
const fs = require('fs');
const make = require('../lib.js');
const SOFT = '#B6C4D8';

function grid(W, H, step = 12) {
  const d = [];
  for (let x = 6; x <= W; x += step) for (let y = 6; y <= H; y += step) d.push(`<circle cx="${x}" cy="${y}" r="0.45" fill="#E6EDF7" opacity="0.13"/>`);
  return d.join('');
}
function proto(L, t, cx, cy, size = 6.2) {
  const w = t.length * size * 0.62 + 5;
  L.knock(cx - w / 2, cy - size * 0.75, w, size * 1.35);
  L.out.push(`<text x="${cx}" y="${cy + size * 0.35}" fill="${SOFT}" font-family="Inter" font-weight="700" font-style="italic" font-size="${size}" text-anchor="middle">${t}</text>`);
}
function label(L, t, cx, y, size = 6.2) {
  const w = t.length * size * 0.66 + 5;
  L.knock(cx - w / 2, y, w, size * 1.4);
  L.out.push(`<text x="${cx}" y="${y + size * 1.02}" fill="${L.CYAN}" font-family="Inter" font-weight="700" font-size="${size}" text-anchor="middle" letter-spacing="${size * 0.06}">${t}</text>`);
}
const svgDoc = (W, H, PW, PH, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${PH}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#060D1B"/>${body}</svg>`;

// ---------------- LinkedIn banner ----------------
(function banner() {
  const W = 792, H = 198, L = make(31);
  const { line, DASH, CYAN, add, gen, o } = L;
  const N = { chip: [70, 46], gauge: [140, 88], cont: [212, 36], pc: [296, 70], plc: [392, 48], cam: [378, 134], code: [232, 144], amr: [160, 152] };
  // exits / entries
  line(-4, 22, 62, 42, { strokeWidth: 0.75 });
  line(-4, 74, 130, 86, { strokeWidth: 0.75 });
  line(310, 58, 332, -4, { strokeWidth: 0.6 }, DASH);
  line(382, 140, 420, 202, { strokeWidth: 0.6 }, DASH);
  // links
  const E = [['chip', 'gauge'], ['gauge', 'cont'], ['cont', 'pc'], ['pc', 'plc'], ['pc', 'cam'], ['pc', 'code'], ['code', 'amr']];
  for (const [a, b] of E) line(...N[a], ...N[b], { strokeWidth: 0.75 });
  for (const [a, b] of [['gauge', 'amr'], ['chip', 'cont'], ['plc', 'cam']]) line(...N[a], ...N[b], { strokeWidth: 0.55 }, DASH);
  // data link PLC -> robot wrist (arm translated +255)
  add(gen.curve([[396, 57], [430, 72], [466, 90], [484, 102]], o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.4 })), 'stroke-dasharray="1.6 2.8"');
  // arm + gear
  L.g('translate(255 0)'); L.robotArm(); L.gear(241, 178); L.gend();
  // icons
  L.aiChip(...N.chip, 15); L.gauge(N.gauge[0], N.gauge[1] - 1, 17); L.containers(N.cont[0], N.cont[1], 28);
  L.embeddedPC(...N.pc, 34, 22); L.line(285, 59, 284, 51, { strokeWidth: 0.7 }); L.wifi(284, 48);
  L.plc(...N.plc, 20, 16); L.camera(...N.cam, 23, 13); L.codeWin(...N.code, 24, 17); L.inspectionRobot(N.amr[0], N.amr[1], 27);
  // protocol labels
  proto(L, 'MQTT', 254, 50); proto(L, 'OPC UA', 344, 56); proto(L, 'REST', 264, 107); proto(L, 'ROS 2', 196, 148); proto(L, 'MODBUS', 176, 62);
  // text block
  const X = 534;
  const txt = `
  <text x="${X}" y="64" fill="${CYAN}" font-family="Inter" font-weight="700" font-size="7" letter-spacing="1.3">IIoT · OT/IT · ROBÓTICA AUTÓNOMA · IA</text>
  <text x="${X - 1}" y="93" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="18.5">Conectando máquinas,</text>
  <text x="${X - 1}" y="116" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="18.5">datos y <tspan fill="${CYAN}">robots.</tspan></text>
  <text x="${X}" y="142" fill="${SOFT}" font-family="Inter" font-weight="400" font-style="italic" font-size="8.6">Del sensor al dato, del dato a la decisión.</text>`;
  add(gen.curve([[X, 126], [X + 8, 124.5], [X + 16, 126.5], [X + 24, 124.5], [X + 32, 126], [X + 40, 124.8]], o({ stroke: CYAN, strokeWidth: 0.9, roughness: 0.3 })));
  fs.writeFileSync(require('path').join(__dirname, '..', 'build', 'marca', 'banner.svg'), svgDoc(W, H, 1584, 396, grid(W, H) + `<g>${L.out.join('\n')}</g>` + txt));
})();

// ---------------- 16:9 background ----------------
(function wall() {
  const W = 640, H = 360, L = make(43);
  const { line, DASH, CYAN, add, gen, o } = L;
  const N = { cont: [236, 42], pc: [330, 56], plc: [432, 36], chip: [532, 62], cam: [596, 128], gauge: [560, 196], amr: [588, 272], code: [500, 300] };
  line(-4, 150, 40, 120, { strokeWidth: 0.6 }, DASH);
  line(N.plc[0], N.plc[1], 470, -4, { strokeWidth: 0.6 }, DASH);
  line(N.chip[0], N.chip[1], 644, 30, { strokeWidth: 0.75 });
  line(N.amr[0], N.amr[1], 644, 330, { strokeWidth: 0.6 }, DASH);
  line(N.cont[0], N.cont[1], 190, -4, { strokeWidth: 0.75 });
  const E = [['cont', 'pc'], ['pc', 'plc'], ['plc', 'chip'], ['chip', 'cam'], ['cam', 'gauge'], ['gauge', 'amr'], ['amr', 'code']];
  for (const [a, b] of E) line(...N[a], ...N[b], { strokeWidth: 0.75 });
  for (const [a, b] of [['pc', 'chip'], ['cam', 'amr'], ['gauge', 'code']]) line(...N[a], ...N[b], { strokeWidth: 0.55 }, DASH);
  // data link hub -> gripper (arm scaled 1.6, gripper ~ (138,218))
  add(gen.curve([[318, 68], [260, 120], [190, 180], [150, 214]], o({ stroke: CYAN, strokeWidth: 0.8, roughness: 0.4 })), 'stroke-dasharray="1.6 2.8"');
  L.g('translate(-258 48) scale(1.6)'); L.robotArm(); L.gear(241, 178); L.gend();
  L.g(`translate(${N.cont[0]} ${N.cont[1]}) scale(1.35) translate(${-N.cont[0]} ${-N.cont[1]})`); L.containers(N.cont[0], N.cont[1], 28); L.gend();
  L.g(`translate(${N.pc[0]} ${N.pc[1]}) scale(1.35) translate(${-N.pc[0]} ${-N.pc[1]})`); L.embeddedPC(...N.pc, 34, 22); L.line(319, 45, 318, 37, { strokeWidth: 0.7 }); L.wifi(318, 34); L.gend();
  const big = (fn, k, ...a) => { const [x, y] = [a[0], a[1]]; L.g(`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`); fn(...a); L.gend(); };
  big(L.plc, 1.35, ...N.plc, 20, 16); big(L.aiChip, 1.35, ...N.chip, 15); big(L.camera, 1.35, ...N.cam, 23, 13);
  big(L.gauge, 1.35, N.gauge[0], N.gauge[1], 17); big(L.inspectionRobot, 1.45, N.amr[0], N.amr[1], 27); big(L.codeWin, 1.35, ...N.code, 24, 17);
  proto(L, 'MQTT', 283, 49, 7.5); proto(L, 'OPC UA', 381, 46, 7.5); proto(L, 'ROS 2', 545, 287, 7.5); proto(L, 'MODBUS', 578, 162, 7.5);
  const X = 26;
  const txt = `
  <text x="${X}" y="44" fill="${CYAN}" font-family="Inter" font-weight="700" font-size="7.5" letter-spacing="1.4">IIoT · ROBÓTICA · IA</text>
  <text x="${X - 1}" y="72" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="25">Ander Sein</text>
  <text x="${X}" y="88" fill="${CYAN}" font-family="Inter" font-weight="700" font-size="9.5">Automatización e integración IIoT</text>
  <text x="${X}" y="101" fill="${SOFT}" font-family="Inter" font-style="italic" font-size="8">Conectando máquinas, datos y robots.</text>
  <text x="614" y="344" fill="${SOFT}" font-family="Inter" font-style="italic" font-size="8" text-anchor="end">Del sensor al dato, del dato a la decisión.</text>`;
  L.line(X, 110, X + 34, 110, { stroke: CYAN, strokeWidth: 1.4, roughness: 0.3 });
  fs.writeFileSync(require('path').join(__dirname, '..', 'build', 'marca', 'wall.svg'), svgDoc(W, H, 1920, 1080, grid(W, H, 14) + `<g>${L.out.join('\n')}</g>` + txt));
})();
console.log('ok');
