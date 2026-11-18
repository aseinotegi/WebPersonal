'use strict';

/** The Unified Namespace: the hub every source publishes to, with its topic tree. */

const { unsHub } = require('../layout');

const topics = [
  ['planta1/exterior/', 't-accent'],
  ['  pi-104/presion  6,8', 't-note'],
  ['  pt-104/presion  6,7', 't-note'],
  ['  xv-104/orden    cerrar', 't-note'],
  ['planta2/ · planta3/ …', 't-note-sm'],
];

function drawUns(sk) {
  const [x, y] = unsHub;
  sk.mask(x - 66, y - 66, 132, 132, 66);
  sk.circle(x, y, 60, { passes: 2, width: 1 });
  sk.circle(x, y, 44, { width: 0.5 });
  sk.text(x, y + 7, 'UNS', 't-strong');

  sk.mask(640, 1622, 236, 128, 8);
  topics.forEach(([topic, className], i) => {
    // non-breaking spaces keep the indentation of the tree
    sk.text(648, 1642 + i * 23, topic.replace(/ /g, ' '), className, 'start');
  });
}

module.exports = { drawUns };
