'use strict';

/** The rule engine: a service subscribed to the UNS that cross-checks both sources. */

const { ruleEngine } = require('../layout');

function drawRuleEngine(sk) {
  const x = ruleEngine[0];
  const y = ruleEngine[1] - 40;
  sk.mask(x - 6, y - 6, 232, 148, 10);
  sk.rect(x, y, 220, 136, { strokeWidth: 1, roughness: 0.7 });
  sk.line(x, y + 28, x + 220, y + 28, { strokeWidth: 0.6, roughness: 0.3 });
  sk.text(x + 12, y + 19, 'MOTOR DE REGLAS', 't-accent', 'start');
  sk.text(x + 12, y + 54, 'si visión &gt; 6 bar', 't-note', 'start');
  sk.text(x + 12, y + 78, 'y PLC &gt; 6 bar', 't-note', 'start');
  sk.text(x + 12, y + 110, '→ cerrar XV-104', 't-strong', 'start');
}

module.exports = { drawRuleEngine };
