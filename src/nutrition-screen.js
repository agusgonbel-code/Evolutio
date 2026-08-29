import { calculateIngredientMacros, sumMacros } from './nutrition.js';
import { safeLoad, safeSave } from './storage.js';

export const DEFAULT_PROFILE = Object.freeze({
  calorieTarget: 0,
  proteinTarget: 0,
  carbTarget: 0,
  fatTarget: 0,
});

export function normalizeProfile(profile) {
  const source = profile && typeof profile === 'object' ? profile : {};
  const number = (value) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
  return {
    calorieTarget: number(source.calorieTarget),
    proteinTarget: number(source.proteinTarget),
    carbTarget: number(source.carbTarget),
    fatTarget: number(source.fatTarget),
  };
}

export function buildNutritionViewModel({ profile, meals } = {}) {
  const safeProfile = normalizeProfile(profile);
  const safeMeals = Array.isArray(meals) ? meals : [];
  const mealTotals = safeMeals.map((meal) => {
    const ingredients = Array.isArray(meal?.ingredients) ? meal.ingredients : [];
    const macros = ingredients.map((item) => calculateIngredientMacros(item));
    return { ...meal, totals: sumMacros(macros) };
  });
  return {
    profile: safeProfile,
    meals: mealTotals,
    totals: sumMacros(mealTotals.map((meal) => meal.totals)),
    needsProfile: safeProfile.calorieTarget === 0,
  };
}

export function loadNutritionState(storage = globalThis.localStorage) {
  const profile = safeLoad(storage, 'evolutio.profile', DEFAULT_PROFILE);
  const meals = safeLoad(storage, 'evolutio.meals', []);
  return buildNutritionViewModel({ profile, meals });
}

export function saveNutritionState({ profile, meals }, storage = globalThis.localStorage) {
  safeSave(storage, 'evolutio.profile', normalizeProfile(profile));
  safeSave(storage, 'evolutio.meals', Array.isArray(meals) ? meals : []);
}
