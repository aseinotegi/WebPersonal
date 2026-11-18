'use strict';

/** Everything below the story: about me, key figures, career and contact. */

const about = {
  eyebrow: 'IIoT · OT/IT · Robótica autónoma · IA',
  title: 'Hola, soy Ander.',
  lead:
    'Soy de Donostia y llevo más de diez años en la industria. Empecé a pie de máquina, programando PLCs y poniendo en marcha líneas fuera de casa, y poco a poco me fui pasando al dato. Hoy me dedico a que la información de planta llegue a quien la necesita, venga de un PLC, de una cámara o de un robot.',
};

const facts = [
  { value: '+10 años', text: 'entre planta y oficina técnica, de la puesta en marcha al software' },
  { value: 'Medio mundo', text: 'poniendo en marcha PLCs y sistemas IoT en Estados Unidos, Europa y Japón' },
  { value: 'Del campo al IT', text: 'sensores, PLCs y buses de campo abajo. Contenedores, bases de datos y análisis de imagen arriba' },
];

const career = {
  jobs: [
    {
      period: 'abr 2025 – 2026',
      role: 'Responsable de Robótica Autónoma de Supervisión',
      company: 'Alhona (Grupo Gestamp)',
      summary: 'Robots autónomos de inspección en refinerías. Me encargo del despliegue, de la plataforma de supervisión con visión artificial y del equipo de robótica.',
    },
    {
      period: 'dic 2022 – abr 2025',
      role: 'Ingeniero de IIoT e Integración OT/IT',
      company: 'Alhona (Grupo Gestamp)',
      summary: 'Adquisición de datos con OPC UA, MQTT, Modbus y Profinet en plantas del sector naval, alimentario y de proceso.',
    },
    {
      period: 'ago – nov 2022',
      role: 'Ingeniero de Automatización y Trazabilidad',
      company: 'SMARKTEC Marking Technology',
      summary: 'Marcado y trazabilidad de palanquillas para Nucor, en Nebraska, con robots ABB, visión Cognex y PLC Allen-Bradley.',
    },
    {
      period: 'mar 2016 – ago 2022',
      role: 'Ingeniero de Automatización · I4.0 · Puesta en marcha',
      company: 'Loire Gestamp',
      summary:
        'Fui el responsable técnico del primer desapilador de Loire en línea tándem, para el Volkswagen ID.4 de Chattanooga. Puestas en marcha en EEUU, Inglaterra, Francia y Japón.',
    },
  ],
  education: [
    { title: 'Máster en Automatización y Robótica Industrial', detail: 'ESNECA · 2020–2021' },
    { title: 'Técnico Superior en Robótica y Automatización Industrial', detail: 'Easo · 2014–2016' },
  ],
};

const contact = {
  title: '¿Hablamos?',
  text: 'Si algo de lo que has visto te interesa, o simplemente quieres hablar de PLCs, datos o robots, escríbeme.',
};

module.exports = { about, facts, career, contact };
