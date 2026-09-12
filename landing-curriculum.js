/* World of Trade — public curriculum rendered from the same data as the game. */
(() => {
  'use strict';
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const units = Array.isArray(window.CURRICULUM) ? window.CURRICULUM : [];
  const host = document.querySelector('#curriculumUnits');
  if (!host || !units.length) return;
  host.innerHTML = units.map((u,i) => {
    const levels = Array.isArray(u.lessons) ? u.lessons.length : 0;
    return `<div class="unit"><div class="n">${i+1}</div><div><strong>${esc(u.title)}</strong><small>${esc(u.subtitle || '')} · ${levels} ${levels === 1 ? 'level' : 'levels'}</small></div></div>`;
  }).join('');
  const lessons = units.reduce((n,u) => n + (u.lessons?.length || 0), 0);
  const exercises = units.reduce((n,u) => n + (u.lessons || []).reduce((m,l) => m + (l.exercises?.length || 0), 0), 0);
  const statUnits = document.querySelector('.stats-row [data-to="34"]');
  const statLessons = document.querySelector('.stats-row [data-to="219"]');
  const statExercises = document.querySelector('.stats-row [data-to="1086"]');
  if (statUnits) { statUnits.dataset.to = String(units.length); statUnits.textContent = String(units.length); }
  if (statLessons) { statLessons.dataset.to = String(lessons); statLessons.textContent = String(lessons); }
  if (statExercises) { statExercises.dataset.to = String(exercises); statExercises.textContent = String(exercises); }
})();
