// Scroll story: turns the scroll position into camera, robot and packet moves.
//
// The page is N scenes tall. Scroll progress t goes from 0 to N-1; its integer
// part is the current scene and the fraction is how far we are into the
// transition towards the next one. Each transition first holds still for a
// moment (so captions can be read) and then eases into the next scene.
//
// CONFIG is injected by the build: routes, scene staging and robot geometry.

const HOLD = 0.32; // share of each transition spent standing still
const LABEL_OFFSET = 22; // px between the packet and its value label
const TRAIL_SPACING = 14; // px between the dots of the packet trail

function startStory() {
  const $ = (id) => document.getElementById(id);
  const story = $('dato');
  const svg = $('world');
  const camera = createCamera(svg);
  const scenes = CONFIG.scenes;
  const last = scenes.length - 1;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const el = {
    robot: $('bot'),
    arm: $('arm'),
    wheel: $('wheel'),
    packet: $('pk'),
    trail: [...$('pk').querySelectorAll('.tr')],
    plcPacket: $('pk2'),
    label: $('lab'),
    labelText: $('lab').querySelector('text'),
    labelBox: $('lab').querySelector('rect'),
    valveBadge: $('b-valve'),
    badges: [...svg.querySelectorAll('.badge')],
    captions: [...document.querySelectorAll('.cap')],
    dots: [...document.querySelectorAll('.steps button')],
  };

  // Routes are drawn once; positions along them are then looked up by length.
  const route = $('route');
  route.setAttribute('d', smoothPath(CONFIG.routes.packet));
  const plcRoute = $('route2');
  plcRoute.setAttribute('d', smoothPath(CONFIG.routes.plc));

  let previous = 0;
  const stopLengths = scenes.map((scene) => (previous = lengthAtPoint(route, scene.point, previous)));
  const plcRouteLength = plcRoute.getTotalLength();
  const plcInletLength = lengthAtPoint(plcRoute, CONFIG.plcInlet, 0, 2);

  const plcScene = scenes.findIndex((s) => s.plcPublishes);
  const valveScene = scenes.findIndex((s) => s.closesValve);

  const state = { caption: -1, labelText: null, labelWidth: 0 };

  // ------------------------------------------------------------ progress

  function readProgress() {
    const span = story.offsetHeight - innerHeight;
    const t = clamp01(-story.getBoundingClientRect().top / span) * last;
    let index = Math.min(Math.floor(t), last);
    let fraction = t - index;
    if (index >= last) {
      index = last;
      fraction = 0;
    }
    const moved = fraction < HOLD ? 0 : easeInOutCubic((fraction - HOLD) / (1 - HOLD));
    const from = scenes[index];
    const to = scenes[Math.min(index + 1, last)];
    // Some scenes keep the camera still at first (the valve has to turn).
    const s = from.wait ? clamp01((moved - from.wait) / (1 - from.wait)) : moved;
    return { index, from, to, raw: moved, s };
  }

  // -------------------------------------------------------------- actors

  function moveCamera({ index, from, to, s }) {
    const zoomOut = index < last ? to.zoomOut * Math.sin(Math.PI * s) : 0;
    return camera.frame(lerp(from.camera[0], to.camera[0], s), lerp(from.camera[1], to.camera[1], s), lerp(from.camera[2], to.camera[2], s) + zoomOut);
  }

  function moveRobot({ from, to, s }) {
    const x = lerp(from.robotX, to.robotX, s);
    const driving = from.robotX !== to.robotX && s > 0 && s < 1;
    const bump = driving && !reduceMotion ? Math.sin(s * Math.PI * 10) * 2.5 : 0;
    el.robot.setAttribute('transform', `translate(${x.toFixed(1)} ${(CONFIG.robot.y + bump).toFixed(1)}) scale(${CONFIG.robot.scale})`);
  }

  function movePacket({ index, s }, unit) {
    const length = lerp(stopLengths[index], stopLengths[Math.min(index + 1, last)], s);
    const p = route.getPointAtLength(length);
    el.packet.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${unit.toFixed(3)})`);

    const moving = s > 0 && s < 1;
    el.trail.forEach((dot, j) => {
      const q = route.getPointAtLength(Math.max(length - (j + 1) * TRAIL_SPACING * unit, 0));
      dot.setAttribute('cx', ((q.x - p.x) / unit).toFixed(1));
      dot.setAttribute('cy', ((q.y - p.y) / unit).toFixed(1));
      dot.style.opacity = moving ? 0.5 - j * 0.11 : 0;
    });

    // Fades in on the first transition and out before the closing scene.
    el.packet.style.opacity = index === 0 ? s : index === last - 1 ? 1 - s : index === last ? 0 : 1;
    return p;
  }

  /** PLC value: travels PLC → UNS while the PLC scene comes in, then UNS → rule engine. */
  function movePlcPacket({ index, s }, unit) {
    let length = -1;
    let opacity = 0;
    if (index === plcScene - 1) {
      length = plcInletLength * clamp01((s - 0.35) / 0.65);
      opacity = clamp01((s - 0.3) * 5);
    } else if (index === plcScene) {
      length = plcInletLength + (plcRouteLength - plcInletLength) * s;
      opacity = 1;
    } else if (index === plcScene + 1) {
      length = plcRouteLength;
      opacity = 1 - clamp01(s * 3);
    }
    el.plcPacket.style.opacity = opacity;
    if (length >= 0) {
      const q = plcRoute.getPointAtLength(length);
      el.plcPacket.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) scale(${unit.toFixed(3)})`);
    }
  }

  /** The arm reaches the wheel when the order arrives, turns it, then folds back. */
  function animateValve({ index, raw, s }) {
    let reach = 0;
    if (index === valveScene - 1) reach = clamp01((s - 0.8) / 0.2);
    else if (index === valveScene) reach = raw < 0.3 ? 1 : 1 - clamp01((raw - 0.3) / 0.15);
    const [px, py] = CONFIG.armPivot;
    el.arm.setAttribute('transform', `rotate(${((1 - reach) * -133).toFixed(1)} ${px} ${py})`);

    const turn = index < valveScene ? 0 : index === valveScene ? -270 * clamp01(raw / 0.3) : -270;
    const [wx, wy] = CONFIG.valveWheel;
    el.wheel.setAttribute('transform', `rotate(${turn.toFixed(1)} ${wx} ${wy})`);
    el.valveBadge.classList.toggle('on', index === valveScene && raw > 0.3);
  }

  // ----------------------------------------------------------------- text

  /** The value label fades out mid-flight and comes back with the next scene's value. */
  function updateLabel({ from, to, s }, packet, unit) {
    const text = s < 0.5 ? from.label : to.label;
    if (text !== state.labelText) {
      state.labelText = text;
      el.labelText.textContent = text || '';
      state.labelWidth = text ? el.labelText.getComputedTextLength() + 26 : 0;
      el.labelBox.setAttribute('width', state.labelWidth.toFixed(1));
      el.labelBox.setAttribute('x', 0);
    }
    el.label.style.opacity = text ? Math.abs(s - 0.5) * 2 : 0;

    // Right of the packet if it fits, otherwise left; never under the step dots.
    const [vx, , vw] = camera.viewBox;
    const margin = (camera.isDesktop() ? 70 : 10) * unit;
    const width = state.labelWidth * unit;
    let x = packet.x + LABEL_OFFSET * unit;
    if (x + width > vx + vw - margin) x = packet.x - LABEL_OFFSET * unit - width;
    x = Math.min(Math.max(x, vx + 10 * unit), vx + vw - margin - width);
    el.label.setAttribute('transform', `translate(${x.toFixed(1)} ${(packet.y - 42 * unit).toFixed(1)}) scale(${unit.toFixed(3)})`);
  }

  function updateCaption({ index, s }) {
    const current = s < 0.55 ? index : Math.min(index + 1, last);
    if (current === state.caption) return;
    state.caption = current;
    const visibleBadges = scenes[current].badges;
    el.badges.forEach((b) => {
      if (b !== el.valveBadge) b.classList.toggle('on', visibleBadges.includes(b.id));
    });
    svg.classList.toggle('map', scenes[current].map);
    el.captions.forEach((c, j) => c.classList.toggle('on', j === current));
    el.dots.forEach((d, j) => d.classList.toggle('on', j === current));
  }

  // ---------------------------------------------------------------- frame

  function render() {
    const progress = readProgress();
    const visibleWidth = moveCamera(progress);
    const unit = camera.unitsPerPixel(visibleWidth);
    moveRobot(progress);
    const packet = movePacket(progress, unit);
    movePlcPacket(progress, unit);
    animateValve(progress);
    updateLabel(progress, packet, unit);
    updateCaption(progress);
  }

  let scheduled = false;
  const requestRender = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  };
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', requestRender);

  // ----------------------------------------------------------- navigation

  const scrollToScene = (index, behavior) => {
    const span = story.offsetHeight - innerHeight;
    scrollTo({ top: story.offsetTop + span * (index / last), behavior });
  };
  el.dots.forEach((dot, j) => dot.addEventListener('click', () => scrollToScene(j, reduceMotion ? 'auto' : 'smooth')));
  document.querySelectorAll('.pindex [data-go]').forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      scrollToScene(+link.dataset.go, 'instant');
    }),
  );

  render();
}

startStory();
