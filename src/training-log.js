import { safeLoad, safeSave } from './storage.js';

const KEY = 'evolutio.trainingLog';

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export function normalizeSet(set = {}) {
  return {
    weight: num(set.weight),
    reps: num(set.reps),
    rir: num(set.rir, 2),
    completed: Boolean(set.completed),
  };
}

export function loadTrainingLog(storage = globalThis.localStorage) {
  const raw = safeLoad(storage, KEY, []);
  return Array.isArray(raw) ? raw : [];
}

export function saveTrainingLog(entries, storage = globalThis.localStorage) {
  safeSave(storage, KEY, Array.isArray(entries) ? entries : []);
}

export function recordExercise({ sessionId, exerciseName, sets, date = new Date().toISOString() }, storage = globalThis.localStorage) {
  const entries = loadTrainingLog(storage);
  const entry = {
    id: `${sessionId}:${exerciseName}:${date}`,
    sessionId,
    exerciseName,
    date,
    sets: (Array.isArray(sets) ? sets : []).map(normalizeSet),
  };
  entries.push(entry);
  saveTrainingLog(entries, storage);
  return entry;
}

export function getLastExerciseEntry(sessionId, exerciseName, storage = globalThis.localStorage) {
  const entries = loadTrainingLog(storage)
    .filter((e) => e?.sessionId === sessionId && e?.exerciseName === exerciseName)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return entries[0] || null;
}

export function bestCompletedSet(entry) {
  const sets = Array.isArray(entry?.sets) ? entry.sets.filter((s) => s?.completed) : [];
  return sets.sort((a, b) => (num(b.weight) * num(b.reps)) - (num(a.weight) * num(a.reps)))[0] || null;
}

export function progressionSuggestion({ lastEntry, repRange = '8–12', incrementKg = 2.5 } = {}) {
  const best = bestCompletedSet(lastEntry);
  if (!best) return { action: 'start', message: 'Empieza con una carga cómoda y deja 2 RIR.' };
  const [minRep, maxRep] = String(repRange).split(/[–-]/).map(Number);
  const min = Number.isFinite(minRep) ? minRep : 8;
  const max = Number.isFinite(maxRep) ? maxRep : min + 4;
  if (best.reps >= max && best.rir >= 1) {
    const nextWeight = Math.round((best.weight + incrementKg) * 2) / 2;
    return { action: 'increase', nextWeight, message: `Sube a ${nextWeight} kg e intenta mantenerte dentro de ${min}–${max} reps.` };
  }
  if (best.reps < min || best.rir === 0) {
    return { action: 'hold', nextWeight: best.weight, message: `Mantén ${best.weight} kg hasta consolidar ${min}–${max} reps con 1–2 RIR.` };
  }
  return { action: 'add-reps', nextWeight: best.weight, message: `Mantén ${best.weight} kg e intenta añadir 1 repetición antes de subir carga.` };
}
