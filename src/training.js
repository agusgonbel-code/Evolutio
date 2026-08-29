export const TRAINING_PLAN = [
  {
    id: 'day-1-upper-a', day: 'Lunes', title: 'Torso A', focus: 'Pecho · espalda · deltoides · brazos', estimatedMinutes: 48,
    exercises: [
      { name: 'Press banca', sets: 3, reps: '6–8', rir: '1–2', muscles: ['pecho','tríceps','deltoide anterior'] },
      { name: 'Remo con apoyo de pecho', sets: 3, reps: '8–10', rir: '1–2', muscles: ['dorsal','romboides','bíceps'] },
      { name: 'Press inclinado con mancuernas', sets: 2, reps: '8–12', rir: '1–2', muscles: ['pecho superior','tríceps'] },
      { name: 'Jalón al pecho', sets: 2, reps: '8–12', rir: '1–2', muscles: ['dorsal','bíceps'] },
      { name: 'Elevación lateral', sets: 3, reps: '12–20', rir: '1–2', muscles: ['deltoide lateral'] },
      { name: 'Curl de bíceps', sets: 2, reps: '10–15', rir: '1–2', muscles: ['bíceps'] },
      { name: 'Extensión de tríceps en polea', sets: 2, reps: '10–15', rir: '1–2', muscles: ['tríceps'] },
    ],
  },
  {
    id: 'day-2-lower-a', day: 'Martes', title: 'Pierna A', focus: 'Cuádriceps · femoral · glúteo · gemelo · core', estimatedMinutes: 49,
    exercises: [
      { name: 'Sentadilla o prensa', sets: 3, reps: '6–10', rir: '1–2', muscles: ['cuádriceps','glúteo'] },
      { name: 'Peso muerto rumano', sets: 3, reps: '6–10', rir: '1–2', muscles: ['isquios','glúteo','erectores'] },
      { name: 'Extensión de cuádriceps', sets: 2, reps: '10–15', rir: '1–2', muscles: ['cuádriceps'] },
      { name: 'Curl femoral', sets: 2, reps: '10–15', rir: '1–2', muscles: ['isquios'] },
      { name: 'Elevación de gemelos', sets: 3, reps: '8–15', rir: '1–2', muscles: ['gemelo','sóleo'] },
      { name: 'Crunch en polea', sets: 3, reps: '10–15', rir: '1–2', muscles: ['recto abdominal'] },
    ],
  },
  {
    id: 'day-3-upper-b', day: 'Miércoles', title: 'Torso B', focus: 'Espalda · pecho · hombro posterior · brazos', estimatedMinutes: 47,
    exercises: [
      { name: 'Dominadas o jalón neutro', sets: 3, reps: '6–10', rir: '1–2', muscles: ['dorsal','bíceps'] },
      { name: 'Press en máquina o mancuernas', sets: 3, reps: '8–12', rir: '1–2', muscles: ['pecho','tríceps'] },
      { name: 'Remo unilateral', sets: 2, reps: '8–12', rir: '1–2', muscles: ['dorsal','romboides'] },
      { name: 'Aperturas en polea', sets: 2, reps: '10–15', rir: '1–2', muscles: ['pecho'] },
      { name: 'Pájaros / reverse fly', sets: 3, reps: '12–20', rir: '1–2', muscles: ['deltoide posterior'] },
      { name: 'Curl inclinado', sets: 2, reps: '10–15', rir: '1–2', muscles: ['bíceps'] },
      { name: 'Extensión de tríceps sobre cabeza', sets: 2, reps: '10–15', rir: '1–2', muscles: ['tríceps'] },
    ],
  },
  {
    id: 'day-4-lower-b', day: 'Jueves', title: 'Pierna B', focus: 'Glúteo · cuádriceps · femoral · gemelo · core', estimatedMinutes: 48,
    exercises: [
      { name: 'Hip thrust', sets: 3, reps: '6–10', rir: '1–2', muscles: ['glúteo'] },
      { name: 'Hack squat o zancada', sets: 3, reps: '8–12', rir: '1–2', muscles: ['cuádriceps','glúteo'] },
      { name: 'Curl femoral sentado', sets: 3, reps: '8–12', rir: '1–2', muscles: ['isquios'] },
      { name: 'Extensión de cuádriceps', sets: 2, reps: '12–15', rir: '1–2', muscles: ['cuádriceps'] },
      { name: 'Elevación de gemelos sentado', sets: 3, reps: '10–15', rir: '1–2', muscles: ['sóleo','gemelo'] },
      { name: 'Elevación de piernas', sets: 3, reps: '8–15', rir: '1–2', muscles: ['recto abdominal','flexores cadera'] },
    ],
  },
];

export function getWeeklyMuscleCoverage(plan = TRAINING_PLAN) {
  const coverage = new Map();
  for (const session of plan) {
    for (const exercise of session.exercises || []) {
      for (const muscle of exercise.muscles || []) coverage.set(muscle, (coverage.get(muscle) || 0) + exercise.sets);
    }
  }
  return Object.fromEntries(coverage);
}

export function getSessionById(id) {
  return TRAINING_PLAN.find((session) => session.id === id) || null;
}
