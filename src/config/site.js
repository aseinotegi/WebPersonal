'use strict';

/**
 * Site-wide settings. Anything that appears in more than one place (links,
 * colours, fonts) is defined here once.
 */

const palette = {
  background: '#060D1B',
  surface: '#0A1526',
  line: '#1B2A42',
  ink: '#E6EDF7',
  soft: '#A3B3C9',
  accent: '#22D3EE',
  alarm: '#F5A524',
};

const fonts = [
  // [family, file in /fonts, weight, style]
  ['Inter', 'inter-latin-400-normal', 400, 'normal'],
  ['Inter', 'inter-latin-600-normal', 600, 'normal'],
  ['Inter', 'inter-latin-700-normal', 700, 'normal'],
  ['Inter', 'inter-latin-400-italic', 400, 'italic'],
  ['Inter', 'inter-latin-700-italic', 700, 'italic'],
  ['Montserrat', 'montserrat-latin-700-normal', 700, 'normal'],
  ['Montserrat', 'montserrat-latin-800-normal', 800, 'normal'],
  ['JetBrains Mono', 'jetbrains-mono-latin-500-normal', 500, 'normal'],
  ['JetBrains Mono', 'jetbrains-mono-latin-600-normal', 600, 'normal'],
];

// Loaded before first paint: the display font for titles, the body font for text.
const preloadFonts = ['montserrat-latin-800-normal', 'inter-latin-400-normal'];

const site = {
  url: 'https://andersein.com/',
  language: 'es',
  title: 'Ander Sein · Del sensor a la decisión',
  shareTitle: 'Ander Sein · Automatización e IIoT',
  description:
    'Ander Sein, ingeniero de automatización e IIoT en Donostia. Sigue la ronda de un robot de inspección y verás en qué trabajo.',
  locale: 'es_ES',
};

const person = {
  name: 'Ander Sein',
  email: 'aseinotegi@gmail.com',
  location: 'Donostia-San Sebastián',
  linkedin: { url: 'https://www.linkedin.com/in/ander-sein-a24097195/', handle: 'ander-sein-a24097195' },
  github: { url: 'https://github.com/aseinotegi', handle: 'aseinotegi' },
  cv: 'https://drive.google.com/file/d/13Tf7QVlCJIUVRZBiALA2ZDCoR75RUgZL/view',
};

module.exports = { palette, fonts, preloadFonts, site, person };
