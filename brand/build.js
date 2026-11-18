'use strict';

/**
 * Generates the brand pieces as SVG in build/brand/. The PNGs in brand/exports
 * are those SVGs rendered at their pixel size (name, QR and contact details of
 * the card were then laid out in Canva).
 *
 * Usage: npm run brand
 */

const fs = require('fs');
const path = require('path');
const { drawCardFront, LABEL_AREAS } = require('./card-front');
const { drawCardBack } = require('./card-back');
const { drawLinkedInBanner, drawBackground16x9 } = require('./social');
const { drawCvHeader } = require('./cv-header');

const OUT = path.join(__dirname, '..', 'build', 'brand');
fs.mkdirSync(OUT, { recursive: true });

const write = (name, svg) => fs.writeFileSync(path.join(OUT, name), svg);

const back = drawCardBack();
write('card-front.svg', drawCardFront());
write('card-back.svg', back.svg);
write('linkedin-banner.svg', drawLinkedInBanner());
write('background-16x9.svg', drawBackground16x9());
write('cv-header.svg', drawCvHeader());

// Where to place the labels in Canva (x, y, width in card units).
console.log('front labels:', JSON.stringify(LABEL_AREAS));
console.log('back labels:', JSON.stringify(back.boxes));
console.log(`brand pieces written to ${path.relative(process.cwd(), OUT)}/`);
