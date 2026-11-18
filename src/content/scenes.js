'use strict';

/**
 * What the scroll story says, scene by scene.
 *
 * Only text lives here. How each scene looks (camera, robot, packet, the marker
 * loop around each project) is in src/plant/choreography.js, matched by `id`.
 *
 *   zone     where we are in the plant, as labelled on the drawing's ruler
 *   title    what happens in this beat of the story
 *   text     what the animation is showing
 *   project  the real work behind the piece circled on the drawing
 *     mine   that work, told in first person
 *     repo   kind 'code' (runs without hardware) or 'case' (written case study)
 *
 * Scenes with a `project` are also listed in the projects index below the story.
 */

const GITHUB = 'https://github.com/aseinotegi';

const scenes = [
  {
    id: 'intro',
    zone: 'Planta',
    title: 'Sigue al robot.',
    text: 'Este robot hace la ronda de inspección en una planta de proceso. Baja despacio y verás qué pasa con una sola lectura, desde que la toma hasta que alguien actúa. Lo que voy rodeando en la pizarra lo he hecho yo.',
  },
  {
    id: 'photo',
    zone: 'Planta',
    title: 'Una foto al manómetro',
    text: 'El PI-104 es un manómetro de los de toda la vida, sin cable y sin señal. Si nadie pasa a mirarlo, nadie sabe lo que marca. Así que el robot se para delante y le hace una foto.',
  },
  {
    id: 'mqtt',
    zone: 'Edge',
    title: 'La foto sale hacia el PC',
    text: 'El robot la manda por MQTT al PC industrial que hay en la propia planta, y llega al momento.',
    project: {
      number: '01',
      area: 'Captura de datos',
      indexTitle: 'Datos en tiempo real por MQTT',
      mine: 'Llevo años montando esta capa en plantas, para robots, máquinas y sensores. Cada uno publica lo suyo y el que lo necesita se suscribe, sin tocar a los demás.',
      repo: { url: `${GITHUB}/mqtt-traceability-dashboard-showcase`, title: 'Trazabilidad por MQTT en tiempo real', kind: 'case' },
    },
    tech: ['MQTT', 'WebSocket', 'Python'],
  },
  {
    id: 'edge',
    zone: 'Edge',
    title: 'Cada cosa en su contenedor',
    text: 'En el PC no hay un programa gigante. Hay varios servicios pequeños, cada uno en su contenedor, y uno de ellos recoge la foto.',
    project: {
      number: '02',
      area: 'Edge',
      indexTitle: 'PC industrial con servicios en contenedores',
      mine: 'Así lo despliego siempre. Si un servicio se cae se levanta solo y el resto ni se entera, y para actualizar uno no hay que parar nada. Son equipos que están 24 horas encendidos en planta.',
    },
    tech: ['Docker', 'PC industrial', 'Python'],
  },
  {
    id: 'vision',
    zone: 'Visión',
    title: 'Qué es y cuánto marca',
    text: 'Primero hay que saber que lo que sale en la foto es un manómetro, y luego leer la aguja. Salen dos resultados, la clase con su confianza y la lectura, 6,8 bar.',
    project: {
      number: '03',
      area: 'Visión artificial',
      indexTitle: 'Lectura de medidores con visión',
      mine: 'El detector lo entrené con fotos reales de planta, con reflejos, suciedad y ángulos raros. La lectura la saca un modelo multimodal a partir del recorte.',
      repo: { url: `${GITHUB}/level-gauge-vision-showcase`, title: 'Lectura de medidores con visión', kind: 'case' },
    },
    tech: ['Detección de objetos', 'IA multimodal', 'Python'],
  },
  {
    id: 'uns',
    zone: 'UNS',
    title: 'Todo al mismo sitio',
    text: 'La lectura se publica en el Unified Namespace, un árbol con toda la planta ordenada por zona, equipo y dato. Ahí queda pi-104/presion con 6,8.',
    project: {
      number: '04',
      area: 'Unified Namespace',
      indexTitle: 'Unified Namespace para datos de planta',
      mine: 'Es la pieza que hace que todo lo demás encaje. Quien quiera un dato sabe dónde buscarlo sin preguntar quién lo ha generado. En el repo tienes esta misma historia funcionando, se arranca con un solo comando y no hace falta hardware.',
      repo: { url: `${GITHUB}/industrial-uns-demo`, title: 'Unified Namespace de una planta', kind: 'code' },
    },
    tech: ['Unified Namespace', 'MQTT', 'Modelado de datos'],
  },
  {
    id: 'plc',
    zone: 'UNS',
    title: 'El PLC dice lo suyo',
    text: 'En la misma tubería hay un transmisor, el PT-104, cableado al PLC por 4-20 mA. El PLC también publica en el UNS, y marca 6,7 bar.',
    project: {
      number: '05',
      area: 'Adquisición de PLC',
      indexTitle: 'Adquisición de datos de PLC',
      mine: 'Yo empecé aquí, programando y poniendo en marcha PLCs. Ahora hago las pasarelas que leen sus datos sin tocar el proceso y solo publican lo que cambia. Las he montado en naval, alimentación y proceso.',
      repo: { url: `${GITHUB}/plc-mqtt-gateway`, title: 'Pasarela de PLC a MQTT', kind: 'code' },
    },
    tech: ['Siemens S7', 'Profinet', 'Modbus', 'OPC UA'],
  },
  {
    id: 'rules',
    zone: 'UNS',
    title: 'Dos lecturas, una alarma',
    text: 'Un servicio escucha el UNS y compara la cámara con el PLC. Los dos pasan de 6 bar, así que no es un error de lectura. La alarma es de verdad y se le pide al robot que cierre la XV-104.',
    project: {
      number: '06',
      area: 'Reglas y alarmas',
      indexTitle: 'Reglas y alarmas en tiempo real',
      mine: 'Servicios así los tengo funcionando con flotas de robots. Al principio solo avisan, y cuando ya te fías de ellos los dejas actuar.',
      repo: { url: `${GITHUB}/robot-fleet-watchdogs`, title: 'Watchdogs para flotas de robots', kind: 'code' },
    },
    tech: ['Reglas en tiempo real', 'MQTT', 'Python'],
  },
  {
    id: 'valve',
    zone: 'Planta',
    title: 'El robot cierra la válvula',
    text: 'La XV-104 no tiene actuador, se cierra a mano. Para eso está el robot, que vuelve, agarra el volante con el brazo y la cierra.',
    project: {
      number: '07',
      area: 'Robótica',
      indexTitle: 'Robots y PLCs, de la puesta en marcha a la inspección autónoma',
      mine: 'Antes de esto pasé años en puestas en marcha, programando robots y PLCs en Estados Unidos, Inglaterra, Francia, Japón y Hungría. Ahora llevo robots autónomos que hacen rondas de inspección en refinerías.',
    },
    tech: ['Robótica', 'PLC', 'Puesta en marcha'],
  },
  {
    id: 'dashboard',
    zone: 'Dashboard',
    title: 'Y se ve en pantalla',
    text: 'Con la válvula cerrada la presión baja y el PLC lo publica. El dashboard lee del UNS y enseña el pico de 6,8 bar, el momento del cierre y la vuelta a 4,2.',
    project: {
      number: '08',
      area: 'Plataforma',
      indexTitle: 'Plataforma de misiones para robots de inspección',
      mine: 'Es lo que ve la gente de planta. En la plataforma que hice para los robots de inspección, además de las gráficas, se planifican las misiones de varias plantas y se guardan el histórico, los indicadores y los informes.',
      repo: { url: `${GITHUB}/robot-mission-scheduler-showcase`, title: 'Plataforma de misiones para robots', kind: 'case' },
    },
    tech: ['APIs REST', 'Bases de datos', 'Contenedores'],
  },
  {
    id: 'outro',
    zone: 'Ander Sein',
    title: 'Del sensor a la decisión.',
    text: 'Soy Ander, ingeniero de automatización e IIoT en Donostia. Cada número de la pizarra es un proyecto mío, y abajo los tienes en lista con su código o su caso.',
  },
];

module.exports = { scenes };
