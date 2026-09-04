import { boot, solver, suite, pausa, DIR } from './harness.mjs';
import fs from 'fs';
const t = suite('Glossario');

/* ── coerenza col curriculum: il rimando deve esistere davvero ── */
{
  const g = {}; const c = {};
  new Function('window', fs.readFileSync(DIR + '/glossary.js', 'utf8'))(g);
  // il glossario copre anche i desk specialistici: serve il motore dei contenuti
  new Function('window', fs.readFileSync(DIR + '/curriculum.js', 'utf8'))(c);
  new Function('window', fs.readFileSync(DIR + '/career.js', 'utf8'))(c);
  new Function('window', fs.readFileSync(DIR + '/content-engine.js', 'utf8'))(c);
  const VOCI = g.GLOSSARY, UNITS = c.CURRICULUM;
  const FOUNDATION_UNITS = UNITS.filter(u => /^u\d+$/.test(u.id));
  const lezioni = new Map(UNITS.flatMap((u, ui) => u.lessons.map((l, li) =>
    [l.id, { unit: u.id, ui: ui + 1, li: li + 1, titolo: l.title }])));

  t('il glossario ha una quantità utile di voci', VOCI.length >= 60, VOCI.length + ' voci');
  const rotti = VOCI.filter(v => !lezioni.has(v.lesson));
  t('ogni voce rimanda a una lezione che esiste', rotti.length === 0,
    rotti.map(v => `${v.term}→${v.lesson}`).join(', '));
  const dup = VOCI.map(v => v.term.toLowerCase()).filter((x, i, a) => a.indexOf(x) !== i);
  t('nessun termine duplicato', dup.length === 0, dup.join(', '));
  t('ogni voce ha definizione e motivo, non solo il titolo',
    VOCI.every(v => v.def && v.def.length >= 25 && v.why && v.why.length >= 30),
    VOCI.filter(v => !v.def || v.def.length < 25 || !v.why || v.why.length < 30).map(v => v.term).join(', '));
  t('nessuna voce ripete la definizione come motivo',
    VOCI.every(v => v.def !== v.why));

  // ogni unità del corso deve essere rappresentata
  const coperte = new Set(VOCI.map(v => lezioni.get(v.lesson).unit));
  t('tutte le 8 Foundations hanno almeno un termine', FOUNDATION_UNITS.every(u => coperte.has(u.id)),
    `${[...coperte].filter(id => /^u\d+$/.test(id)).length}/${FOUNDATION_UNITS.length}`);
  const perUnita = {};
  VOCI.forEach(v => { const u = lezioni.get(v.lesson); perUnita['U' + u.ui] = (perUnita['U' + u.ui] || 0) + 1; });
  // le 8 unità curate sono coperte a fondo; i desk specialistici hanno
  // solo i termini propri, che è voluto
  const curate = Object.entries(perUnita).filter(([k]) => +k.slice(1) <= 8).map(([, n]) => n);
  t('ogni unità curata ha almeno 5 termini', curate.every(n => n >= 5), JSON.stringify(perUnita));

  // i termini che un colloquio chiede per primi devono esserci
  const attesi = ['FOB','CIF','Quotational period (QP)','Basis','Contango','Backwardation',
    'Variation margin','Hedge ratio','Letter of credit (LC)','Laycan','Notice of Readiness (NOR)',
    'Demurrage','Bill of lading (B/L)','Time charter equivalent (TCE)','Worldscale','Value at Risk (VaR)'];
  // i termini possono avere il nome per esteso ("FOB — Free On Board"):
  // basta che inizino col token che un colloquio userebbe
  const mancanti = attesi.filter(a => !VOCI.some(v => v.term === a || v.term.startsWith(a + ' ')));
  t('i termini che un colloquio chiede sono tutti presenti', mancanti.length === 0, mancanti.join(', '));
}

/* ── la pagina ── */
{
  const { w, errors } = await boot({ pagina: 'glossary.html' });
  const $ = s => w.document.querySelector(s);
  const $$ = s => [...w.document.querySelectorAll(s)];
  t('la pagina si carica senza errori', errors.length === 0, errors.slice(0, 2).join('|'));
  t('disegna tutte le voci, nessuna scartata in silenzio',
    $$('.gl-item').length === w.GLOSSARY_PAGE.voci.length,
    $$('.gl-item').length + ' disegnate su ' + w.GLOSSARY_PAGE.voci.length);
  t('raggruppate per unità nell\'ordine del percorso', $$('.gl-unit').length >= 8,
    $$('.gl-unit').length + ' gruppi');
  t('l\'intestazione dice quale unità è',
    /Unit 1/.test($$('.gl-unit h2')[0].textContent) && /Unit 8/.test($$('.gl-unit h2')[7].textContent));
  t('mostra il conteggio', new RegExp(w.GLOSSARY_PAGE.voci.length + ' terms').test($('#glCount').textContent), $('#glCount').textContent);
  t('il filtro elenca ogni unità con termini, più "All"', $$('#glUnit option').length === $$('.gl-unit').length + 1,
    $$('#glUnit option').length + ' opzioni');
  t('ogni voce rimanda alla lezione con un link diretto',
    $$('.gl-link').every(a => /^learn\.html\?lesson=[a-z0-9]+$/.test(a.getAttribute('href'))),
    $$('.gl-link')[0]?.getAttribute('href'));
  t('e dice quale lezione è', /Lesson \d+ · /.test($$('.gl-link')[0].textContent),
    $$('.gl-link')[0].textContent.trim());
  t('il campo di ricerca ha un\'etichetta', !!$('label[for="glSearch"]'));
  t('e il filtro pure', !!$('label[for="glUnit"]'));
  t('il conteggio è annunciato', $('#glCount').getAttribute('role') === 'status');
  t('c\'è un modo per tornare al corso', $$('a[href="learn.html"]').length >= 1);
  t('il marchio riporta alla landing', $('.brand-link')?.getAttribute('href') === 'index.html');

  /* ricerca */
  const cerca = v => { $('#glSearch').value = v; $('#glSearch').dispatchEvent(new w.Event('input', { bubbles: true })); };
  cerca('demurrage');
  t('la ricerca filtra', $$('.gl-item').length > 0 && $$('.gl-item').length < 70,
    $$('.gl-item').length + ' risultati');
  t('il termine esatto è il primo risultato', /^Demurrage/.test($$('.gl-item dt')[0].textContent.trim()),
    $$('.gl-item dt').map(d => d.textContent.trim().split(' Unit')[0]).join(' | '));
  t('cercando si passa a un elenco piatto, non per unità', $$('.gl-unit h2').length === 0);
  t('ogni risultato dice da quale unità viene', $$('.gl-item .gl-u').length === $$('.gl-item').length);
  t('il conteggio si aggiorna', /of \d+ terms/.test($('#glCount').textContent), $('#glCount').textContent);
  cerca('cash today');
  t('cerca anche nel testo, non solo nel titolo', $$('.gl-item').length >= 1,
    $$('.gl-item dt').map(d => d.textContent).join(', '));
  cerca('QUOTATIONAL');
  t('la ricerca ignora le maiuscole', $$('.gl-item').length >= 1);
  cerca('zzzz');
  t('senza risultati lo dice invece di mostrare il vuoto',
    $$('.gl-item').length === 0 && !$('#glEmpty').hidden);
  t('e suggerisce cosa fare', /shorter word/.test($('#glEmpty').textContent));
  cerca('');
  t('svuotando la ricerca torna tutto', $$('.gl-item').length === w.GLOSSARY_PAGE.voci.length);

  /* filtro per unità */
  $('#glUnit').value = 'u5';
  $('#glUnit').dispatchEvent(new w.Event('change', { bubbles: true }));
  t('il filtro per unità isola un\'unità', $$('.gl-unit').length === 1);
  t('ed è quella giusta', /Shipping/.test($('.gl-unit h2').textContent),
    $('.gl-unit h2').textContent.trim());
  cerca('bill');
  t('ricerca e filtro si combinano', $$('.gl-item').length >= 1,
    $$('.gl-item dt').map(d => d.textContent).join(', '));

  /* pertinenza su termini che si somigliano */
  $('#glUnit').value = ''; $('#glUnit').dispatchEvent(new w.Event('change', { bubbles: true }));
  cerca('basis');
  const primi = $$('.gl-item dt').map(d => d.textContent.trim().split(' Unit')[0]);
  t('"basis" mette Basis prima di Basis risk', primi[0] === 'Basis', primi.slice(0, 4).join(' | '));
  cerca('margin');
  const m2 = $$('.gl-item dt').map(d => d.textContent.trim().split(' Unit')[0]);
  t('"margin" mette i termini che iniziano così prima delle menzioni',
    m2.slice(0, 4).every(x => /margin/i.test(x)), m2.slice(0, 6).join(' | '));
}

/* ── link diretto a un termine ── */
{
  const { w } = await boot({ pagina: 'glossary.html', hash: '#t-demurrage' });
  await pausa(60);
  const el = w.document.querySelector('#t-demurrage');
  t('un termine può essere linkato direttamente', !!el);
  t('e viene evidenziato all\'arrivo', el?.classList.contains('gl-target'));
}
t.fine();
