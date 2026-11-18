'use strict';

/**
 * The scroll story: a sticky stage with the plant drawing, one caption per
 * scene and the step dots. Animation happens in the browser (src/client).
 */

const { eyebrowOf } = require('../content/scenes');

const list = (items, render) => items.map(render).join('');

function renderCaption(scene, index, total) {
  const number = String(index + 1).padStart(2, '0');
  const heading = index === 0 ? `<h1>${scene.title}</h1>` : `<h2>${scene.title}</h2>`;
  const repo = scene.project && scene.project.repo;

  return `
      <article class="cap${index === 0 ? ' on' : ''}" data-i="${index}">
        <p class="lvl"><span>${number}</span>${eyebrowOf(scene)}</p>
        ${heading}
        <p class="txt">${scene.text}</p>
        ${scene.tech ? `<ul class="chips">${list(scene.tech, (t) => `<li>${t}</li>`)}</ul>` : ''}
        ${repo ? `<a class="repo" href="${repo.url}" target="_blank" rel="noopener"><span class="gh" aria-hidden="true">GitHub</span>${repo.title} <span aria-hidden="true">↗</span></a>` : ''}
        ${index === 0 ? '<p class="hint">Haz scroll <span aria-hidden="true">↓</span></p>' : ''}
        ${index === total - 1 ? '<a class="btn primary" href="#ander">Conóceme <span aria-hidden="true">↓</span></a>' : ''}
      </article>`;
}

function renderStory({ scenes, plant }) {
  const captions = scenes.map((scene, i) => renderCaption(scene, i, scenes.length)).join('');
  const dots = list(
    scenes,
    (scene, i) => `<li><button type="button" data-go="${i}" aria-label="Ir a: ${eyebrowOf(scene)}"${i === 0 ? ' class="on"' : ''}></button></li>`,
  );

  return `  <section class="story" id="dato" aria-label="La ronda de un robot de inspección: del sensor a la decisión">
    <div class="stage">
      <svg id="world" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img"
           aria-label="Dibujo de una planta: robot de inspección con brazo, manómetro local y transmisor de presión, válvula manual, PC industrial con contenedores y modelo de visión, Unified Namespace, PLC, motor de reglas y dashboard">
        <defs><filter id="blur" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="7"/></filter></defs>
        ${plant.scenery}
        <g id="bot" class="ink">${plant.robot}</g>
        <path id="route" fill="none" stroke="none"/>
        <path id="route2" fill="none" stroke="none"/>
        <g id="pk2" style="opacity:0"><circle class="halo" r="20"/><circle class="core" r="9"/></g>
        <g id="pk"><circle class="tr" r="8"/><circle class="tr" r="6.5"/><circle class="tr" r="5"/><circle class="tr" r="4"/><circle class="halo" r="24"/><circle class="core" r="11"/></g>
        <g id="lab"><rect y="-17" height="34" rx="8" width="0"/><text x="13" y="5"></text></g>
      </svg>
      <div class="caps">${captions}
      </div>
      <ol class="steps" aria-label="Etapas del recorrido">${dots}</ol>
      <a class="skip" href="#ander">Saltar la intro <span aria-hidden="true">↓</span></a>
    </div>
  </section>`;
}

module.exports = { renderStory };
