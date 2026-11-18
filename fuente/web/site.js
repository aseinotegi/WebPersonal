// Builds the first version of Ander's personal site (single self-contained HTML)
const fs = require('fs');
const make = require('../lib.js');

const round = (s) => s.replace(/-?\d+\.\d{2,}/g, (m) => (+m).toFixed(1));

// ---------- generic hand-drawn flow diagram ----------
function flow(seed, W, H, nodes, edges) {
  const L = make(seed);
  const pos = Object.fromEntries(nodes.map((n) => [n.id, [n.x, n.y]]));
  for (const e of edges) {
    const [a, b] = [pos[e.a], pos[e.b]];
    if (e.curve) L.add(L.gen.curve([a, e.curve, b], L.o({ strokeWidth: 0.7, roughness: 0.5, stroke: L.CYAN })), 'stroke-dasharray="1.6 2.8"');
    else L.line(...a, ...b, { strokeWidth: 0.75 }, e.dash ? L.DASH : '');
  }
  for (const n of nodes) n.draw(L, n.x, n.y);
  const txt = [];
  for (const e of edges) if (e.proto) {
    const [a, b] = [pos[e.a], pos[e.b]];
    const [mx, my] = e.at || (e.curve ? e.curve : [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    const w = e.proto.length * 3.75 + 5;
    L.knock(mx - w / 2, my - 4.4, w, 8.2);
    txt.push(`<text x="${mx}" y="${my + 2.1}" class="p">${e.proto}</text>`);
  }
  for (const n of nodes) {
    const ly = n.y + (n.ly || 16), w = n.label.length * 4.1 + 5;
    L.knock(n.x - w / 2, ly - 6.5, w, 8.8);
    txt.push(`<text x="${n.x}" y="${ly}" class="l">${n.label}</text>`);
  }
  return round(`<svg viewBox="0 0 ${W} ${H}" role="img" xmlns="http://www.w3.org/2000/svg"><g>${L.out.join('')}</g>${txt.join('')}</svg>`);
}
const I = {
  amr: (L, x, y) => L.inspectionRobot(x, y, 27),
  cont: (L, x, y) => L.containers(x, y + 2, 28),
  code: (L, x, y) => L.codeWin(x, y, 24, 17),
  chip: (L, x, y) => L.aiChip(x, y, 15),
  doc: (L, x, y) => L.doc(x, y),
  mail: (L, x, y) => L.mail(x, y),
  gauge: (L, x, y) => L.gauge(x, y - 2, 17),
  cam: (L, x, y) => L.camera(x, y, 23, 13),
  plc: (L, x, y) => L.plc(x, y, 21, 16),
  pc: (L, x, y) => L.embeddedPC(x, y, 32, 21),
  bat: (L, x, y) => L.battery(x, y),
};

const D = {
  scheduler: flow(61, 300, 130, [
    { id: 'amr', x: 38, y: 46, draw: I.amr, label: 'Flota de robots', ly: 22 },
    { id: 'cont', x: 140, y: 44, draw: I.cont, label: 'Backend + workers', ly: 19 },
    { id: 'code', x: 254, y: 44, draw: I.code, label: 'Web' },
    { id: 'chip', x: 100, y: 102, draw: I.chip, label: 'IA de visión', ly: 17 },
    { id: 'doc', x: 176, y: 100, draw: I.doc, label: 'Informes PDF', ly: 19 },
    { id: 'mail', x: 250, y: 102, draw: I.mail, label: 'Alertas', ly: 16 },
  ], [
    { a: 'amr', b: 'cont', proto: 'GraphQL', at: [88, 45] }, { a: 'cont', b: 'code', proto: 'REST', at: [200, 44] },
    { a: 'cont', b: 'chip' }, { a: 'cont', b: 'doc' }, { a: 'cont', b: 'mail', dash: 1 },
  ]),
  watchdogs: flow(62, 300, 120, [
    { id: 'amr', x: 42, y: 50, draw: I.amr, label: 'Robots', ly: 22 },
    { id: 'cont', x: 146, y: 48, draw: I.cont, label: '3 watchdogs', ly: 19 },
    { id: 'gauge', x: 252, y: 30, draw: I.gauge, label: 'Presión ATEX', ly: 18 },
    { id: 'mail', x: 252, y: 90, draw: I.mail, label: 'Alertas' },
  ], [
    { a: 'amr', b: 'cont', proto: 'GraphQL', at: [94, 49] },
    { a: 'cont', b: 'gauge' }, { a: 'cont', b: 'mail' },
    { a: 'cont', b: 'amr', curve: [94, 104], proto: 'resume' },
  ]),
  gauge: flow(63, 300, 100, [
    { id: 'cam', x: 34, y: 44, draw: I.cam, label: 'Fotos de misión', ly: 20 },
    { id: 'chip', x: 112, y: 44, draw: I.chip, label: 'Detector', ly: 20 },
    { id: 'gauge', x: 190, y: 44, draw: I.gauge, label: 'Lectura', ly: 20 },
    { id: 'doc', x: 266, y: 44, draw: I.doc, label: 'Informe', ly: 22 },
  ], [
    { a: 'cam', b: 'chip' }, { a: 'chip', b: 'gauge', proto: 'recorte' }, { a: 'gauge', b: 'doc', proto: 'JSON' },
  ]),
  mqtt: flow(64, 300, 100, [
    { id: 'plc', x: 40, y: 44, draw: I.plc, label: 'PLCs de la celda', ly: 20 },
    { id: 'pc', x: 150, y: 44, draw: I.pc, label: 'Broker + backend', ly: 21 },
    { id: 'code', x: 262, y: 44, draw: I.code, label: 'Dashboard', ly: 18 },
  ], [
    { a: 'plc', b: 'pc', proto: 'MQTT' }, { a: 'pc', b: 'code', proto: 'WebSocket' },
  ]),
  snap7: flow(65, 300, 100, [
    { id: 'plc', x: 40, y: 44, draw: I.plc, label: 'PLC Siemens', ly: 20 },
    { id: 'code', x: 150, y: 44, draw: I.code, label: 'Python + S7', ly: 18 },
    { id: 'cont', x: 262, y: 42, draw: I.cont, label: 'Cola de mensajes', ly: 20 },
  ], [
    { a: 'plc', b: 'code', proto: 'S7' }, { a: 'code', b: 'cont', proto: 'AMQP' },
  ]),
};

// ---------- hero illustration ----------
function hero() {
  const W = 320, H = 250, L = make(77);
  const { line, DASH, add, gen, o } = L;
  const N = { cont: [72, 30], pc: [162, 58], plc: [262, 34], chip: [36, 104], gauge: [108, 124], cam: [292, 116], amr: [58, 206], code: [150, 196] };
  line(-4, 12, 58, 26, { strokeWidth: 0.75 }); line(-4, 70, 30, 98, { strokeWidth: 0.6 }, DASH);
  line(N.plc[0], N.plc[1], 324, 10, { strokeWidth: 0.6 }, DASH); line(N.cam[0], N.cam[1], 324, 150, { strokeWidth: 0.6 }, DASH);
  const E = [['cont', 'pc'], ['pc', 'plc'], ['pc', 'gauge'], ['chip', 'gauge'], ['gauge', 'amr'], ['gauge', 'code'], ['plc', 'cam']];
  for (const [a, b] of E) line(...N[a], ...N[b], { strokeWidth: 0.75 });
  for (const [a, b] of [['cont', 'chip'], ['pc', 'cam'], ['amr', 'code']]) line(...N[a], ...N[b], { strokeWidth: 0.55 }, DASH);
  add(gen.curve([[258, 44], [254, 80], [258, 120], [262, 150]], o({ stroke: L.CYAN, strokeWidth: 0.8, roughness: 0.4 })), 'stroke-dasharray="1.6 2.8"');
  L.g('translate(30 50)'); L.robotArm(); L.gear(241, 178); L.gend();
  L.containers(N.cont[0], N.cont[1], 28); L.embeddedPC(...N.pc, 34, 22); L.line(151, 47, 150, 39, { strokeWidth: 0.7 }); L.wifi(150, 36);
  L.plc(...N.plc, 20, 16); L.aiChip(...N.chip, 15); L.gauge(N.gauge[0], N.gauge[1] - 1, 17); L.camera(...N.cam, 23, 13);
  L.inspectionRobot(N.amr[0], N.amr[1], 27); L.codeWin(...N.code, 24, 17);
  const t = [];
  const proto = (s, x, y) => { const w = s.length * 3.75 + 5; L.knock(x - w / 2, y - 4.4, w, 8.2); t.push(`<text x="${x}" y="${y + 2.1}" class="p">${s}</text>`); };
  proto('MQTT', 117, 44); proto('OPC UA', 214, 46); proto('MODBUS', 72, 114); proto('ROS 2', 83, 166); proto('REST', 129, 161);
  return round(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Red industrial dibujada a mano: PC embebido, PLC, sensores, cámara, robot de inspección y brazo robot" xmlns="http://www.w3.org/2000/svg"><g>${L.out.join('')}</g>${t.join('')}</svg>`);
}
function monogram() {
  const L = make(5);
  L.handCircle(20, 20, 34, { stroke: L.CYAN, sw: 1.6, passes: 2, wob: 0.4 });
  return round(`<svg viewBox="0 0 40 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${L.out.join('')}<text x="20" y="25.2" text-anchor="middle" class="mono">AS</text></svg>`);
}
function squiggle(seed, w = 60) {
  const L = make(seed); const pts = []; for (let i = 0; i <= 6; i++) pts.push([2 + i * (w - 4) / 6, 4 + (i % 2 ? -1.6 : 1.2)]);
  L.add(L.gen.curve(pts, L.o({ stroke: L.CYAN, strokeWidth: 1.4, roughness: 0.3 })));
  return round(`<svg viewBox="0 0 ${w} 8" class="sq" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${L.out.join('')}</svg>`);
}

const GH = 'https://github.com/aseinotegi';
const projects = [
  { key: 'watchdogs', repo: 'robot-fleet-watchdogs-showcase', tag: 'En producción · Vigilancia 24/7', title: 'Watchdogs para la flota de robots',
    problem: 'Un robot autónomo se para muchas veces al día por motivos triviales, y nadie mira la presión ATEX ni la batería a las tres de la mañana.',
    points: ['Reanuda la misión solo si la causa está en lista blanca y el evento es reciente.', 'Avisa de la presión ATEX al cambiar de estado, no en cada lectura.', 'Un contenedor por servicio: cada uno se despliega y reinicia por separado.'],
    stack: ['Python', 'GraphQL', 'Docker', 'Contenedores'] },
  { key: 'gauge', repo: 'level-gauge-vision-showcase', tag: 'En producción · Visión artificial', title: 'Lectura automática de medidores de nivel',
    problem: 'Cada misión deja cientos de fotos. Revisar los medidores de nivel una a una era lento, caro y propenso a errores.',
    points: ['Detector de objetos entrenado con un dataset propio de planta, con cinco clases.', 'El modelo multimodal solo ve el recorte del instrumento: más precisión y menos coste, unos 2-3 s por lectura.', 'Cada versión del modelo se compara con la anterior sobre un set fijo antes de desplegarla.'],
    stack: ['Visión artificial', 'Detección de objetos', 'IA multimodal', 'Python', 'APIs REST'] },
  { key: 'mqtt', repo: 'mqtt-traceability-dashboard-showcase', tag: 'En producción · Celda de fabricación', title: 'Trazabilidad MQTT en tiempo real',
    problem: 'Los eventos de la celda solo se veían en el HMI de cada máquina. Hacía falta una vista única, en vivo y desde cualquier navegador.',
    points: ['Los PLCs publican por MQTT y el backend empuja cada evento al navegador por WebSocket, sin recargar.', 'Cola entre la recepción MQTT y el servidor asíncrono, para no bloquearlo nunca.', 'Corre en un mini-PC junto a la celda, con login JWT.'],
    stack: ['MQTT', 'WebSocket', 'Python', 'JWT'] },
  { key: 'snap7', repo: 'snap7_PLC_adquisition', tag: 'Código abierto', title: 'Adquisición de datos de PLC',
    problem: 'Leer un bloque de datos de un PLC y enviar solo lo que cambia, sin saturar el destino.',
    points: ['Lee bool, byte, int16, int32 y real de un DB configurable.', 'Detecta cambios y publica solo los deltas, con marca de tiempo.', 'Envío asíncrono a una cola de mensajes para procesarlos o guardarlos.'],
    stack: ['Python', 'S7', 'AMQP'] },
];

const card = (p) => `
<article class="card">
  <figure class="diagram">${D[p.key]}</figure>
  <div class="card-body">
    <p class="tag">${p.tag}</p>
    <h3>${p.title}</h3>
    <p class="problem">${p.problem}</p>
    <ul class="points">${p.points.map((x) => `<li>${x}</li>`).join('')}</ul>
    <ul class="chips" aria-label="Tecnologías">${p.stack.map((x) => `<li>${x}</li>`).join('')}</ul>
    <a class="more" href="${GH}/${p.repo}">Ver el caso en GitHub <span aria-hidden="true">→</span></a>
  </div>
</article>`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ander Sein · Automatización e IIoT</title>
<meta name="description" content="Ander Sein, ingeniero de automatización e IIoT en Donostia: integración OT/IT, visión artificial y robots autónomos de inspección.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
<style>
:root{
  /* Pizarra de ingeniero: azul noche con rejilla de puntos, dibujos a mano como protagonistas, texto a la izquierda y diagrama a la derecha */
  --bg:#060D1B; --surface:#0A1526; --line:#1B2A42; --ink:#E6EDF7; --soft:#A3B3C9; --accent:#22D3EE;
  --display:"Montserrat", "Segoe UI", system-ui, sans-serif;
  --body:"Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  color-scheme:dark;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.6;
  background-image:radial-gradient(rgba(230,237,247,.11) 1px, transparent 1.2px);background-size:24px 24px}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
svg text{font-family:var(--body)}
svg .p{fill:var(--soft);font-size:6.2px;font-weight:700;font-style:italic;text-anchor:middle}
svg .l{fill:var(--accent);font-size:6.3px;font-weight:700;letter-spacing:.35px;text-anchor:middle;text-transform:uppercase}
svg .mono{fill:var(--ink);font-family:var(--display);font-weight:800;font-size:14px}

/* header */
header{position:sticky;top:0;z-index:10;background:rgba(6,13,27,.88);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;height:64px}
.brand{display:flex;align-items:center;gap:10px;color:var(--ink);font-family:var(--display);font-weight:700;font-size:17px}
.brand svg{width:36px;height:36px}
.brand:hover{text-decoration:none}
nav ul{display:flex;gap:22px;list-style:none;margin:0;padding:0;font-size:15px}
nav a{color:var(--soft)} nav a:hover{color:var(--ink)}

/* hero */
.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center;padding:64px 0 40px}
.eyebrow{color:var(--accent);font-weight:700;font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 14px}
h1{font-family:var(--display);font-weight:800;font-size:clamp(36px,5.2vw,58px);line-height:1.06;margin:0 0 10px;text-wrap:balance;letter-spacing:-.01em}
h1 span{color:var(--accent)}
.sq{width:72px;height:10px;display:block;margin:10px 0 22px}
.lead{color:var(--soft);font-size:18px;max-width:34em;margin:0 0 28px}
.lead strong{color:var(--ink);font-weight:600}
.ctas{display:flex;flex-wrap:wrap;gap:12px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:11px 18px;border-radius:10px;font-weight:700;font-size:15px;border:1.5px solid var(--accent)}
.btn.primary{background:var(--accent);color:var(--bg)}
.btn.ghost{color:var(--ink);border-color:var(--line);background:var(--surface)}
.btn:hover{text-decoration:none;filter:brightness(1.08)}
.hero figure{margin:0}
.hero figure svg{width:100%;height:auto;display:block}

/* facts */
.facts{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:24px 0 8px}
.fact{padding:22px 20px;border-left:1px solid var(--line)}
.fact:first-child{border-left:0;padding-left:0}
.fact b{display:block;font-family:var(--display);font-size:30px;line-height:1.1;color:var(--ink);font-variant-numeric:tabular-nums}
.fact span{color:var(--soft);font-size:14px;line-height:1.45;display:block;margin-top:6px}

/* sections */
section{padding:72px 0 8px}
.sec-head{display:flex;align-items:baseline;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:28px}
h2{font-family:var(--display);font-weight:800;font-size:clamp(28px,3.4vw,38px);margin:0;text-wrap:balance}
.sec-head p{color:var(--soft);margin:0;max-width:38em}
h3{font-family:var(--display);font-weight:700;font-size:21px;line-height:1.25;margin:4px 0 10px;text-wrap:balance}

/* projects */
.featured{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:32px;margin-bottom:24px}
.featured h3{font-size:28px}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;display:flex;flex-direction:column}
.diagram{margin:0;padding:22px 22px 6px;border-bottom:1px dashed var(--line)}
.diagram svg{width:100%;height:auto;display:block}
.featured .diagram{border:0;padding:0}
.card-body{padding:22px 24px 24px;display:flex;flex-direction:column;flex:1}
.tag{color:var(--accent);font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin:0}
.problem{color:var(--soft);margin:0 0 12px}
.points{margin:0 0 16px;padding:0;list-style:none;display:grid;gap:8px;font-size:15.5px}
.points li{padding-left:18px;position:relative}
.points li::before{content:"";position:absolute;left:0;top:.62em;width:8px;height:8px;border:1.5px solid var(--accent);border-radius:50%}
.chips{list-style:none;margin:0 0 18px;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.chips li{font-size:12.5px;padding:3px 9px;border-radius:999px;border:1px solid var(--line);color:var(--soft);background:var(--bg)}
.more{margin-top:auto;font-weight:700;font-size:15px}
.note{color:var(--soft);font-size:14px;margin:18px 0 0}

/* how */
.how{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.how div{border-top:2px solid var(--accent);padding-top:16px}
.how h3{font-size:18px;margin:0 0 8px}
.how p{color:var(--soft);font-size:15.5px;margin:0}

/* timeline */
.tl{list-style:none;margin:0;padding:0;border-left:1.5px dashed var(--line);display:grid;gap:26px}
.tl li{position:relative;padding-left:26px;display:grid;grid-template-columns:170px 1fr;gap:4px 24px}
.tl li::before{content:"";position:absolute;left:-7px;top:6px;width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--accent)}
.tl time{color:var(--soft);font-size:14.5px;font-variant-numeric:tabular-nums;padding-top:2px}
.tl h3{font-size:18px;margin:0}
.tl .org{color:var(--accent);font-weight:600;font-size:15px;margin:0}
.tl p{color:var(--soft);margin:4px 0 0;font-size:15.5px;max-width:42em}
.tl .cell{grid-column:2}
.edu{display:flex;flex-wrap:wrap;gap:12px 36px;margin-top:32px;color:var(--soft);font-size:15.5px}
.edu b{color:var(--ink);font-weight:600}

/* contact */
.contact{background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:40px;display:grid;grid-template-columns:1.2fr 1fr;gap:32px;align-items:center}
.contact p{color:var(--soft);margin:10px 0 0;max-width:30em}
.links{list-style:none;margin:0;padding:0;display:grid;gap:12px;font-size:16px}
.links li{display:grid;grid-template-columns:96px 1fr;gap:12px}
.links span{color:var(--soft);font-size:13px;text-transform:uppercase;letter-spacing:.1em;padding-top:2px}
footer{padding:48px 0 40px;color:var(--soft);font-size:14px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
footer em{color:var(--ink)}

@media (max-width:900px){
  .hero,.featured,.contact{grid-template-columns:1fr}
  .hero{padding-top:40px}
  .facts{grid-template-columns:repeat(2,1fr)}
  .fact:nth-child(3){border-left:0;padding-left:0}
  .fact{border-top:1px solid var(--line)} .fact:nth-child(-n+2){border-top:0}
  .grid{grid-template-columns:1fr}
  .how{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:600px){
  body{font-size:16px}
  .wrap{padding:0 18px}
  nav ul{gap:14px;font-size:14px}
  nav li.opt{display:none}
  .facts{grid-template-columns:1fr}
  .fact{border-left:0!important;padding-left:0!important;border-top:1px solid var(--line)!important}
  .fact:first-child{border-top:0!important}
  .how{grid-template-columns:1fr}
  .featured,.contact{padding:22px}
  .tl li{grid-template-columns:1fr}
  .tl .cell{grid-column:1}
  .links li{grid-template-columns:1fr;gap:0}
}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <a class="brand" href="#inicio" aria-label="Ander Sein, inicio">${monogram()}<span>Ander Sein</span></a>
    <nav aria-label="Secciones"><ul>
      <li><a href="#proyectos">Proyectos</a></li>
      <li class="opt"><a href="#como-trabajo">Cómo trabajo</a></li>
      <li><a href="#trayectoria">Trayectoria</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul></nav>
  </div>
</header>

<main id="inicio">
  <div class="wrap">
    <div class="hero">
      <div>
        <p class="eyebrow">IIoT · OT/IT · Robótica autónoma · IA</p>
        <h1>Conectando máquinas, datos y <span>robots.</span></h1>
        ${squiggle(3, 72)}
        <p class="lead">Soy <strong>Ander Sein</strong>, ingeniero de automatización e IIoT en Donostia. Llevo más de diez años llevando el dato desde el PLC hasta la decisión: integración OT/IT, visión artificial y robots autónomos de inspección en planta.</p>
        <div class="ctas">
          <a class="btn primary" href="#proyectos">Ver proyectos</a>
          <a class="btn ghost" href="https://drive.google.com/file/d/13Tf7QVlCJIUVRZBiALA2ZDCoR75RUgZL/view">Ver CV</a>
          <a class="btn ghost" href="https://www.linkedin.com/in/ander-sein-a24097195/">LinkedIn</a>
        </div>
      </div>
      <figure>${hero()}</figure>
    </div>

    <div class="facts">
      <div class="fact"><b>+10 años</b><span>en planta y en oficina técnica, de la puesta en marcha al software</span></div>
      <div class="fact"><b>5 países</b><span>con puestas en marcha: EEUU, Inglaterra, Francia, Japón y Hungría</span></div>
      <div class="fact"><b>4 sistemas</b><span>en producción para robots de inspección y datos de planta</span></div>
      <div class="fact"><b>PLC → IA</b><span>Profinet, OPC UA, MQTT, Modbus, Python, visión artificial e IA multimodal</span></div>
    </div>

    <section id="proyectos">
      <div class="sec-head">
        <h2>Proyectos</h2>
        <p>Sistemas reales en producción para clientes industriales. Los casos están anonimizados: cuento el problema, la arquitectura y las decisiones, no el código del cliente.</p>
      </div>

      <article class="featured">
        <figure class="diagram">${D.scheduler}</figure>
        <div>
          <p class="tag">Destacado · En producción · Oil &amp; gas · Multiplanta</p>
          <h3>Plataforma de misiones para robots de inspección</h3>
          <p class="problem">Una flota de robots recorre plantas industriales leyendo manómetros, niveles, gas y termografía. Hay que programar misiones, vigilar baterías, reaccionar a obstáculos y entregar informes, en varias plantas a la vez.</p>
          <ul class="points">
            <li>Planificador de misiones tolerante a fallos.</li>
            <li>Lectura de manómetros con IA de visión e informes PDF automáticos.</li>
            <li>Clasificación de obstáculos con un modelo multimodal y modelo de respaldo ante timeouts.</li>
            <li>KPIs y OEE, mapa en vivo, galerías de imágenes y alertas por correo.</li>
          </ul>
          <ul class="chips" aria-label="Tecnologías"><li>Python</li><li>TypeScript</li><li>APIs REST</li><li>GraphQL</li><li>Bases de datos</li><li>IA multimodal</li><li>Docker</li></ul>
          <a class="more" href="${GH}/robot-mission-scheduler-showcase">Ver el caso en GitHub <span aria-hidden="true">→</span></a>
        </div>
      </article>

      <div class="grid">${projects.map(card).join('')}</div>
      <p class="note">Más repositorios en <a href="${GH}">github.com/aseinotegi</a>.</p>
    </section>

    <section id="como-trabajo">
      <div class="sec-head"><h2>Cómo trabajo</h2><p>Lo que repito en cada proyecto, venga de un robot, de una celda o de un PLC.</p></div>
      <div class="how">
        <div><h3>Empiezo por el fallo real</h3><p>Cada servicio nace de una incidencia medida en planta, no de una lista de funciones.</p></div>
        <div><h3>Pruebo sin la planta</h3><p>Simuladores MQTT y respuestas simuladas para validar la lógica antes de tocar un robot o una celda.</p></div>
        <div><h3>Despliego poco a poco</h3><p>Primero el sistema solo avisa; después actúa. Robot a robot, planta a planta.</p></div>
        <div><h3>Que lo opere otro</h3><p>Contenedores, chequeos de salud y documentación para que el equipo de planta lo despliegue sin mí.</p></div>
      </div>
    </section>

    <section id="trayectoria">
      <div class="sec-head"><h2>Trayectoria</h2></div>
      <ol class="tl">
        <li><time>abr 2025 – 2026</time><div class="cell"><h3>Responsable de Robótica Autónoma de Supervisión</h3><p class="org">Alhona (Grupo Gestamp)</p><p>Robots autónomos de inspección en refinerías: despliegue, plataforma de supervisión con visión artificial y dirección del equipo de robótica.</p></div></li>
        <li><time>dic 2022 – abr 2025</time><div class="cell"><h3>Ingeniero de IIoT e Integración OT/IT</h3><p class="org">Alhona (Grupo Gestamp)</p><p>Arquitecturas de adquisición de datos con OPC UA, MQTT, Modbus y Profinet en los sectores naval, alimentario y de proceso.</p></div></li>
        <li><time>ago – nov 2022</time><div class="cell"><h3>Ingeniero de Automatización y Trazabilidad</h3><p class="org">SMARKTEC Marking Technology</p><p>Marcado y trazabilidad de palanquillas para Nucor (Nebraska): robots ABB, visión Cognex y PLC Allen-Bradley.</p></div></li>
        <li><time>mar 2016 – ago 2022</time><div class="cell"><h3>Ingeniero de Automatización · I4.0 · Puesta en marcha</h3><p class="org">Loire Gestamp</p><p>Liderazgo técnico del primer desapilador de Loire en línea tándem, para el Volkswagen ID.4 en Chattanooga. Puestas en marcha en EEUU, Inglaterra, Francia y Japón.</p></div></li>
      </ol>
      <div class="edu">
        <div><b>Máster en Automatización y Robótica Industrial</b> · ESNECA · 2020–2021</div>
        <div><b>Técnico Superior en Robótica y Automatización Industrial</b> · Easo · 2014–2016</div>
      </div>
    </section>

    <section id="contacto">
      <div class="contact">
        <div>
          <h2>¿Tienes un reto de planta, datos o robótica?</h2>
          <p>Integración OT/IT, adquisición de datos de PLC, visión artificial o plataformas para robots autónomos. Escríbeme y lo vemos.</p>
        </div>
        <ul class="links">
          <li><span>Email</span><a href="mailto:aseinotegi@gmail.com">aseinotegi@gmail.com</a></li>
          <li><span>LinkedIn</span><a href="https://www.linkedin.com/in/ander-sein-a24097195/">ander-sein-a24097195</a></li>
          <li><span>GitHub</span><a href="${GH}">aseinotegi</a></li>
          <li><span>Base</span>Donostia-San Sebastián</li>
        </ul>
      </div>
    </section>
  </div>
</main>
<footer class="wrap">
  <em>Del sensor al dato, del dato a la decisión.</em>
  <span>© 2026 Ander Sein</span>
</footer>
</body>
</html>`;
const out = require('path').join(__dirname, '..', 'build');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(require('path').join(out, 'site.html'), html);
console.log('bytes', html.length);
