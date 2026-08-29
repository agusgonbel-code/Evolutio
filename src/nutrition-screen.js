import { calcIngredientMacros, calcRecipeMacros } from './nutrition.js';
import { safeLoad, safeSave } from './storage.js';

export const DEFAULT_PROFILE = Object.freeze({
  calorieTarget: 0,
  proteinTarget: 0,
  carbTarget: 0,
  fatTarget: 0,
});

const ZERO_MACROS = () => ({ kcal: 0, protein: 0, carbs: 0, fat: 0 });

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

export function sumMacros(items = []) {
  return (Array.isArray(items) ? items : []).reduce((total, macros) => {
    total.kcal += Number(macros?.kcal) || 0;
    total.protein += Number(macros?.protein) || 0;
    total.carbs += Number(macros?.carbs) || 0;
    total.fat += Number(macros?.fat) || 0;
    return total;
  }, ZERO_MACROS());
}

export function buildNutritionViewModel({ profile, meals } = {}) {
  const safeProfile = normalizeProfile(profile);
  const safeMeals = Array.isArray(meals) ? meals : [];
  const mealTotals = safeMeals.map((meal) => {
    const ingredients = Array.isArray(meal?.ingredients) ? meal.ingredients : [];
    return { ...meal, totals: calcRecipeMacros(ingredients) };
  });
  return {
    profile: safeProfile,
    meals: mealTotals,
    totals: sumMacros(mealTotals.map((meal) => meal.totals)),
    needsProfile: safeProfile.calorieTarget === 0,
  };
}

export function previewIngredient(ingredient) {
  return calcIngredientMacros(ingredient);
}

export function loadNutritionState(storage = globalThis.localStorage) {
  const profile = safeLoad(storage, 'evolutio.profile', DEFAULT_PROFILE);
  const meals = safeLoad(storage, 'evolutio.meals', []);
  return buildNutritionViewModel({ profile, meals });
}

export function saveNutritionState({ profile, meals } = {}, storage = globalThis.localStorage) {
  safeSave(storage, 'evolutio.profile', normalizeProfile(profile));
  safeSave(storage, 'evolutio.meals', Array.isArray(meals) ? meals : []);
}
