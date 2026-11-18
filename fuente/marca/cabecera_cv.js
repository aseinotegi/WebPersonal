require('fs').mkdirSync(require('path').join(__dirname, '..', 'build', 'marca'), { recursive: true });
const fs = require('fs');
const make = require('../lib.js');
const TEAL = '#177F72', W = 262.5, H = 165;
const L = make(52, { ink: '#FFFFFF', accent: '#BFF5EC', bg: TEAL });
const { line, DASH, add, gen, o } = L;
const N = { plc: [24, 30], gauge: [26, 70], cont: [70, 20], node: [216, 9] };
line(-4, 12, 14, 24, { strokeWidth: 0.7 });
line(-4, 50, 18, 64, { strokeWidth: 0.7 });
line(...N.plc, ...N.gauge, { strokeWidth: 0.7 });
line(...N.plc, ...N.cont, { strokeWidth: 0.7 });
line(...N.gauge, 64, 92, { strokeWidth: 0.6 }, DASH);      // runs behind photo
line(...N.cont, 110, 6, { strokeWidth: 0.7 });              // behind photo top
line(150, 4, ...N.node, { strokeWidth: 0.7 });
line(...N.node, 266, 2, { strokeWidth: 0.6 }, DASH);
line(...N.node, 252, 20, { strokeWidth: 0.6 }, DASH);
L.plc(...N.plc, 20, 16);
L.gauge(N.gauge[0], N.gauge[1] - 1, 17);
L.containers(N.cont[0], N.cont[1], 26);
L.handCircle(...N.node, 6, { fill: TEAL, passes: 2 }); L.dot(...N.node, 1.2);
L.wifi(N.node[0], N.node[1] - 4);
const dots = []; for (let x = 4; x <= W; x += 10) for (let y = 4; y <= H; y += 10) dots.push(`<circle cx="${x}" cy="${y}" r="0.4" fill="#FFFFFF" opacity="0.14"/>`);
const band = `0,0 262.5,0 262.25,0 0,108.75`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2100" height="1320" viewBox="0 0 ${W} ${H}">
<defs><clipPath id="b"><polygon points="${band}"/></clipPath></defs>
<rect width="${W}" height="${H}" fill="#F1F1F1"/>
<polygon points="${band}" fill="${TEAL}"/>
<g clip-path="url(#b)">${dots.join('')}${L.out.join('\n')}</g></svg>`;
fs.writeFileSync(require('path').join(__dirname, '..', 'build', 'marca', 'cvband.svg'), svg); console.log('ok');
