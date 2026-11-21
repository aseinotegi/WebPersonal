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
  title: 'Ander Sein · Ingeniero de IIoT y automatización industrial',
  shareTitle: 'Ander Sein · Automatización e IIoT',
  description:
    'Ander Sein, ingeniero de IIoT y automatización industrial en Donostia. PLCs, Unified Namespace, visión artificial y robots de inspección, contados con la ronda de un robot.',
  locale: 'es_ES',
  // Cloudflare Web Analytics (no cookies). Empty = no analytics.
  analyticsToken: '438dc2d4fcb6441bb01c3f038fd8be1e',
};

const person = {
  name: 'Ander Sein',
  email: 'aseinotegi@gmail.com',
  location: 'Donostia-San Sebastián',
  linkedin: { url: 'https://www.linkedin.com/in/ander-sein-a24097195/', handle: 'ander-sein-a24097195' },
  github: { url: 'https://github.com/aseinotegi', handle: 'aseinotegi' },
  cv: 'https://cv.andersein.com/', // services/cv-gate
  demo: 'https://demo.andersein.com/', // the plant of the story, running (industrial-uns-demo)
  jobTitle: 'Ingeniero de IIoT y automatización industrial',
  // for search engines (schema.org Person)
  knowsAbout: ['IIoT', 'Automatización industrial', 'PLC', 'Siemens S7', 'OPC UA', 'MQTT', 'Unified Namespace', 'Visión artificial', 'Robots de inspección', 'Docker', 'Python'],
};

module.exports = { palette, fonts, preloadFonts, site, person };
