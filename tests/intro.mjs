/* L'introduzione al primo avvio. Esiste per chi apre l'app una volta sola,
   quindi deve comparire da sé, dire le cose giuste, e non ripresentarsi mai
   più. Il modo in cui una finestra come questa rovina un'app è restare
   aperta, rubare il fuoco, o tornare a ogni avvio. */
import { boot, suite } from './harness.mjs';

const t = suite('Introduzione al primo avvio');

/* ── al primo avvio si apre da sola ── */
{
  const { w, errors } = await boot();
  const d = w.document.getElementById('introDialog');
  t('la finestra esiste nella pagina', !!d);
  t('e al primo avvio è aperta', d && d.hidden === false);
  t('senza errori in console', errors.length === 0, errors.slice(0, 2).join(' | '));

  const I = w.INTRO;
  t('dichiara due passi rapidi', I && I.passi() === 2, String(I && I.passi()));
  t('parte dal primo', I && I.indice === 0);

  const titolo = w.document.getElementById('introTitle').textContent;
  const copia = w.document.getElementById('introCopy').textContent;
  t('il primo passo porta subito sul trading floor',
    /trading floor|desk 1|trading decisions/i.test(titolo + copia), titolo);

  /* il contenuto deve riflettere le regole vere, non quelle di ieri */
  const testoIntero = () => w.document.getElementById('introDialog').textContent;
  const avanti = () => w.document.getElementById('introNext')
    .dispatchEvent(new w.Event('click', { bubbles: true }));

  avanti();
  const secondo = testoIntero();
  t('il secondo passo spiega i salvagenti', /lifebuoy/i.test(secondo));
  t('e dice che si ricaricano a tempo', /every 6 minutes|6 minutes/i.test(secondo),
    (secondo.match(/.{0,40}6 minutes.{0,40}/i) || [''])[0].trim());
  t('e dichiara trenta minuti da zero a pieno', /30 minutes/i.test(secondo));
  t('all’ultimo passo il pulsante porta al Desk 1',
    /Desk 1/i.test(w.document.getElementById('introNext').textContent));
  t('e la scorciatoia per saltare sparisce',
    w.document.getElementById('introSkip').hidden === true);

  avanti();
  t('dopo l’ultimo passo si chiude', d.hidden === true);
  t('e non lascia la pagina senza fuoco', !!w.document.activeElement);
}

/* ── non torna al secondo avvio ── */
{
  const a = await boot();
  a.w.document.getElementById('introSkip')
    .dispatchEvent(new a.w.Event('click', { bubbles: true }));
  t('saltandola, si chiude subito',
    a.w.document.getElementById('introDialog').hidden === true);
  t('e il fatto viene registrato', a.w.localStorage.getItem(a.w.INTRO.CHIAVE) === '1');

  // secondo avvio con la memoria del primo
  const b = await boot({ locale: { [a.w.INTRO.CHIAVE]: '1' } });
  t('e al ritorno non ricompare',
    b.w.document.getElementById('introDialog').hidden === true);
  t('ma resta richiamabile dal Profilo',
    !!b.w.document.getElementById('introReplay'));
  b.w.INTRO.apri();
  t('e richiamandola si riapre dal primo passo',
    b.w.document.getElementById('introDialog').hidden === false && b.w.INTRO.indice === 0);
}

/* ── tastiera ── */
{
  const { w } = await boot();
  const d = w.document.getElementById('introDialog');
  const esc = new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
  w.document.dispatchEvent(esc);
  t('Escape la chiude', d.hidden === true);
}

/* ── non deve coprire l'app per sempre ── */
{
  const { w } = await boot();
  const d = w.document.getElementById('introDialog');
  d.dispatchEvent(new w.Event('click', { bubbles: true }));   // clic sul fondo
  t('un clic sullo sfondo la chiude', d.hidden === true);
  t('e l’app dietro è di nuovo raggiungibile',
    w.document.querySelectorAll('.node').length > 0);
}

t.fine();
