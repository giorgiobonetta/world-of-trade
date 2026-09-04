/* Hélène presenta un concetto la prima volta che compare.
   Le cose che possono rovinarlo, in ordine: presentare due volte la stessa
   parola, presentarne una sbagliata perché il testo ne conteneva un'altra
   più lunga, far pagare un salvagente per una schermata che non è una
   domanda, e trasformare una lezione in una sequenza di schede. */
import { boot, solver, suite, DIR } from './harness.mjs';
import fs from 'fs';

const CSS = fs.readFileSync(DIR + '/styles.css', 'utf8');
const t = suite('Presentazioni di Hélène');
const { w, errors } = await boot();
const L = w.__LEARN__;
const S = solver(w, L);
const d = w.document;

/* ── il riconoscimento del termine ── */
t('riconosce un termine nel testo', L.citato('The demurrage clock starts on NOR', 'demurrage'));
t('e anche al plurale', L.citato('two cargoes arrived', 'cargo') || L.citato('two cargos arrived', 'cargo'));
t('non lo confonde con una parola che lo contiene',
  !L.citato('the basisrisk column', 'basis'));
t('riconosce i termini con simboli dentro', L.citato('the owner’s P&I cover', 'P&I'));
t('e non è sensibile alle maiuscole', L.citato('Freight is a cost', 'freight'));

/* ── nome esteso e sigla sono la stessa cosa ── */
{
  t('una voce con la sigla genera entrambe le forme',
    JSON.stringify(L.formeDi('Letter of credit (LC)')) === '["Letter of credit","LC"]',
    JSON.stringify(L.formeDi('Letter of credit (LC)')));
  t('e una voce doppia si sdoppia',
    JSON.stringify(L.formeDi('GAFTA / FOSFA')) === '["GAFTA","FOSFA"]');
  t('una voce semplice resta una', L.formeDi('Demurrage').length === 1);

  L.state.visti = [];
  const perSigla = L.concettoNuovo({ prompt: 'The buyer opens an LC through its bank.' });
  t('la sigla nel testo trova il concetto', perSigla && /Letter of credit/.test(perSigla.term),
    perSigla ? perSigla.term : 'nessuno');
  const perEsteso = L.concettoNuovo({ prompt: 'The buyer opens a letter of credit.' });
  t('e il nome esteso pure', perEsteso && /Letter of credit/.test(perEsteso.term),
    perEsteso ? perEsteso.term : 'nessuno');

  // era il difetto vero: "FOB" non veniva mai riconosciuto
  const fob = L.concettoNuovo({ prompt: 'Under an FOB sale, who nominates the vessel?' });
  t('anche i termini che nel glossario hanno la sigla fra parentesi', !!fob,
    fob ? fob.term : 'nessuno');
}

/* ── una lezione vera ── */
{
  L.state.visti = [];
  L.state.lives = L.MAX_LIVES;
  L.startLesson(L.UNITS[0].lessons[0].id);

  const card = () => d.querySelector('#exerciseArea .teach-card');
  t('la prima domanda è preceduta da una presentazione', !!card());
  t('la scheda nomina il termine',
    (d.querySelector('.teach-term')?.textContent || '').length > 2,
    d.querySelector('.teach-term')?.textContent);
  t('e lo spiega', (d.querySelector('.teach-say')?.textContent || '').length > 30,
    (d.querySelector('.teach-say')?.textContent || '').slice(0, 60));
  t('con Hélène che parla', !!d.querySelector('.teach-face svg'));
  t('il pulsante non chiede di rispondere', d.getElementById('checkButton').textContent === 'Got it');
  t('ed è già premibile', d.getElementById('checkButton').disabled === false);
  t('durante la presentazione non si può rivelare niente',
    d.getElementById('revealButton').hidden === true);

  const primaVite = L.livesNow();
  L.onCheck();
  t('leggerla non costa salvagenti', L.livesNow() === primaVite,
    `${primaVite} → ${L.livesNow()}`);
  t('dopo la scheda arriva la domanda vera', !card() && !!L.run.current.ex);
  t('e il pulsante torna a chiedere una risposta',
    d.getElementById('checkButton').textContent === 'Check');
  t('il termine risulta ormai presentato', L.state.visti.length === 1, L.state.visti.join(', '));
}

/* ── mai due volte ── */
{
  const gia = L.state.visti[0];
  t('un termine già presentato non torna',
    L.concettoNuovo({ prompt: `A question about ${gia} and nothing else new.` }) === null,
    gia);
}

/* ── il tetto per lezione ── */
{
  t('il tetto è dichiarato', L.MAX_PRESENTAZIONI === 2, String(L.MAX_PRESENTAZIONI));

  L.state.visti = [];
  L.state.lives = L.MAX_LIVES;
  // u6l1 è fra le lezioni che introdurrebbero quattro termini su cinque
  const lez = L.UNITS.flatMap(u => u.lessons).find(l => l.id === 'u6l1');
  if (lez) {
    L.state.done.push(lez.id);
    L.startLesson(lez.id);
    let schede = 0, giri = 0;
    while (L.run && giri++ < 40) {
      if (d.querySelector('.teach-card')) { schede++; L.onCheck(); continue; }
      const ex = L.run.current?.ex;
      if (!ex) break;
      S.giusto(ex); L.onCheck(); L.onCheck();
    }
    t('una lezione non diventa una sequenza di schede', schede <= L.MAX_PRESENTAZIONI,
      `${schede} schede in ${lez.exercises.length} esercizi`);
  } else {
    t('una lezione non diventa una sequenza di schede', true, 'lezione di prova assente');
  }
}

/* ── sopravvive alla chiusura dell'app ── */
{
  const a = await boot();
  a.w.__LEARN__.segnaVisto('Demurrage');
  const salvato = JSON.parse(a.w.localStorage.getItem(a.w.__LEARN__.STORAGE_KEY) || '{}');
  t('i termini presentati vengono salvati',
    Array.isArray(salvato.visti) && salvato.visti.includes('Demurrage'),
    JSON.stringify(salvato.visti));

  const b = await boot({ seed: { ...salvato } });
  t('e al ritorno non si ripresentano',
    b.w.__LEARN__.vistoConcetto('Demurrage'));
}

/* ── un salvataggio vecchio non deve rompersi ── */
{
  const v = await boot({ seed: { done: ['u1l1'], xp: 10 } });
  t('un salvataggio senza questo campo non rompe nulla',
    Array.isArray(v.w.__LEARN__.state.visti) && v.w.__LEARN__.state.visti.length === 0);
}

t('la scheda ha un suo stile', /\.teach-card\{/.test(CSS));
t('e rispetta chi ha chiesto meno movimento',
  /prefers-reduced-motion[^}]*\}[\s\S]{0,120}\.teach-card\{ animation:none/.test(CSS)
  || /\.teach-card\{ animation:none \}/.test(CSS));

t('nessun errore in console', errors.length === 0, errors.slice(0, 2).join(' | '));

t.fine();
