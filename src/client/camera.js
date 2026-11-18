// Camera: moves the SVG viewBox over the plant.
//
// A camera position is a centre (x, y) and a width in world units. On wide
// screens the captions take the left 40 %, so the camera shifts to keep the
// subject on the right. On phones the caption sits at the bottom, so the
// camera zooms in and shifts the subject up.

const DESKTOP_MIN_WIDTH = 820;

function createCamera(svg) {
  const camera = {
    viewBox: [0, 0, 1, 1],

    isDesktop() {
      return (svg.clientWidth || innerWidth) >= DESKTOP_MIN_WIDTH;
    },

    /** Frames the plant and returns the visible width in world units. */
    frame(x, y, width) {
      const screenWidth = svg.clientWidth || innerWidth;
      const screenHeight = svg.clientHeight || innerHeight;
      const aspect = screenHeight / screenWidth;
      let w, h;
      if (screenWidth >= DESKTOP_MIN_WIDTH) {
        w = width;
        h = width * aspect;
        x -= width * 0.16;
      } else {
        w = width * 0.52;
        h = w * aspect;
        y += h * 0.17;
      }
      camera.viewBox = [x - w / 2, y - h / 2, w, h];
      svg.setAttribute('viewBox', camera.viewBox.map((v) => v.toFixed(1)).join(' '));
      return w;
    },

    /** World units per screen pixel: keeps packets and labels the same size at any zoom. */
    unitsPerPixel(visibleWidth) {
      return visibleWidth / (svg.clientWidth || innerWidth);
    },
  };
  return camera;
}
