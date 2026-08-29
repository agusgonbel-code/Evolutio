export function calcNutrient(amountG, per100) {
  const amount = Number(amountG);
  const value = Number(per100);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  if (!Number.isFinite(value) || value < 0) return 0;
  return (amount / 100) * value;
}

export function calcIngredientMacros(ingredient = {}) {
  const grams = Number(ingredient.grams) || 0;
  const per100 = ingredient.per100 || {};
  return {
    kcal: calcNutrient(grams, per100.kcal),
    protein: calcNutrient(grams, per100.protein),
    carbs: calcNutrient(grams, per100.carbs),
    fat: calcNutrient(grams, per100.fat),
  };
}

export function calcRecipeMacros(ingredients = []) {
  const safe = Array.isArray(ingredients) ? ingredients : [];
  return safe.reduce(
    (total, ingredient) => {
      const m = calcIngredientMacros(ingredient);
      total.kcal += m.kcal;
      total.protein += m.protein;
      total.carbs += m.carbs;
      total.fat += m.fat;
      return total;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function roundMacros(macros = {}) {
  return {
    kcal: Math.round(Number(macros.kcal) || 0),
    protein: Math.round((Number(macros.protein) || 0) * 10) / 10,
    carbs: Math.round((Number(macros.carbs) || 0) * 10) / 10,
    fat: Math.round((Number(macros.fat) || 0) * 10) / 10,
  };
}

export const DEFAULT_FOODS = [
  {
    id: 'rice-dry-user-reference',
    name: 'Arroz seco',
    state: 'seco',
    per100: { kcal: 354, protein: 7.5, carbs: 70, fat: 1.2 },
  },
  {
    id: 'chicken-breast-raw',
    name: 'Pechuga de pollo',
    state: 'crudo',
    per100: { kcal: 120, protein: 22.5, carbs: 0, fat: 2.6 },
  },
  {
    id: 'oats-dry',
    name: 'Copos de avena',
    state: 'seco',
    per100: { kcal: 370, protein: 13, carbs: 59, fat: 7 },
  },
];

export function riceDryRegressionCheck() {
  return calcNutrient(415, 70) === 290.5;
}
