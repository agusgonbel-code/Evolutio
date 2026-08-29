import { loadNutritionState } from './nutrition-screen.js';
import { RECIPES } from './recipes.js';
import { calcRecipeMacros, roundMacros } from './nutrition.js';

const app = document.querySelector('#app');
let route = 'nutrition';
let selectedRecipe = null;

const fmt = (value) => Number(value || 0).toLocaleString('es-ES', { maximumFractionDigits: 1 });

function nav() {
  return `<nav class="nav">
    ${['inicio','entreno','nutrition','progreso'].map((item) => `<button data-route="${item}" class="${route===item?'active':''}">${item==='nutrition'?'Nutrición':item[0].toUpperCase()+item.slice(1)}</button>`).join('')}
  </nav>`;
}

function shell(content) {
  app.innerHTML = `<main class="app"><header class="topbar"><div class="brand">Evolutio</div><span class="badge">Alpha</span></header>${content}</main>${nav()}`;
  document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => { route = button.dataset.route; selectedRecipe = null; render(); }));
}

function nutrition() {
  const state = loadNutritionState();
  const totals = roundMacros(state.totals);
  const profile = state.profile;
  const recipeCards = RECIPES.map((recipe) => {
    const m = roundMacros(calcRecipeMacros(recipe.ingredients));
    return `<button class="meal" data-recipe="${recipe.id}"><div class="row"><div><strong>${recipe.name}</strong><div class="muted">${recipe.timing}</div></div><span class="chip">${m.kcal} kcal</span></div><div class="muted">P ${m.protein} g · CH ${m.carbs} g · G ${m.fat} g</div></button>`;
  }).join('');
  return `<section class="card hero"><div><h1>Nutrición</h1><div class="muted">Macros calculados desde cada ingrediente y su estado real.</div></div><span class="chip">Hoy</span></section>
  ${state.needsProfile?'<div class="alert">Completa tu perfil para calcular objetivos diarios personalizados. La pantalla seguirá funcionando aunque falten datos.</div>':''}
  <section class="card"><h2>Resumen diario</h2><div class="metrics"><div class="metric"><strong>${fmt(totals.kcal)}</strong><span>kcal consumidas</span></div><div class="metric"><strong>${fmt(totals.protein)} g</strong><span>proteína</span></div><div class="metric"><strong>${fmt(totals.carbs)} g</strong><span>carbohidratos</span></div><div class="metric"><strong>${fmt(totals.fat)} g</strong><span>grasas</span></div></div>${profile.calorieTarget?`<div class="muted" style="margin-top:12px">Objetivo: ${fmt(profile.calorieTarget)} kcal</div>`:''}</section>
  <section class="card"><h2>Recetas</h2><div class="muted">Toca una comida para abrir ingredientes y macros.</div>${recipeCards}</section>`;
}

function recipeDetail(recipe) {
  const macros = roundMacros(calcRecipeMacros(recipe.ingredients));
  const ingredients = recipe.ingredients.map((item) => `<div class="recipe-ingredient"><div><strong>${item.name}</strong><div class="muted">${item.state || 'sin estado'}</div></div><span>${fmt(item.grams)} g</span></div>`).join('');
  return `<button class="back" id="backNutrition">← Nutrición</button><section class="card" style="margin-top:14px"><span class="chip">${recipe.timing}</span><h1 style="margin-top:12px">${recipe.name}</h1><div class="metrics"><div class="metric"><strong>${macros.kcal}</strong><span>kcal</span></div><div class="metric"><strong>${macros.protein} g</strong><span>proteína</span></div><div class="metric"><strong>${macros.carbs} g</strong><span>carbohidratos</span></div><div class="metric"><strong>${macros.fat} g</strong><span>grasas</span></div></div></section><section class="card"><h2>Ingredientes</h2>${ingredients}</section>`;
}

function placeholder(title) {
  return `<section class="card"><h1>${title}</h1><div class="empty">Módulo en construcción dentro del repositorio oficial de Evolutio.</div></section>`;
}

function render() {
  if (selectedRecipe) {
    shell(recipeDetail(selectedRecipe));
    document.querySelector('#backNutrition')?.addEventListener('click', () => { selectedRecipe = null; route = 'nutrition'; render(); });
    return;
  }
  if (route === 'nutrition') shell(nutrition());
  else shell(placeholder(route === 'entreno' ? 'Entrenamiento' : route === 'progreso' ? 'Progreso' : 'Inicio'));
  document.querySelectorAll('[data-recipe]').forEach((button) => button.addEventListener('click', () => { selectedRecipe = RECIPES.find((r) => r.id === button.dataset.recipe); render(); }));
}

render();
