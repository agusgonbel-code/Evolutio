import test from 'node:test';
import assert from 'node:assert/strict';
import { bestCompletedSet, progressionSuggestion } from '../src/training-log.js';

test('selects best completed set by load x reps', () => {
  const best = bestCompletedSet({ sets: [
    { weight: 80, reps: 8, completed: true },
    { weight: 75, reps: 10, completed: true },
    { weight: 100, reps: 10, completed: false },
  ] });
  assert.equal(best.weight, 75);
  assert.equal(best.reps, 10);
});

test('suggests increasing load at top of range with reps in reserve', () => {
  const suggestion = progressionSuggestion({
    repRange: '8–12',
    lastEntry: { sets: [{ weight: 80, reps: 12, rir: 2, completed: true }] },
  });
  assert.equal(suggestion.action, 'increase');
  assert.equal(suggestion.nextWeight, 82.5);
});

test('holds load after failure or when below rep floor', () => {
  const suggestion = progressionSuggestion({
    repRange: '8–12',
    lastEntry: { sets: [{ weight: 80, reps: 7, rir: 0, completed: true }] },
  });
  assert.equal(suggestion.action, 'hold');
  assert.equal(suggestion.nextWeight, 80);
});
