/* Pagina del glossario: ricerca, filtro per unità, rimando alla lezione. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const VOCI = window.GLOSSARY || [];
  const UNITS = window.CURRICULUM || [];

  // per ogni lezione: numero d'unità visualizzato, titolo d'unità, titolo di lezione
  const mappa = {};
  UNITS.forEach((u, ui) => u.lessons.forEach((l, li) => {
    mappa[l.id] = { unitId: u.id, unitNum: ui + 1, unitTitle: u.title, lessonNum: li + 1, lessonTitle: l.title };
  }));

  // le voci sono raccolte per unità nell'ordine del percorso, non alfabetico:
  // chi studia le cerca dove le ha incontrate
  const perUnita = UNITS.map((u, ui) => ({
    ui: ui + 1, id: u.id, title: u.title,
    voci: VOCI.filter(v => mappa[v.lesson]?.unitId === u.id),
  })).filter(g => g.voci.length);

  function riempiFiltro() {
    const sel = $('#glUnit');
    sel.innerHTML = `<option value="">All units</option>` +
      perUnita.map(g => `<option value="${esc(g.id)}">Unit ${g.ui} · ${esc(g.title)}</option>`).join('');
  }

  const norm = s => String(s).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')   // così "Hélène" si trova anche senza accento
    .replace(/[^a-z0-9 ]/g, ' ');

  // Con una ricerca attiva l'ordine per unità non serve: serve la pertinenza.
  // Un termine che inizia con quello che hai digitato deve venire prima di uno
  // che lo menziona solo nella spiegazione.
  function punteggio(v, parole) {
    const term = norm(v.term);
    let p = 0;
    for (const w of parole) {
      if (term.startsWith(w)) p += 100;
      else if (term.split(' ').some(x => x.startsWith(w))) p += 60;
      else if (term.includes(w)) p += 40;
      else if (norm(v.def).includes(w)) p += 10;
      else p += 1;                                  // solo nel "perché conta"
    }
    return p;
  }

  function voce(v, conUnita) {
    const m = mappa[v.lesson] || {};
    return `<div class="gl-item" id="t-${esc(slug(v.term))}">
      <dt>${esc(v.term)}${conUnita ? ` <span class="gl-u">Unit ${m.unitNum}</span>` : ''}</dt>
      <dd>
        <p class="gl-def">${esc(v.def)}</p>
        <p class="gl-why">${esc(v.why)}</p>
        <a class="gl-link" href="learn.html?lesson=${esc(v.lesson)}">
          Lesson ${m.lessonNum} · ${esc(m.lessonTitle || '')}</a>
      </dd>
    </div>`;
  }

  function disegna() {
    const q = norm($('#glSearch').value.trim());
    const unita = $('#glUnit').value;
    const parole = q.split(/\s+/).filter(Boolean);
    const inUnita = v => !unita || mappa[v.lesson]?.unitId === unita;
    const combacia = v => {
      if (!parole.length) return true;
      const testo = norm(v.term + ' ' + v.def + ' ' + v.why);
      return parole.every(p => testo.includes(p));
    };
    let mostrate = 0;

    if (parole.length) {
      // elenco piatto, ordinato per pertinenza
      const trovate = VOCI.filter(v => inUnita(v) && combacia(v))
        .sort((a, b) => punteggio(b, parole) - punteggio(a, parole) || a.term.localeCompare(b.term));
      mostrate = trovate.length;
      $('#glBody').innerHTML = trovate.length
        ? `<section class="gl-unit"><dl>${trovate.map(v => voce(v, true)).join('')}</dl></section>`
        : '';
    } else {
      $('#glBody').innerHTML = perUnita.map(g => {
        if (unita && g.id !== unita) return '';
        mostrate += g.voci.length;
        return `<section class="gl-unit">
          <h2><span class="gl-n">Unit ${g.ui}</span> ${esc(g.title)}</h2>
          <dl>${g.voci.map(v => voce(v, false)).join('')}</dl>
        </section>`;
      }).join('');
    }

    const tot = VOCI.length;
    $('#glCount').textContent = mostrate === tot ? `${tot} terms` : `${mostrate} of ${tot} terms`;
    $('#glEmpty').hidden = mostrate > 0;
  }

  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function avvia() {
    if (!VOCI.length) { $('#glCount').textContent = 'Glossary unavailable.'; return; }
    riempiFiltro();
    $('#glSearch').addEventListener('input', disegna);
    $('#glUnit').addEventListener('change', disegna);
    // un termine può essere linkato direttamente: glossary.html#t-demurrage
    disegna();
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) { el.classList.add('gl-target'); el.scrollIntoView({ block: 'center' }); }
    }
    window.GLOSSARY_PAGE = { disegna, perUnita, mappa, slug, voci: VOCI };
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', avvia, { once: true })
    : avvia();
})();
