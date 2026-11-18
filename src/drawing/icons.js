'use strict';

/**
 * Icon library. Each icon is drawn around its centre (cx, cy) in small "icon
 * units" (the business card is 336 × 192 of them) and masks the area behind it,
 * so connection lines can be drawn first and simply disappear under the icon.
 *
 * All functions take the Sketch as first argument.
 */

const thin = { strokeWidth: 0.55, roughness: 0.2 };

function industrialPc(sk, cx, cy, w = 30, h = 20) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  sk.mask(x - 2, y - 2, w + 4, h + 4);
  for (let i = 2; i < w - 1; i += 2.6) sk.line(x + i, y, x + i, y + 4, { strokeWidth: 0.55, roughness: 0.3 }); // cooling fins
  sk.rect(x, y + 4, w, h - 4);
  sk.rect(x + 3, y + h - 7, 4.5, 3, { strokeWidth: 0.6 }); // ports
  sk.rect(x + 9, y + h - 7, 4.5, 3, { strokeWidth: 0.6 });
  sk.rect(x + 15, y + h - 7, 3, 3, { strokeWidth: 0.6 });
  sk.line(x + 3, y + 8.5, x + 13, y + 8.5, { strokeWidth: 0.5, roughness: 0.3 });
  sk.dot(x + w - 4, y + h - 5.5, 1.1); // status LEDs
  sk.dot(x + w - 8, y + h - 5.5, 0.8, sk.colors.ink);
}

function containers(sk, cx, cy, w = 26) {
  const h = 8;
  const x = cx - w / 2;
  const y = cy;
  sk.mask(x - 2, y - h - 3, w + 4, 2 * h + 5);
  const box = (bx, by, bw) => {
    sk.rect(bx, by, bw, h);
    for (let i = 2.6; i < bw - 3; i += 2.4) sk.line(bx + i, by + 1.2, bx + i, by + h - 1.2, { strokeWidth: 0.45, roughness: 0.2 });
    sk.line(bx + bw - 2.2, by + 1.2, bx + bw - 2.2, by + h - 1.2, { stroke: sk.colors.accent, strokeWidth: 0.7, roughness: 0.2 });
  };
  box(x, y, w);
  box(x + 3, y - h - 1, w * 0.62);
}

function camera(sk, cx, cy, w = 22, h = 12) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const bodyWidth = w * 0.58;
  sk.mask(x - 2, y - 2, w + 4, h + 6);
  sk.rect(x + w - bodyWidth, y, bodyWidth, h);
  sk.rect(x + 2.5, y + h * 0.18, w - bodyWidth - 2.5, h * 0.64, { strokeWidth: 0.7 }); // lens barrel
  sk.line(x + 6, y + h * 0.18, x + 6, y + h * 0.82, { strokeWidth: 0.5, roughness: 0.2 });
  sk.ellipse(x + 2.5, cy, 3.2, h * 0.64, { stroke: sk.colors.accent, strokeWidth: 0.9, roughness: 0.3 });
  sk.dot(x + w - 3, y + 2.6, 0.9);
  sk.line(cx + 3, y + h, cx + 3, y + h + 3, { strokeWidth: 0.6 }); // mount
  sk.line(cx, y + h + 3, cx + 6, y + h + 3, { strokeWidth: 0.6 });
}

function plc(sk, cx, cy, w = 20, h = 16) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  sk.mask(x - 2, y - 2, w + 4, h + 4);
  sk.rect(x, y, w, h);
  for (let i = 2; i < w - 2; i += 3) {
    sk.rect(x + i, y + 1.5, 2, 2, { strokeWidth: 0.45, roughness: 0.2 }); // terminals
    sk.rect(x + i, y + h - 3.5, 2, 2, { strokeWidth: 0.45, roughness: 0.2 });
  }
  sk.rect(x + 2.5, y + 5.5, w * 0.45, h - 11, { strokeWidth: 0.55 }); // display
  for (let j = 0; j < 3; j++) sk.dot(x + w - 4, y + 6 + j * 2, 0.6, j === 1 ? sk.colors.ink : sk.colors.accent);
}

function gauge(sk, cx, cy, d = 17) {
  const r = d / 2;
  sk.mask(cx - r - 2, cy - r - 2, d + 4, d + 8, 6);
  sk.circle(cx, cy, d, { width: 0.8 });
  for (let deg = 200; deg <= 340; deg += 35) {
    const t = (deg * Math.PI) / 180;
    sk.line(cx + Math.cos(t) * (r - 1.2), cy + Math.sin(t) * (r - 1.2), cx + Math.cos(t) * (r - 3), cy + Math.sin(t) * (r - 3), {
      strokeWidth: 0.5,
      roughness: 0.2,
    });
  }
  sk.line(cx, cy, cx + 4.2, cy - 3.6, { stroke: sk.colors.accent, strokeWidth: 0.9, roughness: 0.2 }); // needle
  sk.dot(cx, cy, 1, sk.colors.ink);
  sk.rect(cx - 1.5, cy + r, 3, 2.5, { strokeWidth: 0.6 }); // stem
  sk.line(cx - 7, cy + r + 3.5, cx + 7, cy + r + 3.5, { strokeWidth: 0.8 });
}

function smallArm(sk, cx, cy, size = 20) {
  const k = size / 20;
  sk.mask(cx - 9 * k, cy - 10 * k, 22 * k, 21 * k, 3);
  sk.rect(cx - 6 * k, cy + 7 * k, 10 * k, 3 * k, { strokeWidth: 0.7 });
  sk.line(cx - 1 * k, cy + 7 * k, cx - 3 * k, cy - 1 * k, { strokeWidth: 1.1 });
  sk.line(cx - 3 * k, cy - 1 * k, cx + 5 * k, cy - 7 * k, { strokeWidth: 1.1 });
  sk.circle(cx - 3 * k, cy - 1 * k, 3.4 * k, { fill: sk.colors.background, width: 0.7 });
  sk.circle(cx - 1 * k, cy + 7 * k, 3.4 * k, { fill: sk.colors.background, width: 0.7 });
  sk.line(cx + 5 * k, cy - 7 * k, cx + 9 * k, cy - 8.5 * k, { strokeWidth: 0.7 });
  sk.line(cx + 5 * k, cy - 7 * k, cx + 8.5 * k, cy - 4.5 * k, { strokeWidth: 0.7 });
  sk.dot(cx - 3 * k, cy - 1 * k, 0.8);
  sk.dot(cx - 1 * k, cy + 7 * k, 0.8);
}

function aiChip(sk, cx, cy, s = 16) {
  const x = cx - s / 2;
  const y = cy - s / 2;
  sk.mask(x - 4, y - 4, s + 8, s + 8);
  sk.rect(x, y, s, s);
  for (let i = 1; i <= 3; i++) {
    const t = (i / 4) * s;
    sk.line(x + t, y, x + t, y - 3, thin);
    sk.line(x + t, y + s, x + t, y + s + 3, thin);
    sk.line(x, y + t, x - 3, y + t, thin);
    sk.line(x + s, y + t, x + s + 3, y + t, thin);
  }
  const nodes = [[cx - 3.5, cy - 2.5], [cx + 3.5, cy - 3], [cx, cy + 3.5]];
  const edge = { stroke: sk.colors.accent, strokeWidth: 0.6, roughness: 0.2 };
  sk.line(...nodes[0], ...nodes[1], edge);
  sk.line(...nodes[1], ...nodes[2], edge);
  sk.line(...nodes[0], ...nodes[2], edge);
  for (const [nx, ny] of nodes) sk.dot(nx, ny, 1.1);
}

/** Wheeled autonomous inspection robot with a mast, PTZ camera and lidar. */
function inspectionRobot(sk, cx, cy, w = 26) {
  const bodyHeight = 8;
  const x = cx - w / 2;
  const bodyY = cy + 2;
  const background = sk.colors.background;
  sk.mask(x - 2, cy - 15, w + 4, 27, 3);
  sk.rect(x, bodyY, w, bodyHeight);
  sk.circle(x + 5, bodyY + bodyHeight + 1.5, 6, { fill: background, width: 0.8 }); // wheels
  sk.circle(x + w - 5, bodyY + bodyHeight + 1.5, 6, { fill: background, width: 0.8 });
  sk.dot(x + 5, bodyY + bodyHeight + 1.5, 0.8, sk.colors.ink);
  sk.dot(x + w - 5, bodyY + bodyHeight + 1.5, 0.8, sk.colors.ink);
  sk.line(cx + 4, bodyY, cx + 4, cy - 8, { strokeWidth: 0.9 }); // mast
  sk.rect(cx + 0.5, cy - 13, 7, 5, { strokeWidth: 0.7 }); // PTZ camera
  sk.dot(cx + 7.5, cy - 10.5, 0.9);
  sk.rect(x + 3, bodyY - 2.5, 5, 2.5, { strokeWidth: 0.6 }); // lidar
  const scan = { stroke: sk.colors.accent, strokeWidth: 0.6, roughness: 0.2 };
  sk.arc(x + 5.5, bodyY - 2.5, 9, 9, Math.PI * 1.15, Math.PI * 1.55, scan);
  sk.arc(x + 5.5, bodyY - 2.5, 15, 15, Math.PI * 1.15, Math.PI * 1.55, scan);
}

function codeWindow(sk, cx, cy, w = 24, h = 17) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  const accent = { stroke: sk.colors.accent, strokeWidth: 0.9, roughness: 0.2 };
  sk.mask(x - 2, y - 2, w + 4, h + 4);
  sk.rect(x, y, w, h);
  sk.line(x, y + 4, x + w, y + 4, { strokeWidth: 0.6, roughness: 0.2 });
  sk.dot(x + 2.5, y + 2, 0.7);
  sk.dot(x + 5, y + 2, 0.7, sk.colors.ink);
  sk.dot(x + 7.5, y + 2, 0.7, sk.colors.ink);
  sk.polyline([[cx - 4, cy + 0.5], [cx - 7, cy + 3.5], [cx - 4, cy + 6.5]], accent); // < / >
  sk.polyline([[cx + 4, cy + 0.5], [cx + 7, cy + 3.5], [cx + 4, cy + 6.5]], accent);
  sk.line(cx + 1.5, cy, cx - 1.5, cy + 7, accent);
}

function wifi(sk, cx, cy) {
  const wave = { stroke: sk.colors.accent, strokeWidth: 0.8, roughness: 0.3 };
  sk.arc(cx, cy, 6, 4.5, Math.PI * 1.2, Math.PI * 1.8, wave);
  sk.arc(cx, cy, 11, 8, Math.PI * 1.2, Math.PI * 1.8, wave);
}

/** Large industrial robot arm, drawn in card coordinates (x 176–260, y 96–191). */
function robotArm(sk, { withFloor = true } = {}) {
  const { ink, accent, background } = sk.colors;
  const segment = (x1, y1, x2, y2, width, options) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const nx = ((-dy / length) * width) / 2;
    const ny = ((dx / length) * width) / 2;
    sk.polygon([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], options);
  };

  if (withFloor) sk.line(176, 190, 250, 189.5, { strokeWidth: 0.7, roughness: 1.2 });
  sk.polygon([[197, 190], [229, 190], [224, 179], [202, 179]], { fill: ink, fillStyle: 'hachure', hachureGap: 2.2, hachureAngle: -41, fillWeight: 0.45 });
  sk.ellipse(213, 178.5, 28, 7, {});
  segment(213, 170, 204, 126, 10, { fill: ink, fillStyle: 'hachure', hachureGap: 3, fillWeight: 0.35, hachureAngle: 60 });
  segment(204, 126, 232, 106, 8, {});
  sk.line(236, 100, 236, 112);
  sk.polyline([[236, 101], [244, 98.5], [247.5, 101.5]], {}); // gripper fingers
  sk.polyline([[236, 111], [244, 113.5], [247.5, 110.5]], {});
  sk.curve([[218, 179], [222, 160], [214, 140], [210, 124], [222, 112], [229, 104]], { stroke: accent, strokeWidth: 0.7, roughness: 0.6 }); // cable
  sk.circle(213, 170, 13, { fill: background, passes: 2 });
  sk.dot(213, 170, 1.8);
  sk.circle(204, 126, 11, { fill: background, passes: 2 });
  sk.dot(204, 126, 1.6);
  sk.circle(232, 106, 7, { fill: background });
  sk.arc(249, 106, 6, 10, -Math.PI / 3, Math.PI / 3, { stroke: accent, strokeWidth: 0.9, roughness: 0.5 }); // signal
  sk.arc(249, 106, 11, 17, -Math.PI / 3, Math.PI / 3, { stroke: accent, strokeWidth: 0.9, roughness: 0.5 });
}

function gear(sk, cx, cy, r = 6.5, teeth = 8) {
  const points = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a1 = (i / (teeth * 2)) * Math.PI * 2;
    const a2 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const radius = i % 2 ? r : r + 2.6;
    points.push([cx + radius * Math.cos(a1), cy + radius * Math.sin(a1)], [cx + radius * Math.cos(a2), cy + radius * Math.sin(a2)]);
  }
  sk.mask(cx - r - 3, cy - r - 3, 2 * r + 6, 2 * r + 6, 6);
  sk.polygon(points, { strokeWidth: 0.8, roughness: 0.6 });
  sk.circle(cx, cy, r * 0.8, { stroke: sk.colors.accent, width: 0.8 });
}

module.exports = {
  industrialPc,
  containers,
  camera,
  plc,
  gauge,
  smallArm,
  aiChip,
  inspectionRobot,
  codeWindow,
  wifi,
  robotArm,
  gear,
};
