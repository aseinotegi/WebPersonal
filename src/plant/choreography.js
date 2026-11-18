'use strict';

/**
 * How each scene of the story is staged on the plant.
 *
 *   anchor   where the data packet rests (see layout.anchors)
 *   camera   centre and width of the visible area, in world units
 *   robotX   horizontal position of the robot
 *   label    value shown next to the packet while it rests
 *   zoomOut  extra width while travelling *into* this scene, so long jumps
 *            read as "pull back, then go there" instead of a blur
 *   wait     fraction of the transition *out of* this scene spent before the
 *            camera moves (the valve needs time to turn)
 *   badges   badges visible while this scene is on screen; m-NN is the marker
 *            loop around project NN (see marks.js)
 *   map      last scene: every mark on, with large numbers
 *
 * Kept apart from the texts on purpose: wording and staging change for
 * different reasons.
 */

const { robot } = require('./layout');
const { marks } = require('./marks');

const { parkedX, inspectionX } = robot;
const allMarks = Object.keys(marks).map((n) => `m-${n}`);

const choreography = {
  intro: { anchor: 'robotCamera', camera: [440, 330, 1000], robotX: parkedX },
  photo: { anchor: 'robotCamera', camera: [600, 300, 820], robotX: inspectionX, label: 'IMG_0412 · PI-104', badges: ['b-photo', 'b-flash'] },
  mqtt: { anchor: 'industrialPc', camera: [650, 840, 920], robotX: inspectionX, label: 'MQTT · planta1/robot-01/img', badges: ['m-01'] },
  edge: { anchor: 'containers', camera: [560, 900, 920], robotX: inspectionX, label: 'contenedor · inferencia', badges: ['m-02'] },
  vision: { anchor: 'vision', camera: [660, 1220, 860], robotX: inspectionX, badges: ['m-03'] },
  uns: { anchor: 'uns', camera: [700, 1580, 980], robotX: inspectionX, label: 'pi-104/presion = 6,8', badges: ['m-04'] },
  // The main packet stays in the UNS while the PLC value travels in (see client/story.js).
  plc: { anchor: 'uns', camera: [400, 1580, 960], robotX: inspectionX, plcPublishes: true, badges: ['m-05'] },
  rules: { anchor: 'ruleEngine', camera: [900, 1560, 900], robotX: inspectionX, badges: ['b-alarm', 'm-06'] },
  valve: { anchor: 'valve', camera: [660, 370, 760], robotX: inspectionX, zoomOut: 1500, wait: 0.45, closesValve: true, badges: ['m-07'] },
  dashboard: { anchor: 'dashboard', camera: [640, 1910, 880], robotX: inspectionX, zoomOut: 1300, label: 'pt-104/presion = 4,2', badges: ['m-08'] },
  outro: { anchor: 'dashboard', camera: [620, 1080, 4000], robotX: inspectionX, badges: allMarks, map: true },
};

module.exports = { choreography };
