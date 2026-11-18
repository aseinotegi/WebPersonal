'use strict';

/**
 * What the scroll story says, scene by scene.
 *
 * Only text lives here. How each scene looks (camera, robot, packet) is in
 * src/plant/choreography.js, matched by `id`.
 *
 * Scenes with a `project` are also listed in the projects index below the story.
 */

const GITHUB = 'https://github.com/aseinotegi';

const scenes = [
  {
    id: 'intro',
    eyebrow: 'Inicio',
    title: 'Sigue al robot.',
    text: 'Un robot de inspección hace su ronda por la planta. Por el camino, los proyectos que he construido.',
  },
  {
    id: 'photo',
    eyebrow: 'En planta',
    title: 'Foto al manómetro PI-104.',
    text: 'El robot llega al punto de inspección y captura la imagen del instrumento local.',
  },
  {
    id: 'mqtt',
    project: {
      number: '01',
      area: 'Captura de datos',
      repo: { url: `${GITHUB}/mqtt-traceability-dashboard-showcase`, title: 'Trazabilidad MQTT en tiempo real' },
    },
    title: 'Datos en tiempo real por MQTT',
    text: 'Robots, equipos y sensores publican por MQTT y el dato llega al instante a quien lo necesita, sin acoplar unos sistemas con otros. La base de todo lo demás.',
    tech: ['MQTT', 'WebSocket', 'Python'],
  },
  {
    id: 'edge',
    project: { number: '02', area: 'Edge' },
    title: 'PC industrial con servicios en contenedores',
    text: 'Cada servicio corre en su propio contenedor: se despliega, se actualiza y se reinicia por separado, y funciona 24/7 junto a la planta.',
    tech: ['Docker', 'PC industrial', 'Python'],
  },
  {
    id: 'vision',
    project: {
      number: '03',
      area: 'Visión artificial',
      repo: { url: `${GITHUB}/level-gauge-vision-showcase`, title: 'Lectura de medidores con visión' },
    },
    title: 'Qué es y cuánto marca',
    text: 'Un detector entrenado con imágenes reales de planta confirma que es un manómetro y un modelo multimodal lee el valor a partir del recorte. Dos resultados distintos: la clase, con su confianza, y la lectura.',
    tech: ['Detección de objetos', 'IA multimodal', 'Python'],
  },
  {
    id: 'uns',
    project: { number: '04', area: 'Unified Namespace', indexTitle: 'Unified Namespace para datos de planta', status: 'repo en camino' },
    title: 'Todo llega a un mismo sitio',
    text: 'Cada fuente publica su dato en una jerarquía común: planta, área, equipo, dato. La lectura de la visión entra aquí, y cualquier servicio la encuentra sin saber quién la produjo.',
    tech: ['Unified Namespace', 'MQTT', 'Modelado de datos'],
  },
  {
    id: 'plc',
    project: {
      number: '05',
      area: 'Adquisición de PLC',
      indexTitle: 'Adquisición de datos de PLC',
      repo: { url: `${GITHUB}/plc-mqtt-gateway`, title: 'Pasarela PLC → MQTT' },
    },
    title: 'El PLC publica su propia medida',
    text: 'El transmisor PT-104 llega al PLC por 4-20 mA. Una pasarela lee sus bloques de datos sin tocar el proceso y publica en el UNS solo lo que cambia. Lo he hecho en los sectores naval, alimentario y de proceso.',
    tech: ['Siemens S7', 'Profinet', 'Modbus', 'OPC UA'],
  },
  {
    id: 'rules',
    project: {
      number: '06',
      area: 'Reglas y alarmas',
      indexTitle: 'Reglas y alarmas en tiempo real',
      repo: { url: `${GITHUB}/robot-fleet-watchdogs`, title: 'Watchdogs para la flota de robots' },
    },
    title: 'La regla cruza las dos fuentes',
    text: 'Un servicio suscrito al UNS compara la lectura de la visión con la del PLC. Si las dos superan el límite, la alarma es real y no un error de lectura: se ordena al robot cerrar XV-104. Primero avisa; cuando hay confianza, actúa.',
    tech: ['Reglas en tiempo real', 'MQTT', 'Python'],
  },
  {
    id: 'valve',
    project: { number: '07', area: 'Robótica', indexTitle: 'Robots y PLCs, de la puesta en marcha a la inspección autónoma' },
    title: 'El robot cierra la válvula manual',
    text: 'XV-104 no tiene actuador: solo se cierra a mano, y para eso está el robot. De programar robots y PLCs en puestas en marcha de cinco países a robots autónomos que actúan en planta.',
    tech: ['Robótica', 'PLC', 'Puesta en marcha'],
  },
  {
    id: 'dashboard',
    project: {
      number: '08',
      area: 'Plataforma',
      indexTitle: 'Plataforma de misiones para robots de inspección',
      repo: { url: `${GITHUB}/robot-mission-scheduler-showcase`, title: 'Plataforma de misiones para robots' },
    },
    title: 'Del UNS al dashboard: resuelto',
    text: 'Con la válvula cerrada, el PLC publica la bajada en el UNS y el dashboard la muestra: pico de 6,8 bar y vuelta a 4,2. La plataforma multiplanta guarda el histórico, los KPIs y el informe.',
    tech: ['APIs REST', 'Bases de datos', 'Contenedores', 'IA'],
  },
  {
    id: 'outro',
    eyebrow: 'Ander Sein',
    title: 'Del sensor a la decisión, de punta a punta.',
    text: 'Soy Ander Sein, ingeniero de automatización e IIoT en Donostia. Este camino completo es mi trabajo.',
  },
];

/** "Proyecto 03 · Visión artificial" for project scenes, the plain eyebrow otherwise. */
const eyebrowOf = (scene) => (scene.project ? `Proyecto ${scene.project.number} · ${scene.project.area}` : scene.eyebrow);

module.exports = { scenes, eyebrowOf };
