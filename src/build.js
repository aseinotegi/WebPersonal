'use strict';

/**
 * Builds index.html.
 *
 *   content (what is said) ─┐
 *   plant drawing ──────────┼─► sections (HTML) ─┐
 *   choreography ───────────┘                    ├─► templates/page.html ─► index.html
 *   styles/*.css ────────────────────────────────┤
 *   client/*.js + CONFIG ────────────────────────┘
 *
 * The result is a single self-contained page: no framework, no requests to
 * third parties, nothing to install for the visitor.
 *
 * Usage: npm run build
 */

const fs = require('fs');
const path = require('path');

const { palette, site } = require('./config/site');
const { scenes } = require('./content/scenes');
const profile = require('./content/profile');
const { drawPlant } = require('./plant');
const { choreography } = require('./plant/choreography');
const { armPivot } = require('./plant/actors');
const { renderFontPreloads, renderFontFaces, renderHeader, renderFooter } = require('./sections/chrome');
const { renderStory } = require('./sections/story');
const { renderProjects } = require('./sections/projects');
const { renderAbout, renderFacts, renderCareer, renderContact } = require('./sections/profile');

const SRC = __dirname;
const OUTPUT = path.join(SRC, '..', 'index.html');

// Order matters: later files may refine earlier ones.
const STYLES = ['base.css', 'header.css', 'sections.css', 'story.css', 'plant.css'];
// Plain scripts sharing one scope; story.js uses the helpers defined before it.
const SCRIPTS = ['geometry.js', 'camera.js', 'story.js', 'dock.js', 'cv-link.js'];

const read = (...parts) => fs.readFileSync(path.join(SRC, ...parts), 'utf8');

/** Replaces {{name}} placeholders; fails loudly if one is left unfilled. */
function fillTemplate(template, values) {
  const html = template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!(key in values)) throw new Error(`Template value missing: ${key}`);
    return values[key];
  });
  return html;
}

function buildStyles() {
  const tokens = Object.entries(palette)
    .map(([name, value]) => `--${name === 'background' ? 'bg' : name}:${value};`)
    .join('');
  return [
    renderFontFaces(),
    `:root{${tokens}--scenes:${scenes.length};}`,
    ...STYLES.map((file) => read('styles', file)),
  ].join('\n');
}

/** Everything the browser needs to animate the story, as plain data. */
function buildClientConfig(layout) {
  const stagedScenes = scenes.map((scene) => {
    const stage = choreography[scene.id];
    if (!stage) throw new Error(`No choreography for scene "${scene.id}"`);
    return {
      point: layout.anchors[stage.anchor],
      camera: stage.camera,
      robotX: stage.robotX,
      label: stage.label || '',
      zoomOut: stage.zoomOut || 0,
      wait: stage.wait || 0,
      badges: stage.badges || [],
      plcPublishes: Boolean(stage.plcPublishes),
      closesValve: Boolean(stage.closesValve),
      map: Boolean(stage.map),
    };
  });

  return {
    robot: { y: layout.robot.y, scale: layout.robot.scale },
    armPivot,
    valveWheel: layout.valveWheel,
    plcInlet: layout.plcInlet,
    routes: { packet: layout.packetRoute, plc: layout.plcRoute },
    scenes: stagedScenes,
  };
}

function buildScript(config) {
  const code = SCRIPTS.map((file) => read('client', file)).join('\n');
  return `(() => {\nconst CONFIG = ${JSON.stringify(config)};\n\n${code}\n})();`;
}

function build() {
  const plant = drawPlant();

  const html = fillTemplate(read('templates', 'page.html'), {
    language: site.language,
    title: site.title,
    description: site.description,
    url: site.url,
    shareTitle: site.shareTitle,
    locale: site.locale,
    themeColor: palette.background,
    fontPreloads: renderFontPreloads(),
    styles: buildStyles(),
    header: renderHeader(),
    story: renderStory({ scenes, plant }),
    about: renderAbout(profile.about),
    facts: renderFacts(profile.facts),
    projects: renderProjects({ scenes }),
    career: renderCareer(profile.career),
    contact: renderContact(profile.contact),
    footer: renderFooter(),
    script: buildScript(buildClientConfig(plant.layout)),
  });

  fs.writeFileSync(OUTPUT, html);
  console.log(`index.html written (${(html.length / 1024).toFixed(0)} KB)`);
}

build();
