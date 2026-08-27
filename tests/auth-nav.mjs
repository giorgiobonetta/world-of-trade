import { boot, suite } from './harness.mjs';
const t = suite('Accesso obbligatorio e top navigation');

/* Senza configurazione il gioco resta chiuso. */
{
  const { w, errors } = await boot();
  const d = w.document;
  t('il body parte bloccato', d.body.classList.contains('auth-locked'));
  t('il gate di accesso è visibile', d.querySelector('#authGate') && !d.querySelector('#authGate').hidden);
  t('il gioco non può essere usato senza backend auth', d.querySelector('#authSignIn')?.disabled === true);
  // il messaggio deve dire cosa fare, non solo cosa manca
  const msg = d.querySelector('#authGateStatus')?.textContent || '';
  t('spiega quale file creare', /supabase-config\.example\.js/.test(msg), msg.slice(0, 70));
  t('e dove sono le istruzioni', /SUPABASE-SETUP\.md/.test(msg));
  t('nessun errore runtime', errors.length === 0, errors.slice(0,2).join('|'));
}

/* Con Supabase configurato ma senza sessione, i due CTA auth diventano attivi. */
{
  const { w, errors } = await boot({ cloud:true });
  const d = w.document;
  t('senza sessione resta bloccato', d.body.classList.contains('auth-locked'));
  t('Sign in è attivo', d.querySelector('#authSignIn')?.disabled === false);
  t('Create account è attivo', d.querySelector('#authSignUp')?.disabled === false);
  t('5 sezioni sono nella nav superiore', d.querySelectorAll('#appHeader #gameNav .nav-item').length === 5);
  t('nav e premi condividono lo stesso header', !!d.querySelector('#appHeader .header-stats #statXp') && !!d.querySelector('#appHeader #statLevel'));
  t('nessun errore runtime unsigned', errors.length === 0, errors.slice(0,2).join('|'));
}

/* Una sessione salvata sblocca l'app e mantiene la navigazione in alto. */
{
  const sb = { fetch: async () => ({ ok:true, status:200, text:async()=> '[]' }) };
  const sessione = { access_token:'x', refresh_token:'r', user:{ id:'u1', email:'trader@example.com' } };
  const { w, errors } = await boot({ cloud:true, sessione, sb });
  const d = w.document;
  t('la sessione sblocca il gioco', !d.body.classList.contains('auth-locked'));
  t('il gate viene nascosto', d.querySelector('#authGate')?.hidden === true);
  t('Path è il tab iniziale', d.querySelector('#gameNav [data-screen="pathScreen"]')?.classList.contains('active'));
  t('il livello è mostrato accanto agli XP', d.querySelector('#statLevel')?.textContent === '1' && d.querySelector('#statXp')?.textContent === '0');
  t('nessun errore runtime authenticated', errors.length === 0, errors.slice(0,2).join('|'));
}

t.fine();
