// Footer: the robot's way home follows the scroll, like the story above.
//
// From the moment the dock appears at the bottom of the screen until the end
// of the page, the robot drives from the left towards its charging station. It
// only plugs in (light on, bolt, credit line) when the visitor reaches the very
// bottom; scrolling back up sends it out again.
//
// Without this script, or with reduced motion, the dock shows its final state.

function startDock() {
  const dock = document.getElementById('dock');
  const bot = document.getElementById('dock-bot');
  if (!dock || !bot) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const style = getComputedStyle(bot);
  const startX = parseFloat(style.getPropertyValue('--start'));
  const homeX = parseFloat(style.getPropertyValue('--home'));
  const y = parseFloat(style.getPropertyValue('--y'));
  const PLUG_IN = 0.97; // progress at which the robot touches the station
  const LEAD = 160; // px of scroll before the dock shows, so the drive is not over in one flick
  const smooth = (t) => t * t * (3 - 2 * t);

  let queued = false;
  let lastX = null;
  let stopTimer = 0;

  function progress() {
    const pageEnd = document.documentElement.scrollHeight - innerHeight;
    const dockTop = dock.getBoundingClientRect().top + scrollY;
    const from = dockTop - innerHeight - LEAD;
    const range = pageEnd - from;
    if (range < 40) return 1;
    return Math.min(1, Math.max(0, (scrollY - from) / range));
  }

  function render() {
    queued = false;
    const p = progress();
    const x = startX + (homeX - startX) * smooth(Math.min(1, p / PLUG_IN));
    bot.style.transform = `translate(${x.toFixed(2)}px, ${y}px)`;
    dock.classList.toggle('charged', p >= PLUG_IN);

    // Little bump while it moves, stops shortly after the scroll does.
    if (lastX !== null && Math.abs(x - lastX) > 0.05) {
      dock.classList.add('moving');
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => dock.classList.remove('moving'), 160);
    }
    lastX = x;
  }

  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(render);
    }
  };

  dock.classList.add('scrub');
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  render();
}

startDock();
