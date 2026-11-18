'use strict';

/** Diagonal header band for the CV (teal version, to sit on a light page). */

const { Sketch, DASHED } = require('../src/drawing/sketch');
const icons = require('../src/drawing/icons');
const { dotGrid } = require('./common');

const TEAL = '#177F72';
const WIDTH = 262.5;
const HEIGHT = 165;
const BAND = '0,0 262.5,0 262.25,0 0,108.75';

function drawCvHeader() {
  const sk = new Sketch({ seed: 52, colors: { ink: '#FFFFFF', accent: '#BFF5EC', background: TEAL } });
  const n = { plc: [24, 30], gauge: [26, 70], cont: [70, 20], node: [216, 9] };

  sk.line(-4, 12, 14, 24, { strokeWidth: 0.7 });
  sk.line(-4, 50, 18, 64, { strokeWidth: 0.7 });
  sk.line(...n.plc, ...n.gauge, { strokeWidth: 0.7 });
  sk.line(...n.plc, ...n.cont, { strokeWidth: 0.7 });
  sk.line(...n.gauge, 64, 92, { strokeWidth: 0.6 }, DASHED); // runs behind the photo
  sk.line(...n.cont, 110, 6, { strokeWidth: 0.7 });
  sk.line(150, 4, ...n.node, { strokeWidth: 0.7 });
  sk.line(...n.node, 266, 2, { strokeWidth: 0.6 }, DASHED);
  sk.line(...n.node, 252, 20, { strokeWidth: 0.6 }, DASHED);

  icons.plc(sk, ...n.plc, 20, 16);
  icons.gauge(sk, n.gauge[0], n.gauge[1] - 1, 17);
  icons.containers(sk, n.cont[0], n.cont[1], 26);
  sk.circle(...n.node, 6, { fill: TEAL, passes: 2 });
  sk.dot(...n.node, 1.2);
  icons.wifi(sk, n.node[0], n.node[1] - 4);

  const grid = dotGrid({ fromX: 4, toX: WIDTH, fromY: 4, toY: HEIGHT, step: 10, radius: 0.4, color: '#FFFFFF', opacity: 0.14 });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="2100" height="1320" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<defs><clipPath id="b"><polygon points="${BAND}"/></clipPath></defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="#F1F1F1"/>
<polygon points="${BAND}" fill="${TEAL}"/>
<g clip-path="url(#b)">${grid}${sk.strokeMarkup('\n')}</g></svg>`;
}

module.exports = { drawCvHeader };
