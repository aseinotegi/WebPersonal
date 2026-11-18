// Footer: when the dock scrolls into view the robot drives home and charges.
//
// Without this script (or with reduced motion) the dock simply shows its final
// state: robot parked, light on, battery full. The script first sends the robot
// away, then brings it back once the visitor gets there.

function startDock() {
  const dock = document.getElementById('dock');
  const bot = document.getElementById('dock-bot');
  if (!dock || !bot || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  dock.classList.add('away');

  const arrive = () => dock.classList.remove('moving');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      requestAnimationFrame(() => {
        dock.classList.replace('away', 'moving');
        bot.addEventListener('transitionend', arrive, { once: true });
        setTimeout(arrive, 3200); // in case transitionend never fires
      });
    },
    { threshold: 0.6 },
  );
  observer.observe(dock);
}

startDock();
