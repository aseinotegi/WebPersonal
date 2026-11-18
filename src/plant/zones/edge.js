'use strict';

/** The edge: industrial PC running the containers and the vision model. */

const icons = require('../../drawing/icons');

function drawEdge(sk) {
  sk.placed(760, 860, 3.6, () => {
    icons.industrialPc(sk, 0, 0, 34, 22);
    sk.line(-11, -11, -12, -19, { strokeWidth: 0.7 }); // antenna
    icons.wifi(sk, -12, -22);
  });
  sk.text(760, 930, 'PC INDUSTRIAL', 't-accent');

  sk.placed(470, 854, 3.4, () => icons.containers(sk, 0, 0, 28));
  sk.text(470, 932, 'CONTENEDORES', 't-accent');
  sk.line(470, 900, 470, 925, { strokeWidth: 0.5 });

  sk.placed(615, 1030, 3.2, () => icons.aiChip(sk, 0, 0, 15));
  sk.text(615, 1100, 'MODELO DE VISIÓN', 't-accent-sm');
  sk.line(760, 885, 640, 1015, { strokeWidth: 0.6 }, 'stroke-dasharray="4 6"');

  // Dashed frame: all of the above runs on the same PC.
  sk.rect(380, 790, 470, 330, { strokeWidth: 0.5, roughness: 0.6, stroke: '#5B6E8C' });
  sk.text(392, 812, 'EN EL PC INDUSTRIAL', 't-note', 'start');
}

module.exports = { drawEdge };
