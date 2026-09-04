/* La ricarica dei salvagenti a tempo. Regola v0.5.1:
   1 ogni 6 minuti; da 0/5 servono 30 minuti pieni per tornare a 5/5.
   Nessuno streak può saltare il timer. */
import { boot, solver, suite } from './harness.mjs';

const t = suite('Ricarica dei salvagenti');
const { w } = await boot();
const L = w.__LEARN__;
const S = solver(w, L);
const MIN = 60 * 1000;

t('un salvagente matura ogni sei minuti', L.LIFE_REGEN_MS === 6 * MIN,
  Math.round(L.LIFE_REGEN_MS / MIN) + ' minuti');
t('da zero a cinque sono trenta minuti', L.FULL_REFILL_MS === 30 * MIN,
  Math.round(L.FULL_REFILL_MS / MIN) + ' minuti');

/* ── a fondo pieno non si conta nulla ── */
L.state.lives = L.MAX_LIVES; L.state.livesAt = 0;
t('a fondo pieno non c’è nessuna attesa', L.attesaVita() === 0);
t('e il fondo resta pieno anche dopo ore',
  L.maturaVite(Date.now() + 8 * 60 * MIN) === L.MAX_LIVES);

/* ── spendere avvia il conto alla rovescia ── */
const ora = Date.now();
L.state.lives = L.MAX_LIVES; L.state.livesAt = 0;
L.spendiVita();
t('spendere dal massimo fa partire il conto alla rovescia',
  L.state.livesAt > 0 && L.livesNow() === L.MAX_LIVES - 1,
  `${L.livesNow()} salvagenti`);
t('il prossimo arriva solo dopo sei minuti',
  L.attesaVita() > 5 * MIN && L.attesaVita() <= 6 * MIN,
  Math.ceil(L.attesaVita() / MIN) + ' minuti');

/* ── arrivare a zero garantisce 30 minuti pieni al refill completo ── */
L.state.lives = 1; L.state.livesAt = ora - 5 * MIN;
L.spendiVita();
const zeroAt = L.state.livesAt;
t('spendendo l’ultimo salvagente il timer riparte da zero',
  L.state.lives === 0 && Math.abs(zeroAt - Date.now()) < 2000);
t('dopo 29 minuti non è ancora pieno', L.maturaVite(zeroAt + 29 * MIN) === 4,
  String(L.maturaVite(zeroAt + 29 * MIN)));
t('solo a 30 minuti torna a 5/5', L.maturaVite(zeroAt + 30 * MIN) === L.MAX_LIVES,
  String(L.maturaVite(zeroAt + 30 * MIN)));

/* ── il tempo trascorso a app chiusa vale e conserva il resto ── */
L.state.lives = 1; L.state.livesAt = ora - 19 * MIN;
t('diciannove minuti chiusi restituiscono tre salvagenti', L.maturaVite(ora) === 4,
  String(L.maturaVite(ora)));
t('e il minuto già maturato verso il successivo non si butta',
  L.attesaVita(ora) > 4 * MIN && L.attesaVita(ora) <= 5 * MIN,
  Math.ceil(L.attesaVita(ora) / MIN) + ' minuti al prossimo');

/* ── non si supera mai il massimo ── */
L.state.lives = 0; L.state.livesAt = ora - 10 * 60 * MIN;
t('dieci ore non danno più del massimo', L.maturaVite(ora) === L.MAX_LIVES,
  String(L.maturaVite(ora)));
t('e a fondo pieno il timer si spegne', L.state.livesAt === 0);

/* ── un orologio spostato indietro non regala niente ── */
L.state.lives = 2; L.state.livesAt = ora + 60 * MIN;
t('un orologio spostato indietro non regala salvagenti',
  L.maturaVite(ora) === 2, String(L.maturaVite(ora)));
t('e il conto riparte da adesso, senza penalizzare', Math.abs(L.state.livesAt - ora) < 2000);

/* ── gli streak non saltano più l’attesa ── */
L.state.lives = 3; L.state.livesAt = ora;
L.state.streakNow = 10;
t('il recupero istantaneo tramite streak è disattivato', L.STREAK_PER_LIFE === 0);
L.forseGuadagnaVita();
t('dieci risposte giuste non restituiscono un salvagente subito', L.livesNow() === 3,
  String(L.livesNow()));

/* ── quello che l'utente vede ── */
t('il testo dell’attesa è leggibile', L.testoAttesa(14 * MIN + 3000) === '15m'
  && L.testoAttesa(45000) === '45s' && L.testoAttesa(0) === '0s');

L.state.lives = L.MAX_LIVES; L.state.livesAt = 0; L.renderStatLives();
t('a fondo pieno il contatore non mostra nessun timer', S.$('#statLivesTimer').hidden === true);

L.state.lives = 2; L.state.livesAt = Date.now() - 2 * MIN; L.renderStatLives();
t('altrimenti mostra quanto manca', S.$('#statLivesTimer').hidden === false
  && /^\d+[ms]$/.test(S.$('#statLivesTimer').textContent), S.$('#statLivesTimer').textContent);

t('e il numero in alto resta quello vero', S.$('#statLives').textContent === String(L.livesNow()));

L.state.lives = 0; L.state.livesAt = Date.now();
L.startLesson(L.UNITS[0].lessons[0].id);
const avviso = (S.$('#lockedHint')?.textContent || '').toLowerCase();
t('senza salvagenti l’avviso dice prossimo refill, full refill e Practice',
  /practice/.test(avviso) && /30m|30 minutes|30 minute/.test(avviso) && /6m|6 minutes|6 minute/.test(avviso),
  avviso.slice(0, 140) || 'nessun avviso');

L.state.lives = L.MAX_LIVES; L.state.livesAt = 0;
L.avviaOrologioVite();
t('a fondo pieno non resta nessun timer acceso', true, 'il processo esce da solo');
L.fermaOrologioVite();

t.fine();
