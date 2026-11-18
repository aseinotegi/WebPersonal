'use strict';

/** Everything below the story: about me, key figures, how I work, career and contact. */

const about = {
  eyebrow: 'IIoT · OT/IT · Robótica autónoma · IA',
  title: 'Hola, soy Ander Sein.',
  lead:
    'Ingeniero de automatización e IIoT en Donostia. Empecé programando y poniendo en marcha PLCs en planta; hoy diseño el camino completo del dato: integración OT/IT, visión artificial y plataformas para robots autónomos de inspección.',
};

const facts = [
  { value: '+10 años', text: 'en planta y en oficina técnica, de la puesta en marcha al software' },
  { value: '5 países', text: 'con puestas en marcha: EEUU, Inglaterra, Francia, Japón y Hungría' },
  { value: '4 sistemas', text: 'en producción para robots de inspección y datos de planta' },
  { value: 'PLC → IA', text: 'Profinet, OPC UA, MQTT, Modbus, Python, visión artificial e IA multimodal' },
];

const projectsIntro =
  'Los mismos de la historia, en una lista. Casos reales anonimizados: cuento el problema, la arquitectura y las decisiones, nunca el código del cliente.';

const workflow = {
  intro: 'Lo que repito en cada proyecto, venga de un robot, de una celda o de un PLC.',
  principles: [
    { title: 'Empiezo por el fallo real', text: 'Cada servicio nace de una incidencia medida en planta, no de una lista de funciones.' },
    { title: 'Pruebo sin la planta', text: 'Simuladores MQTT y respuestas simuladas para validar la lógica antes de tocar un robot o una celda.' },
    { title: 'Despliego poco a poco', text: 'Primero el sistema solo avisa; después actúa. Robot a robot, planta a planta.' },
    { title: 'Que lo opere otro', text: 'Contenedores, chequeos de salud y documentación para que el equipo de planta lo despliegue sin mí.' },
  ],
};

const career = {
  jobs: [
    {
      period: 'abr 2025 – 2026',
      role: 'Responsable de Robótica Autónoma de Supervisión',
      company: 'Alhona (Grupo Gestamp)',
      summary: 'Robots autónomos de inspección en refinerías: despliegue, plataforma de supervisión con visión artificial y dirección del equipo de robótica.',
    },
    {
      period: 'dic 2022 – abr 2025',
      role: 'Ingeniero de IIoT e Integración OT/IT',
      company: 'Alhona (Grupo Gestamp)',
      summary: 'Arquitecturas de adquisición de datos con OPC UA, MQTT, Modbus y Profinet en los sectores naval, alimentario y de proceso.',
    },
    {
      period: 'ago – nov 2022',
      role: 'Ingeniero de Automatización y Trazabilidad',
      company: 'SMARKTEC Marking Technology',
      summary: 'Marcado y trazabilidad de palanquillas para Nucor (Nebraska): robots ABB, visión Cognex y PLC Allen-Bradley.',
    },
    {
      period: 'mar 2016 – ago 2022',
      role: 'Ingeniero de Automatización · I4.0 · Puesta en marcha',
      company: 'Loire Gestamp',
      summary:
        'Liderazgo técnico del primer desapilador de Loire en línea tándem, para el Volkswagen ID.4 en Chattanooga. Puestas en marcha en EEUU, Inglaterra, Francia y Japón.',
    },
  ],
  education: [
    { title: 'Máster en Automatización y Robótica Industrial', detail: 'ESNECA · 2020–2021' },
    { title: 'Técnico Superior en Robótica y Automatización Industrial', detail: 'Easo · 2014–2016' },
  ],
};

const contact = {
  title: '¿Tienes un reto de planta, datos o robótica?',
  text: 'Integración OT/IT, adquisición de datos de PLC, visión artificial o plataformas para robots autónomos. Escríbeme y lo vemos.',
};

const motto = 'Del sensor al dato, del dato a la decisión.';

module.exports = { about, facts, projectsIntro, workflow, career, contact, motto };
