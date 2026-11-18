'use strict';

/**
 * Projects index: the same projects as the story, as a plain list, for
 * visitors who skip the animation. Built from the scenes, so there is a
 * single source for every project.
 */

function renderProjectRow(scene, sceneIndex) {
  const { number, area, indexTitle, repo, status } = scene.project;
  const subtitle = repo ? `${area} · caso: ${repo.title}` : area;
  const link = repo
    ? `<a href="${repo.url}" target="_blank" rel="noopener">GitHub ↗</a>`
    : `<em>${status || 'experiencia'}</em>`;

  return `
        <li>
          <span class="n">${number}</span>
          <div class="pi-main"><strong>${indexTitle || scene.title}</strong><span>${subtitle}</span></div>
          <div class="pi-links"><a href="#dato" data-go="${sceneIndex}">Ver en la historia</a>${link}</div>
        </li>`;
}

function renderProjects({ scenes, intro }) {
  const rows = scenes
    .map((scene, i) => (scene.project ? renderProjectRow(scene, i) : ''))
    .join('');

  return `    <section id="proyectos">
      <div class="sec-head">
        <h2>Proyectos</h2>
        <p>${intro}</p>
      </div>
      <ol class="pindex">${rows}
      </ol>
    </section>`;
}

module.exports = { renderProjects };
