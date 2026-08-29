import test from 'node:test';
import assert from 'node:assert/strict';
import { buildNutritionViewModel, normalizeProfile } from '../src/nutrition-screen.js';

test('nutrition mounts with empty profile and meals', () => {
  const vm = buildNutritionViewModel();
  assert.equal(vm.needsProfile, true);
  assert.deepEqual(vm.meals, []);
  assert.equal(vm.totals.carbs, 0);
});

test('partial profile is normalized without throwing', () => {
  assert.deepEqual(normalizeProfile({ calorieTarget: '2500', proteinTarget: null }), {
    calorieTarget: 2500,
    proteinTarget: 0,
    carbTarget: 0,
    fatTarget: 0,
  });
});

test('nutrition totals use ingredient macros without intermediate rounding', () => {
  const vm = buildNutritionViewModel({
    profile: { calorieTarget: 2500 },
    meals: [{
      id: 'meal-1',
      name: 'Arroz',
      ingredients: [{
        name: 'Arroz seco',
        grams: 415,
        per100g: { kcal: 350, protein: 7, carbs: 70, fat: 1 },
      }],
    }],
  });
  assert.equal(vm.totals.carbs, 290.5);
});
