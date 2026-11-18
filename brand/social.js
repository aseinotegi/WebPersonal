'use strict';

/** LinkedIn banner (1584 × 396 px) and 16:9 background (1920 × 1080 px), same style as the card. */

const { Sketch, DASHED } = require('../src/drawing/sketch');
const icons = require('../src/drawing/icons');
const { SOFT, dotGrid, protocolTag, svgDocument } = require('./common');

const NAVY = '#060D1B';

function drawLinkedInBanner() {
  const width = 792;
  const height = 198;
  const sk = new Sketch({ seed: 31 });
  const { accent } = sk.colors;
  const n = { chip: [70, 46], gauge: [140, 88], cont: [212, 36], pc: [296, 70], plc: [392, 48], cam: [378, 134], code: [232, 144], amr: [160, 152] };

  // lines leaving the frame
  sk.line(-4, 22, 62, 42, { strokeWidth: 0.75 });
  sk.line(-4, 74, 130, 86, { strokeWidth: 0.75 });
  sk.line(310, 58, 332, -4, { strokeWidth: 0.6 }, DASHED);
  sk.line(382, 140, 420, 202, { strokeWidth: 0.6 }, DASHED);
  // network
  for (const [a, b] of [['chip', 'gauge'], ['gauge', 'cont'], ['cont', 'pc'], ['pc', 'plc'], ['pc', 'cam'], ['pc', 'code'], ['code', 'amr']]) {
    sk.line(...n[a], ...n[b], { strokeWidth: 0.75 });
  }
  for (const [a, b] of [['gauge', 'amr'], ['chip', 'cont'], ['plc', 'cam']]) sk.line(...n[a], ...n[b], { strokeWidth: 0.55 }, DASHED);
  sk.curve([[396, 57], [430, 72], [466, 90], [484, 102]], { stroke: accent, strokeWidth: 0.8, roughness: 0.4 }, 'stroke-dasharray="1.6 2.8"'); // PLC → robot wrist

  sk.group('translate(255 0)', () => {
    icons.robotArm(sk);
    icons.gear(sk, 241, 178);
  });
  icons.aiChip(sk, ...n.chip, 15);
  icons.gauge(sk, n.gauge[0], n.gauge[1] - 1, 17);
  icons.containers(sk, n.cont[0], n.cont[1], 28);
  icons.industrialPc(sk, ...n.pc, 34, 22);
  sk.line(285, 59, 284, 51, { strokeWidth: 0.7 });
  icons.wifi(sk, 284, 48);
  icons.plc(sk, ...n.plc, 20, 16);
  icons.camera(sk, ...n.cam, 23, 13);
  icons.codeWindow(sk, ...n.code, 24, 17);
  icons.inspectionRobot(sk, n.amr[0], n.amr[1], 27);

  protocolTag(sk, 'MQTT', 254, 50);
  protocolTag(sk, 'OPC UA', 344, 56);
  protocolTag(sk, 'REST', 264, 107);
  protocolTag(sk, 'ROS 2', 196, 148);
  protocolTag(sk, 'MODBUS', 176, 62);

  const x = 534;
  const text = `
  <text x="${x}" y="64" fill="${accent}" font-family="Inter" font-weight="700" font-size="7" letter-spacing="1.3">IIoT · OT/IT · ROBÓTICA AUTÓNOMA · IA</text>
  <text x="${x - 1}" y="93" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="18.5">Conectando máquinas,</text>
  <text x="${x - 1}" y="116" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="18.5">datos y <tspan fill="${accent}">robots.</tspan></text>
  <text x="${x}" y="142" fill="${SOFT}" font-family="Inter" font-weight="400" font-style="italic" font-size="8.6">Del sensor al dato, del dato a la decisión.</text>`;
  sk.curve([[x, 126], [x + 8, 124.5], [x + 16, 126.5], [x + 24, 124.5], [x + 32, 126], [x + 40, 124.8]], { stroke: accent, strokeWidth: 0.9, roughness: 0.3 });

  return svgDocument({
    width, height, pixelWidth: 1584, pixelHeight: 396, background: NAVY,
    body: dotGrid({ toX: width, toY: height }) + `<g>${sk.strokeMarkup('\n')}</g>` + text,
  });
}

function drawBackground16x9() {
  const width = 640;
  const height = 360;
  const sk = new Sketch({ seed: 43 });
  const { accent } = sk.colors;
  const n = { cont: [236, 42], pc: [330, 56], plc: [432, 36], chip: [532, 62], cam: [596, 128], gauge: [560, 196], amr: [588, 272], code: [500, 300] };

  sk.line(-4, 150, 40, 120, { strokeWidth: 0.6 }, DASHED);
  sk.line(n.plc[0], n.plc[1], 470, -4, { strokeWidth: 0.6 }, DASHED);
  sk.line(n.chip[0], n.chip[1], 644, 30, { strokeWidth: 0.75 });
  sk.line(n.amr[0], n.amr[1], 644, 330, { strokeWidth: 0.6 }, DASHED);
  sk.line(n.cont[0], n.cont[1], 190, -4, { strokeWidth: 0.75 });
  for (const [a, b] of [['cont', 'pc'], ['pc', 'plc'], ['plc', 'chip'], ['chip', 'cam'], ['cam', 'gauge'], ['gauge', 'amr'], ['amr', 'code']]) {
    sk.line(...n[a], ...n[b], { strokeWidth: 0.75 });
  }
  for (const [a, b] of [['pc', 'chip'], ['cam', 'amr'], ['gauge', 'code']]) sk.line(...n[a], ...n[b], { strokeWidth: 0.55 }, DASHED);
  sk.curve([[318, 68], [260, 120], [190, 180], [150, 214]], { stroke: accent, strokeWidth: 0.8, roughness: 0.4 }, 'stroke-dasharray="1.6 2.8"'); // hub → gripper

  // Icons are drawn at their usual size and scaled around their own centre.
  const enlarged = (x, y, scale, draw) => sk.group(`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`, draw);

  sk.group('translate(-258 48) scale(1.6)', () => {
    icons.robotArm(sk);
    icons.gear(sk, 241, 178);
  });
  enlarged(...n.cont, 1.35, () => icons.containers(sk, ...n.cont, 28));
  enlarged(...n.pc, 1.35, () => {
    icons.industrialPc(sk, ...n.pc, 34, 22);
    sk.line(319, 45, 318, 37, { strokeWidth: 0.7 });
    icons.wifi(sk, 318, 34);
  });
  enlarged(...n.plc, 1.35, () => icons.plc(sk, ...n.plc, 20, 16));
  enlarged(...n.chip, 1.35, () => icons.aiChip(sk, ...n.chip, 15));
  enlarged(...n.cam, 1.35, () => icons.camera(sk, ...n.cam, 23, 13));
  enlarged(...n.gauge, 1.35, () => icons.gauge(sk, ...n.gauge, 17));
  enlarged(...n.amr, 1.45, () => icons.inspectionRobot(sk, ...n.amr, 27));
  enlarged(...n.code, 1.35, () => icons.codeWindow(sk, ...n.code, 24, 17));

  protocolTag(sk, 'MQTT', 283, 49, 7.5);
  protocolTag(sk, 'OPC UA', 381, 46, 7.5);
  protocolTag(sk, 'ROS 2', 545, 287, 7.5);
  protocolTag(sk, 'MODBUS', 578, 162, 7.5);

  const x = 26;
  const text = `
  <text x="${x}" y="44" fill="${accent}" font-family="Inter" font-weight="700" font-size="7.5" letter-spacing="1.4">IIoT · ROBÓTICA · IA</text>
  <text x="${x - 1}" y="72" fill="#FFFFFF" font-family="Montserrat" font-weight="700" font-size="25">Ander Sein</text>
  <text x="${x}" y="88" fill="${accent}" font-family="Inter" font-weight="700" font-size="9.5">Automatización e integración IIoT</text>
  <text x="${x}" y="101" fill="${SOFT}" font-family="Inter" font-style="italic" font-size="8">Conectando máquinas, datos y robots.</text>
  <text x="614" y="344" fill="${SOFT}" font-family="Inter" font-style="italic" font-size="8" text-anchor="end">Del sensor al dato, del dato a la decisión.</text>`;
  sk.line(x, 110, x + 34, 110, { stroke: accent, strokeWidth: 1.4, roughness: 0.3 });

  return svgDocument({
    width, height, pixelWidth: 1920, pixelHeight: 1080, background: NAVY,
    body: dotGrid({ toX: width, toY: height, step: 14 }) + `<g>${sk.strokeMarkup('\n')}</g>` + text,
  });
}

module.exports = { drawLinkedInBanner, drawBackground16x9 };
