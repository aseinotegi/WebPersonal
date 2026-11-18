'use strict';

/** Page chrome: font loading, the sticky header and the footer. */

const { fonts, preloadFonts, person } = require('../config/site');
const { monogram } = require('../drawing/flourishes');

function renderFontPreloads() {
  return preloadFonts
    .map((file) => `<link rel="preload" href="fonts/${file}.woff2" as="font" type="font/woff2" crossorigin>`)
    .join('\n');
}

/** Fonts are served from /fonts: no request to third parties (GDPR) and no layout shift. */
function renderFontFaces() {
  return fonts
    .map(
      ([family, file, weight, style]) =>
        `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url(fonts/${file}.woff2) format('woff2')}`,
    )
    .join('\n');
}

function renderHeader() {
  return `<header>
  <div class="wrap nav">
    <a class="brand" href="#inicio" aria-label="${person.name}, inicio">${monogram()}<span>${person.name}</span></a>
    <nav aria-label="Secciones"><ul>
      <li class="opt"><a href="#dato">El dato</a></li>
      <li class="opt"><a href="#ander">Sobre mí</a></li>
      <li><a href="#proyectos">Proyectos</a></li>
      <li class="opt"><a href="#trayectoria">Trayectoria</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul></nav>
  </div>
</header>`;
}

function renderFooter(motto) {
  return `<footer class="wrap">
  <em>${motto}</em>
  <span>© ${new Date().getFullYear()} ${person.name}</span>
</footer>`;
}

module.exports = { renderFontPreloads, renderFontFaces, renderHeader, renderFooter };
