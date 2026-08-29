import test from 'node:test';
import assert from 'node:assert/strict';
import { TRAINING_PLAN, getWeeklyMuscleCoverage, getSessionById } from '../src/training.js';

test('plan has four sessions and each stays under 50 minutes', () => {
  assert.equal(TRAINING_PLAN.length, 4);
  assert.ok(TRAINING_PLAN.every((session) => session.estimatedMinutes <= 50));
});

test('weekly plan covers the major muscle groups', () => {
  const coverage = getWeeklyMuscleCoverage();
  for (const muscle of ['pecho','dorsal','cuádriceps','isquios','glúteo','gemelo','deltoide lateral','deltoide posterior','bíceps','tríceps','recto abdominal']) {
    assert.ok((coverage[muscle] || 0) > 0, `missing ${muscle}`);
  }
});

test('session lookup is stable', () => {
  assert.equal(getSessionById('day-1-upper-a')?.day, 'Lunes');
  assert.equal(getSessionById('missing'), null);
});
