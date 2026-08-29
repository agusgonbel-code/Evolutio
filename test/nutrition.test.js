import test from 'node:test';
import assert from 'node:assert/strict';
import { calcNutrient, calcRecipeMacros, riceDryRegressionCheck } from '../src/nutrition.js';

test('415 g of dry rice at 70 g carbs/100 g equals 290.5 g carbs', () => {
  assert.equal(calcNutrient(415, 70), 290.5);
  assert.equal(riceDryRegressionCheck(), true);
});

test('invalid nutrient inputs never throw and resolve to zero', () => {
  assert.equal(calcNutrient(undefined, 70), 0);
  assert.equal(calcNutrient(100, undefined), 0);
  assert.equal(calcNutrient(-5, 70), 0);
});

test('recipe totals are the sum of ingredient macros without intermediate rounding', () => {
  const result = calcRecipeMacros([
    { grams: 100, per100: { kcal: 350, protein: 7, carbs: 70, fat: 1 } },
    { grams: 50, per100: { kcal: 120, protein: 22, carbs: 0, fat: 2 } }
  ]);
  assert.deepEqual(result, { kcal: 410, protein: 18, carbs: 70, fat: 2 });
});
