'use strict';

/** Everything below the story: about me, key figures, how I work, career and contact. */

const about = {
  eyebrow: 'IIoT · OT/IT · Robótica autónoma · IA',
  title: 'Hola, soy Ander.',
  lead:
    'Soy de Donostia y llevo más de diez años en la industria. Empecé a pie de máquina, programando PLCs y poniendo en marcha líneas fuera de casa, y poco a poco me fui pasando al dato. Hoy me dedico a que la información de planta llegue a quien la necesita, venga de un PLC, de una cámara o de un robot.',
};

const facts = [
  { value: '+10 años', text: 'entre planta y oficina técnica, de la puesta en marcha al software' },
  { value: '5 países', text: 'con puestas en marcha (EEUU, Inglaterra, Francia, Japón y Hungría)' },
  { value: '4 sistemas', text: 'funcionando en producción con robots de inspección y datos de planta' },
  { value: 'PLC → IA', text: 'Profinet, OPC UA, Modbus y MQTT por abajo, Python, visión e IA por arriba' },
];

const projectsIntro =
  'Los mismos números de la pizarra, por si te has saltado la animación. Son casos reales contados sin datos de clientes. Los que tienen código se pueden probar sin hardware.';

const workflow = {
  intro: 'Hay cosas que hago igual en todos los proyectos, sea un robot, una celda o un PLC.',
  principles: [
    { title: 'Primero, qué falla de verdad', text: 'Antes de programar nada miro qué está fallando en planta y cuántas veces pasa. De ahí sale lo que hay que hacer.' },
    { title: 'Pruebo en mi mesa', text: 'Monto simuladores para probar la lógica sin la planta. Así, cuando llego al robot o a la celda, las sorpresas son las justas.' },
    { title: 'Despacio y con red', text: 'Al principio el sistema solo avisa. Cuando ya me fío, lo dejo actuar, y se va metiendo robot a robot y planta a planta.' },
    { title: 'Que funcione sin mí', text: 'Contenedores, chequeos de salud y documentación, para que el equipo de planta lo despliegue y lo mantenga sin tener que llamarme.' },
  ],
};

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
  title: '¿Tienes algo entre manos en planta?',
  text: 'Si va de PLCs, de datos, de visión o de robots, seguramente pueda echarte una mano. Escríbeme y lo hablamos.',
};

const motto = 'Del sensor al dato, del dato a la decisión.';

module.exports = { about, facts, projectsIntro, workflow, career, contact, motto };
