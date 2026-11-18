// Scroll-story version of Ander's site: a data point travels down the automation stack
const fs = require('fs');
const make = require('../lib.js');
const world = require('./story_world.js')();

const old = fs.readFileSync(require('path').join(__dirname, '..', 'build', 'site.html'), 'utf8');
const oldCss = old.match(/<style>([\s\S]*?)<\/style>/)[1];
const tail = old.slice(old.indexOf('<div class="facts">'), old.indexOf('</main>'));
const monogram = old.match(/<a class="brand"[\s\S]*?<\/a>/)[0];
const squiggle = old.match(/<svg viewBox="0 0 72 8" class="sq"[\s\S]*?<\/svg>/)[0];

const stops = [
  { k: 'bot', bot: 180, cam: [440, 330, 1000], lvl: 'Inicio', h: 'Sigue al robot.', p: 'Un robot de inspección hace su ronda por la planta. Por el camino, los proyectos que he construido.', tech: [], lab: '' },
  { k: 'bot', bot: 560, cam: [600, 300, 820], lvl: 'En planta', h: 'Foto al manómetro PI-104.', p: 'El robot llega al punto de inspección y captura la imagen del instrumento local.', tech: [], lab: 'IMG_0412 · PI-104' },
  { repo: ['https://github.com/aseinotegi/mqtt-traceability-dashboard-showcase', 'Trazabilidad MQTT en tiempo real'], k: 'pc', bot: 560, cam: [650, 840, 920], lvl: 'Proyecto 01 · Captura de datos', h: 'Datos en tiempo real por MQTT', p: 'Robots, equipos y sensores publican por MQTT y el dato llega al instante a quien lo necesita, sin acoplar unos sistemas con otros. La base de todo lo demás.', tech: ['MQTT', 'WebSocket', 'Python'], lab: 'MQTT · planta1/robot-01/img' },
  { k: 'cont', bot: 560, cam: [560, 900, 920], lvl: 'Proyecto 02 · Edge', h: 'PC industrial con servicios en contenedores', p: 'Cada servicio corre en su propio contenedor: se despliega, se actualiza y se reinicia por separado, y funciona 24/7 junto a la planta.', tech: ['Docker', 'PC industrial', 'Python'], lab: 'contenedor · inferencia' },
  { repo: ['https://github.com/aseinotegi/level-gauge-vision-showcase', 'Lectura de medidores con visión'], k: 'vis', bot: 560, cam: [660, 1220, 860], lvl: 'Proyecto 03 · Visión artificial', h: 'Qué es y cuánto marca', p: 'Un detector entrenado con imágenes reales de planta confirma que es un manómetro y un modelo multimodal lee el valor a partir del recorte. Dos resultados distintos: la clase, con su confianza, y la lectura.', tech: ['Detección de objetos', 'IA multimodal', 'Python'], lab: '' },
  { soon: true, ix: 'Unified Namespace para datos de planta', k: 'uns', bot: 560, cam: [700, 1580, 980], lvl: 'Proyecto 04 · Unified Namespace', h: 'Todo llega a un mismo sitio', p: 'Cada fuente publica su dato en una jerarquía común: planta, área, equipo, dato. La lectura de la visión entra aquí, y cualquier servicio la encuentra sin saber quién la produjo.', tech: ['Unified Namespace', 'MQTT', 'Modelado de datos'], lab: 'pi-104/presion = 6,8' },
  { repo: ['https://github.com/aseinotegi/plc-mqtt-gateway', 'Pasarela PLC → MQTT'], ix: 'Adquisición de datos de PLC', k: 'plc', bot: 560, cam: [400, 1580, 960], lvl: 'Proyecto 05 · Adquisición de PLC', h: 'El PLC publica su propia medida', p: 'El transmisor PT-104 llega al PLC por 4-20 mA. Una pasarela lee sus bloques de datos sin tocar el proceso y publica en el UNS solo lo que cambia. Lo he hecho en los sectores naval, alimentario y de proceso.', tech: ['Siemens S7', 'Profinet', 'Modbus', 'OPC UA'], lab: '' },
  { repo: ['https://github.com/aseinotegi/robot-fleet-watchdogs-showcase', 'Watchdogs para la flota de robots'], ix: 'Reglas y alarmas en tiempo real', k: 'dec', bot: 560, cam: [900, 1560, 900], lvl: 'Proyecto 06 · Reglas y alarmas', h: 'La regla cruza las dos fuentes', p: 'Un servicio suscrito al UNS compara la lectura de la visión con la del PLC. Si las dos superan el límite, la alarma es real y no un error de lectura: se ordena al robot cerrar XV-104. Primero avisa; cuando hay confianza, actúa.', tech: ['Reglas en tiempo real', 'MQTT', 'Python'], lab: '' },
  { ix: 'Robots y PLCs, de la puesta en marcha a la inspección autónoma', k: 'wheel', bot: 560, bump: 1500, delay: 0.45, cam: [660, 370, 760], lvl: 'Proyecto 07 · Robótica', h: 'El robot cierra la válvula manual', p: 'XV-104 no tiene actuador: solo se cierra a mano, y para eso está el robot. De programar robots y PLCs en puestas en marcha de cinco países a robots autónomos que actúan en planta.', tech: ['Robótica', 'PLC', 'Puesta en marcha'], lab: '' },
  { repo: ['https://github.com/aseinotegi/robot-mission-scheduler-showcase', 'Plataforma de misiones para robots'], ix: 'Plataforma de misiones para robots de inspección', k: 'dash', bot: 560, bump: 1300, cam: [640, 1910, 880], lvl: 'Proyecto 08 · Plataforma', h: 'Del UNS al dashboard: resuelto', p: 'Con la válvula cerrada, el PLC publica la bajada en el UNS y el dashboard la muestra: pico de 6,8 bar y vuelta a 4,2. La plataforma multiplanta guarda el histórico, los KPIs y el informe.', tech: ['APIs REST', 'Bases de datos', 'Contenedores', 'IA'], lab: 'pt-104/presion = 4,2' },
  { k: 'dash', bot: 560, cam: [620, 1080, 4000], lvl: 'Ander Sein', h: 'Del sensor a la decisión, de punta a punta.', p: 'Soy Ander Sein, ingeniero de automatización e IIoT en Donostia. Este camino completo es mi trabajo.', tech: [], lab: '' },
];
const N = stops.length;
const pidx = stops.map((s, i) => [s, i]).filter(([s]) => /^Proyecto/.test(s.lvl)).map(([s, i]) => `
        <li>
          <span class="n">${s.lvl.slice(9, 11)}</span>
          <div class="pi-main"><strong>${s.ix || s.h}</strong><span>${s.lvl.slice(14)}${s.repo ? ' · caso: ' + s.repo[1] : ''}</span></div>
          <div class="pi-links"><a href="#dato" data-go="${i}">Ver en la historia</a>${s.repo ? `<a href="${s.repo[0]}" target="_blank" rel="noopener">GitHub ↗</a>` : s.soon ? '<em>repo en camino</em>' : '<em>experiencia</em>'}</div>
        </li>`).join('');
const projIndex = `<section id="proyectos">
      <div class="sec-head">
        <h2>Proyectos</h2>
        <p>Los mismos de la historia, en una lista. Casos reales anonimizados: cuento el problema, la arquitectura y las decisiones, nunca el código del cliente.</p>
      </div>
      <ol class="pindex">${pidx}
      </ol>
    </section>
    `;
const tail2 = tail.slice(0, tail.indexOf('<section id="proyectos">')) + projIndex + tail.slice(tail.indexOf('<section id="como-trabajo">'));
const caps = stops.map((s, i) => `
      <article class="cap${i === 0 ? ' on' : ''}" data-i="${i}">
        <p class="lvl"><span>${String(i + 1).padStart(2, '0')}</span>${s.lvl}</p>
        ${i === 0 ? `<h1>${s.h}</h1>` : `<h2>${s.h}</h2>`}
        <p class="txt">${s.p}</p>
        ${s.tech.length ? `<ul class="chips">${s.tech.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
        ${s.repo ? `<a class="repo" href="${s.repo[0]}" target="_blank" rel="noopener"><span class="gh" aria-hidden="true">GitHub</span>${s.repo[1]} <span aria-hidden="true">↗</span></a>` : ''}
        ${i === 0 ? '<p class="hint">Haz scroll <span aria-hidden="true">↓</span></p>' : ''}
        ${i === N - 1 ? '<a class="btn primary" href="#ander">Conóceme <span aria-hidden="true">↓</span></a>' : ''}
      </article>`).join('');
const dots = stops.map((s, i) => `<li><button type="button" data-go="${i}" aria-label="Ir a: ${s.lvl}"${i === 0 ? ' class="on"' : ''}></button></li>`).join('');

const cfg = JSON.stringify({ route: world.route, botY: world.BOT_Y, botK: world.BOT_K, wheel: world.WHEEL, valveStop: stops.findIndex((x) => x.k === 'wheel'), plcStop: stops.findIndex((x) => x.k === 'plc'), route2: world.route2, stops: stops.map((s) => ({ pt: s.k === 'plc' ? world.P.uns : world.P[s.k], cam: s.cam, lab: s.lab, bot: s.bot, bump: s.bump || 0, delay: s.delay || 0 })) });

const css = `
/* ---------- scroll story ---------- */
.story{padding:0;position:relative;height:calc(${N - 1} * 105vh + 100vh);height:calc(${N - 1} * 105svh + 100svh)}
.stage{position:-webkit-sticky;position:sticky;top:0;height:100vh;height:100svh;overflow:hidden}
#world{position:absolute;inset:0;width:100%;height:100%;display:block}
#world .ink path{vector-effect:non-scaling-stroke}
#world .wcs{fill:var(--accent);font:700 12px var(--body);letter-spacing:1.2px}
#world .badge{opacity:0;transition:opacity .4s ease}
#world .badge.on{opacity:1}
#world .badge rect{fill:var(--bg);stroke:var(--accent);stroke-width:1.5;vector-effect:non-scaling-stroke}
#world .badge text{fill:var(--ink);font:600 14px var(--mono)}
#world .flash{fill:rgba(34,211,238,.13);stroke:var(--accent);stroke-width:1.2;stroke-dasharray:6 6;vector-effect:non-scaling-stroke}
#world .gas{animation:drift 3.2s ease-in-out infinite}
@keyframes drift{0%,100%{transform:translateY(0);opacity:.9}50%{transform:translateY(-10px);opacity:.45}}
#world .flowline{animation:flow 1.6s linear infinite}
@keyframes flow{to{stroke-dashoffset:-48}}
.cap .chips{margin:0 0 18px}
.cap .repo{display:inline-flex;align-items:center;gap:10px;min-height:42px;padding:8px 14px 8px 8px;margin:0 0 6px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-weight:700;font-size:14px}
.cap .repo .gh{font:600 11px var(--mono);color:var(--bg);background:var(--accent);border-radius:6px;padding:3px 7px}
.cap .repo:hover{border-color:var(--accent);text-decoration:none}
.pindex{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.pindex li{display:grid;grid-template-columns:52px 1fr auto;gap:18px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--line)}
.pindex .n{font:600 14px var(--mono);color:var(--accent);border:1px solid var(--line);border-radius:6px;padding:2px 0;text-align:center}
.pindex .pi-main strong{display:block;font-family:var(--display);font-size:18px;line-height:1.25}
.pindex .pi-main span{color:var(--soft);font-size:15px}
.pindex .pi-links{display:flex;gap:16px;font-weight:700;font-size:14px;white-space:nowrap}
.pindex .pi-links em{color:var(--soft);font-weight:400}
#world .wq{fill:var(--ink);font:800 19px var(--display)}
#world .wa{fill:#F5A524;font:700 13px var(--body);text-anchor:middle}
#world .wds{fill:var(--soft);font:600 11px var(--body)}
#world .badge.alarm rect{stroke:#F5A524}
#world .badge.alarm text{fill:#F5A524}
#world .wr{fill:var(--soft);font:700 12px var(--body);letter-spacing:2px}
#world .wc{fill:var(--accent);font:700 12.5px var(--body);letter-spacing:1.4px}
#world .wp{fill:var(--soft);font:italic 700 13px var(--body)}
#world .wd{fill:var(--soft);font:600 13px var(--body)}
#world .wbig{fill:#fff;font:800 31px var(--display)}
#world .whub{fill:#fff;font:800 92px var(--display)}
#lab rect{fill:var(--bg);stroke:var(--accent);stroke-width:1.5}
#lab text{fill:var(--ink);font:600 15.5px var(--mono)}
#pk .core{fill:var(--accent)}
#pk .halo{fill:var(--accent);opacity:.35;filter:url(#blur)}
#pk .tr{fill:var(--accent)}
#pk2 .core{fill:var(--ink)}
#pk2 .halo{fill:var(--ink);opacity:.3;filter:url(#blur)}
.stage::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(90deg,var(--bg) 0,rgba(6,13,27,.92) 30%,rgba(6,13,27,0) 52%)}
.caps{position:absolute;z-index:2;left:max(24px,calc((100vw - 1120px)/2 + 24px));top:50%;transform:translateY(-44%);width:min(420px,40vw);min-height:300px}
.cap{position:absolute;inset:0 auto auto 0;opacity:0;transform:translateY(14px);transition:opacity .45s ease,transform .45s ease;pointer-events:none}
.cap.on{opacity:1;transform:none;pointer-events:auto}
.cap .lvl{display:flex;align-items:center;gap:12px;color:var(--accent);font-weight:700;font-size:13px;letter-spacing:.16em;text-transform:uppercase;margin:0 0 14px}
.cap .lvl span{font-family:var(--mono);color:var(--soft);letter-spacing:0;border:1px solid var(--line);border-radius:6px;padding:1px 7px}
.cap h1,.cap h2{font-family:var(--display);font-weight:800;line-height:1.08;margin:0 0 16px;text-wrap:balance;letter-spacing:-.01em}
.cap h1{font-size:clamp(34px,4.6vw,56px)}
.cap h2{font-size:clamp(28px,3.4vw,42px)}
.cap .txt{color:var(--soft);font-size:18px;margin:0 0 20px}
.hint{color:var(--accent);font-weight:700;margin:0}
.hint span{display:inline-block;animation:bob 1.6s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(5px)}}
.steps{position:absolute;z-index:2;right:max(20px,calc((100vw - 1120px)/2));top:50%;transform:translateY(-50%);list-style:none;margin:0;padding:0;display:grid;gap:12px}
.steps button{width:12px;height:12px;border-radius:50%;border:2px solid var(--soft);background:transparent;padding:0;cursor:pointer;opacity:.6}
.steps button.on{border-color:var(--accent);background:var(--accent);opacity:1}
.skip{position:absolute;z-index:3;right:max(20px,calc((100vw - 1120px)/2));bottom:22px;font-size:14px;font-weight:700;color:var(--soft);background:var(--surface);border:1px solid var(--line);padding:7px 12px;border-radius:8px}
.skip:hover{color:var(--ink);text-decoration:none}
#ander{padding-top:96px}
.about{max-width:760px;margin-bottom:24px}
.about h2{font-size:clamp(34px,4.4vw,52px);margin:0}
:root{--mono:"JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, monospace}
@media (max-width:820px){
  .stage::before{background:linear-gradient(0deg,var(--bg) 0,rgba(6,13,27,.94) 36%,rgba(6,13,27,0) 60%)}
  .caps{left:18px;right:18px;width:auto;top:auto;bottom:64px;transform:none;min-height:0}
  .cap{inset:auto 0 0 0}
  .cap .txt{font-size:16px;margin-bottom:12px}
  .steps{right:12px;top:96px;transform:none;gap:9px}
  .steps button{width:10px;height:10px}
  .skip{left:18px;right:auto;bottom:16px}
  .pindex li{grid-template-columns:40px 1fr;gap:12px}
  .pindex .pi-links{grid-column:2;gap:18px}
  .cap .repo{font-size:13px;min-height:44px}
}
@media (prefers-reduced-motion:reduce){.hint span,#world .gas,#world .flowline{animation:none}}
`;

const js = `
(() => {
  const C = ${cfg};
  const story = document.getElementById('dato'), svg = document.getElementById('world');
  const path = document.getElementById('route'), pk = document.getElementById('pk'), lab = document.getElementById('lab');
  const labText = lab.querySelector('text'), labRect = lab.querySelector('rect');
  const caps = [...document.querySelectorAll('.cap')], dots = [...document.querySelectorAll('.steps button')];
  const trail = [...pk.querySelectorAll('.tr')], bot = document.getElementById('bot'), arm = document.getElementById('arm'), wheel = document.getElementById('wheel');
  const B = id => document.getElementById(id), bPhoto = [B('b-photo'), B('b-flash')], bAlarm = B('b-alarm'), bValve = B('b-valve');
  const clamp = v => Math.min(Math.max(v, 0), 1);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const n = C.stops.length;

  // smooth path through the route (Catmull-Rom -> cubic Bézier)
  const R = C.route; let d = 'M' + R[0];
  for (let i = 0; i < R.length - 1; i++) {
    const p0 = R[i - 1] || R[i], p1 = R[i], p2 = R[i + 1], p3 = R[i + 2] || p2;
    d += ' C' + [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]].map(v => v.toFixed(1)).join(' ');
  }
  path.setAttribute('d', d);
  const path2 = document.getElementById('route2'), pk2 = document.getElementById('pk2');
  const R2 = C.route2; let d2 = 'M' + R2[0];
  for (let i = 0; i < R2.length - 1; i++) {
    const p0 = R2[i - 1] || R2[i], p1 = R2[i], p2 = R2[i + 1], p3 = R2[i + 2] || p2;
    d2 += ' C' + [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]].map(v => v.toFixed(1)).join(' ');
  }
  path2.setAttribute('d', d2);
  const total2 = path2.getTotalLength();
  let hub2 = 0, hubd = 1e9;  // where the PLC value reaches the hub
  for (let l = 0; l <= total2; l += 2) { const q = path2.getPointAtLength(l), dd = (q.x - 538) ** 2 + (q.y - 1562) ** 2; if (dd < hubd) { hubd = dd; hub2 = l; } }
  const total = path.getTotalLength();
  // arc length of each stop
  let from = 0; const lens = C.stops.map(s => {
    let best = from, bd = 1e9;
    for (let l = from; l <= total; l += 3) { const q = path.getPointAtLength(l), dd = (q.x - s.pt[0]) ** 2 + (q.y - s.pt[1]) ** 2; if (dd < bd) { bd = dd; best = l; } }
    from = best; return best;
  });

  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;
  let curLab = null, curCap = -1, vb = [0, 0, 1, 1], labW = 0;

  function view(cx, cy, w) {
    const sw = svg.clientWidth || innerWidth, sh = svg.clientHeight || innerHeight, a = sh / sw;
    let vw, vh;
    if (sw >= 820) { vw = w; vh = w * a; cx -= w * 0.16; vb = [cx - vw / 2, cy - vh / 2, vw, vh]; }
    else { vw = w * 0.52; vh = vw * a; cy += vh * 0.17; }
    vb = [cx - vw / 2, cy - vh / 2, vw, vh];
    svg.setAttribute('viewBox', [cx - vw / 2, cy - vh / 2, vw, vh].map(v => v.toFixed(1)).join(' '));
    return vw;
  }

  function update() {
    const r = story.getBoundingClientRect(), span = story.offsetHeight - innerHeight;
    const t = Math.min(Math.max(-r.top / span, 0), 1) * (n - 1);
    let i = Math.min(Math.floor(t), n - 1), f = t - i;
    if (i >= n - 1) { i = n - 1; f = 0; }
    const hold = .32; let s = f < hold ? 0 : ease((f - hold) / (1 - hold));
    const a = C.stops[i], b = C.stops[Math.min(i + 1, n - 1)];
    const raw = s; s = a.delay ? clamp((s - a.delay) / (1 - a.delay)) : s;
    const vw = view(lerp(a.cam[0], b.cam[0], s), lerp(a.cam[1], b.cam[1], s), lerp(a.cam[2], b.cam[2], s) + b.bump * Math.sin(Math.PI * s) * (i < n - 1 ? 1 : 0));
    const bx = lerp(a.bot, b.bot, s), drive = a.bot !== b.bot && s > 0 && s < 1;
    bot.setAttribute('transform', 'translate(' + bx.toFixed(1) + ' ' + (C.botY + (drive && !reduce ? Math.sin(s * Math.PI * 10) * 2.5 : 0)).toFixed(1) + ') scale(' + C.botK + ')');
    const k = vw / (svg.clientWidth || innerWidth);
    const L = lerp(lens[i], lens[Math.min(i + 1, n - 1)], s);
    const p = path.getPointAtLength(L);
    pk.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') scale(' + k.toFixed(3) + ')');
    const moving = s > 0 && s < 1;
    trail.forEach((c, j) => {
      const q = path.getPointAtLength(Math.max(L - (j + 1) * 14 * k, 0));
      c.setAttribute('cx', ((q.x - p.x) / k).toFixed(1)); c.setAttribute('cy', ((q.y - p.y) / k).toFixed(1));
      c.style.opacity = moving ? (0.5 - j * 0.11) : 0;
    });
    pk.style.opacity = i === 0 ? s : i === n - 2 ? 1 - s : i === n - 1 ? 0 : 1;
    // second packet: PLC -> UNS during the PLC scene, then UNS -> rule engine next to the vision value
    const Q = C.plcStop;
    let l2 = -1, o2 = 0;
    if (i === Q - 1) { l2 = hub2 * clamp((s - .35) / .65); o2 = clamp((s - .3) * 5); }
    else if (i === Q) { l2 = hub2 + (total2 - hub2) * s; o2 = 1; }
    else if (i === Q + 1) { l2 = total2; o2 = 1 - clamp(s * 3); }
    pk2.style.opacity = o2;
    if (l2 >= 0) { const q2 = path2.getPointAtLength(l2); pk2.setAttribute('transform', 'translate(' + q2.x.toFixed(1) + ' ' + q2.y.toFixed(1) + ') scale(' + k.toFixed(3) + ')'); }
    // arm reaches the valve when the order arrives, turns the wheel, then folds
    const V = C.valveStop;
    const ext = i === V - 1 ? clamp((s - .8) / .2) : i === V ? (raw < .3 ? 1 : 1 - clamp((raw - .3) / .15)) : 0;
    arm.setAttribute('transform', 'rotate(' + ((1 - ext) * -133).toFixed(1) + ' 8 2)');
    const phi = i < V ? 0 : i === V ? -270 * clamp(raw / .3) : -270;
    wheel.setAttribute('transform', 'rotate(' + phi.toFixed(1) + ' ' + C.wheel[0] + ' ' + C.wheel[1] + ')');
    bValve.classList.toggle('on', i === V && raw > .3);
    // label: fades out mid-flight, then shows the transformed value
    const txt = s < .5 ? a.lab : b.lab;
    if (txt !== curLab) {
      curLab = txt; labText.textContent = txt;
      const w = txt ? labText.getComputedTextLength() + 26 : 0;
      labW = w; labRect.setAttribute('width', w.toFixed(1)); labRect.setAttribute('x', 0);
    }
    lab.style.opacity = !txt ? 0 : Math.abs(s - .5) * 2;
    const mr = (svg.clientWidth >= 820 ? 70 : 10) * k; let lx = p.x + 22 * k; if (lx + labW * k > vb[0] + vb[2] - mr) lx = p.x - 22 * k - labW * k;
    lx = Math.min(Math.max(lx, vb[0] + 10 * k), vb[0] + vb[2] - mr - labW * k);
    lab.setAttribute('transform', 'translate(' + lx.toFixed(1) + ' ' + (p.y - 42 * k).toFixed(1) + ') scale(' + k.toFixed(3) + ')');
    const c = s < .55 ? i : Math.min(i + 1, n - 1);
    if (c !== curCap) { curCap = c; bPhoto.forEach(e => e.classList.toggle('on', c === 1)); bAlarm.classList.toggle('on', c === C.valveStop - 1); caps.forEach((e, j) => e.classList.toggle('on', j === c)); dots.forEach((e, j) => e.classList.toggle('on', j === c)); }
  }
  let ticking = false;
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  dots.forEach((b, j) => b.addEventListener('click', () => {
    const span = story.offsetHeight - innerHeight;
    scrollTo({ top: story.offsetTop + span * (j / (n - 1)), behavior: reduce ? 'auto' : 'smooth' });
  }));
  document.querySelectorAll('.pindex [data-go]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const span = story.offsetHeight - innerHeight;
    scrollTo({ top: story.offsetTop + span * (+a.dataset.go / (n - 1)), behavior: 'instant' });
  }));
  update();
})();
`;

const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ander Sein · Del sensor a la decisión</title>
<meta name="description" content="Ander Sein, ingeniero de automatización e IIoT en Donostia: sigue la ronda de un robot de inspección, del sensor a la decisión.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,600;0,700;1,400;1,700&family=JetBrains+Mono:wght@500;600&family=Montserrat:wght@700;800&display=swap" rel="stylesheet">
<style>${oldCss}${css}</style>
</head>
<body>
<header>
  <div class="wrap nav">
    ${monogram}
    <nav aria-label="Secciones"><ul>
      <li class="opt"><a href="#dato">El dato</a></li>
      <li class="opt"><a href="#ander">Sobre mí</a></li>
      <li><a href="#proyectos">Proyectos</a></li>
      <li class="opt"><a href="#trayectoria">Trayectoria</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul></nav>
  </div>
</header>

<main id="inicio">
  <section class="story" id="dato" aria-label="La ronda de un robot de inspección: del sensor a la decisión">
    <div class="stage">
      <svg id="world" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Dibujo de una planta: robot de inspección con brazo, manómetro local y transmisor de presión, válvula manual, PC industrial con contenedores y modelo de visión, Unified Namespace, PLC, decisión de alarma y dashboard">
        <defs><filter id="blur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="7"/></filter></defs>
        ${world.svg}
        <g id="bot" class="ink">${world.bot}</g>
        <path id="route" fill="none" stroke="none"/>
        <path id="route2" fill="none" stroke="none"/>
        <g id="pk2" style="opacity:0"><circle class="halo" r="20"/><circle class="core" r="9"/></g>
        <g id="pk"><circle class="tr" r="8"/><circle class="tr" r="6.5"/><circle class="tr" r="5"/><circle class="tr" r="4"/><circle class="halo" r="24"/><circle class="core" r="11"/></g>
        <g id="lab"><rect y="-17" height="34" rx="8" width="0"/><text x="13" y="5"></text></g>
      </svg>
      <div class="caps">${caps}
      </div>
      <ol class="steps" aria-label="Etapas del recorrido">${dots}</ol>
      <a class="skip" href="#ander">Saltar la intro <span aria-hidden="true">↓</span></a>
    </div>
  </section>

  <section id="ander">
    <div class="wrap">
      <div class="about">
        <p class="eyebrow">IIoT · OT/IT · Robótica autónoma · IA</p>
        <h2>Hola, soy Ander Sein.</h2>
        ${squiggle}
        <p class="lead">Ingeniero de automatización e IIoT en Donostia. Empecé programando y poniendo en marcha PLCs en planta; hoy diseño el camino completo del dato: integración OT/IT, visión artificial y plataformas para robots autónomos de inspección.</p>
        <div class="ctas">
          <a class="btn primary" href="#proyectos">Ver proyectos</a>
          <a class="btn ghost" href="https://drive.google.com/file/d/13Tf7QVlCJIUVRZBiALA2ZDCoR75RUgZL/view">Ver CV</a>
          <a class="btn ghost" href="https://www.linkedin.com/in/ander-sein-a24097195/">LinkedIn</a>
        </div>
      </div>
      ${tail2}
  </section>
</main>
<footer class="wrap">
  <em>Del sensor al dato, del dato a la decisión.</em>
  <span>© 2026 Ander Sein</span>
</footer>
<script>${js}</script>
</body>
</html>`;
fs.writeFileSync(require('path').join(__dirname, '..', 'build', 'story.html'), html);
console.log('bytes', html.length);
