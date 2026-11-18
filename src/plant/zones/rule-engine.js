'use strict';

/**
 * The rule engine: a service subscribed to the UNS that cross-checks both
 * sources. Drawn as the rule itself, a few lines of code; each condition sits
 * where its value arrives (vision on the first line, PLC on the second).
 */

const { ruleEngine } = require('../layout');

const keyword = (word) => `<tspan class="k">${word}</tspan>`;
const number = (value) => `<tspan class="n">${value}</tspan>`;

function drawRuleEngine(sk) {
  const x = ruleEngine[0];
  const y = ruleEngine[1] - 40;
  sk.mask(x - 6, y - 6, 232, 148, 10);
  sk.rect(x, y, 220, 136, { strokeWidth: 1, roughness: 0.7 });
  sk.line(x, y + 28, x + 220, y + 28, { strokeWidth: 0.6, roughness: 0.3 });
  sk.text(x + 12, y + 19, 'MOTOR DE REGLAS', 't-accent', 'start');
  sk.text(x + 12, y + 54, `${keyword('if')} (vision &gt; ${number(6)}`, 't-code', 'start');
  sk.text(x + 30, y + 78, `${keyword('and')} plc &gt; ${number(6)}):`, 't-code', 'start');
  sk.text(x + 30, y + 112, 'cerrar("XV-104")', 't-code-strong', 'start');
}

module.exports = { drawRuleEngine };
