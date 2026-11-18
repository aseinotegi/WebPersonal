'use strict';

/** Sections below the story: about, facts, how I work, career and contact. */

const { person } = require('../config/site');
const { squiggle } = require('../drawing/flourishes');

const list = (items, render) => items.map(render).join('\n');

function renderAbout(about) {
  return `    <section id="ander">
      <div class="about">
        <p class="eyebrow">${about.eyebrow}</p>
        <h2>${about.title}</h2>
        ${squiggle(72)}
        <p class="lead">${about.lead}</p>
        <div class="ctas">
          <a class="btn primary" href="#proyectos">Ver proyectos</a>
          <a class="btn ghost" href="${person.cv}">Ver CV</a>
          <a class="btn ghost" href="${person.linkedin.url}">LinkedIn</a>
        </div>
      </div>
    </section>`;
}

function renderFacts(facts) {
  return `    <div class="facts">
${list(facts, (f) => `      <div class="fact"><b>${f.value}</b><span>${f.text}</span></div>`)}
    </div>`;
}

function renderWorkflow(workflow) {
  return `    <section id="como-trabajo">
      <div class="sec-head"><h2>Cómo trabajo</h2><p>${workflow.intro}</p></div>
      <div class="how">
${list(workflow.principles, (p) => `        <div><h3>${p.title}</h3><p>${p.text}</p></div>`)}
      </div>
    </section>`;
}

function renderCareer(career) {
  const job = (j) =>
    `        <li><time>${j.period}</time><div class="cell"><h3>${j.role}</h3><p class="org">${j.company}</p><p>${j.summary}</p></div></li>`;
  const course = (e) => `        <div><b>${e.title}</b> · ${e.detail}</div>`;

  return `    <section id="trayectoria">
      <div class="sec-head"><h2>Trayectoria</h2></div>
      <ol class="tl">
${list(career.jobs, job)}
      </ol>
      <div class="edu">
${list(career.education, course)}
      </div>
    </section>`;
}

function renderContact(contact) {
  return `    <section id="contacto">
      <div class="contact">
        <div>
          <h2>${contact.title}</h2>
          <p>${contact.text}</p>
        </div>
        <ul class="links">
          <li><span>Email</span><a href="mailto:${person.email}">${person.email}</a></li>
          <li><span>LinkedIn</span><a href="${person.linkedin.url}">${person.linkedin.handle}</a></li>
          <li><span>GitHub</span><a href="${person.github.url}">${person.github.handle}</a></li>
          <li><span>Base</span>${person.location}</li>
        </ul>
      </div>
    </section>`;
}

module.exports = { renderAbout, renderFacts, renderWorkflow, renderCareer, renderContact };
