export const RECIPES = [
  {
    id: 'preworkout-oat-cake',
    name: 'Bizcocho pre-entreno de avena y chía',
    timing: 'pre-entreno',
    ingredients: [
      { name: 'Copos de avena', grams: 60, state: 'seco', per100: { kcal: 370, protein: 13, carbs: 59, fat: 7 } },
      { name: 'Huevo', grams: 60, state: 'crudo', per100: { kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5 } },
      { name: 'Claras', grams: 150, state: 'crudo', per100: { kcal: 46, protein: 10.2, carbs: 0.7, fat: 0.2 } },
      { name: 'Semillas de chía', grams: 10, state: 'seco', per100: { kcal: 486, protein: 16.5, carbs: 42.1, fat: 30.7 } },
    ],
  },
  {
    id: 'chicken-rice-bowl',
    name: 'Pollo con arroz y verduras',
    timing: 'comida',
    ingredients: [
      { name: 'Arroz seco', grams: 100, state: 'seco', per100: { kcal: 354, protein: 7.5, carbs: 70, fat: 1.2 } },
      { name: 'Pechuga de pollo', grams: 180, state: 'crudo', per100: { kcal: 120, protein: 22.5, carbs: 0, fat: 2.6 } },
      { name: 'Verduras variadas', grams: 200, state: 'crudo', per100: { kcal: 35, protein: 2, carbs: 5, fat: 0.4 } },
      { name: 'Aceite de oliva', grams: 10, state: 'producto', per100: { kcal: 884, protein: 0, carbs: 0, fat: 100 } },
    ],
  },
  {
    id: 'yogurt-chia-oats',
    name: 'Yogur con chía y avena',
    timing: 'merienda',
    ingredients: [
      { name: 'Yogur alto en proteína', grams: 200, state: 'producto', per100: { kcal: 65, protein: 10, carbs: 4, fat: 0.5 } },
      { name: 'Semillas de chía', grams: 15, state: 'seco', per100: { kcal: 486, protein: 16.5, carbs: 42.1, fat: 30.7 } },
      { name: 'Copos de avena', grams: 30, state: 'seco', per100: { kcal: 370, protein: 13, carbs: 59, fat: 7 } },
    ],
  },
];

export function getRecipesByTiming(timing) {
  return RECIPES.filter((recipe) => !timing || recipe.timing === timing);
}
