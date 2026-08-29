import { loadNutritionState } from './nutrition-screen.js';
import { RECIPES } from './recipes.js';
import { calcRecipeMacros, roundMacros } from './nutrition.js';
import { TRAINING_PLAN, getSessionById } from './training.js';

const app = document.querySelector('#app');
let route = 'nutrition';
let selectedRecipe = null;
let selectedSession = null;

const fmt = (value) => Number(value || 0).toLocaleString('es-ES', { maximumFractionDigits: 1 });

function nav() {
  return `<nav class="nav">
    ${['inicio','entreno','nutrition','progreso'].map((item) => `<button data-route="${item}" class="${route===item?'active':''}">${item==='nutrition'?'Nutrición':item[0].toUpperCase()+item.slice(1)}</button>`).join('')}
  </nav>`;
}

function bindNav() {
  document.querySelectorAll('[data-route]').forEach((button) => button.addEventListener('click', () => {
    route = button.dataset.route;
    selectedRecipe = null;
    selectedSession = null;
    render();
  }));
}

function shell(content) {
  app.innerHTML = `<main class="app"><header class="topbar"><div class="brand">Evolutio</div><span class="badge">Alpha</span></header>${content}</main>${nav()}`;
  bindNav();
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

function training() {
  const sessions = TRAINING_PLAN.map((session) => `<button class="meal" data-session="${session.id}"><div class="row"><div><strong>${session.day} · ${session.title}</strong><div class="muted">${session.focus}</div></div><span class="chip">≈ ${session.estimatedMinutes} min</span></div><div class="muted">${session.exercises.length} ejercicios · RIR objetivo 1–2</div></button>`).join('');
  return `<section class="card hero"><div><h1>Entrenamiento</h1><div class="muted">Plan de 4 días con cobertura completa, frecuencia 2× para los grandes grupos y sesiones de menos de 50 minutos.</div></div><span class="chip">4 días</span></section><section class="card"><h2>Semana</h2>${sessions}</section><section class="card"><h2>Reglas de progresión</h2><div class="muted">Mantén 1–2 repeticiones en reserva en la mayoría de series. Cuando completes el extremo alto del rango de repeticiones con la técnica prevista, aumenta ligeramente la carga en la siguiente sesión.</div></section>`;
}

function sessionDetail(session) {
  const exercises = session.exercises.map((exercise, index) => `<div class="exercise"><div class="exercise-index">${index + 1}</div><div class="exercise-body"><strong>${exercise.name}</strong><div class="muted">${exercise.sets} series · ${exercise.reps} reps · RIR ${exercise.rir}</div><div class="tags">${exercise.muscles.map((m) => `<span class="chip">${m}</span>`).join('')}</div></div></div>`).join('');
  return `<button class="back" id="backTraining">← Entrenamiento</button><section class="card" style="margin-top:14px"><div class="row"><div><span class="chip">${session.day}</span><h1 style="margin:12px 0 6px">${session.title}</h1><div class="muted">${session.focus}</div></div><span class="chip">≈ ${session.estimatedMinutes} min</span></div></section><section class="card"><h2>Ejercicios</h2>${exercises}</section>`;
}

function home() {
  return `<section class="card hero"><div><h1>Inicio</h1><div class="muted">Tu visión rápida del día.</div></div><span class="chip">Evolutio</span></section><section class="card"><h2>Hoy</h2><div class="metrics"><div class="metric"><strong>4</strong><span>días de fuerza</span></div><div class="metric"><strong>&lt;50</strong><span>min/sesión</span></div><div class="metric"><strong>1–2</strong><span>RIR objetivo</span></div><div class="metric"><strong>2×</strong><span>frecuencia grandes grupos</span></div></div></section>`;
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
  if (selectedSession) {
    shell(sessionDetail(selectedSession));
    document.querySelector('#backTraining')?.addEventListener('click', () => { selectedSession = null; route = 'entreno'; render(); });
    return;
  }
  if (route === 'nutrition') shell(nutrition());
  else if (route === 'entreno') shell(training());
  else if (route === 'inicio') shell(home());
  else shell(placeholder('Progreso'));
  document.querySelectorAll('[data-recipe]').forEach((button) => button.addEventListener('click', () => { selectedRecipe = RECIPES.find((r) => r.id === button.dataset.recipe); render(); }));
  document.querySelectorAll('[data-session]').forEach((button) => button.addEventListener('click', () => { selectedSession = getSessionById(button.dataset.session); render(); }));
}

render();
