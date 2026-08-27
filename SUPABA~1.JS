/* ESEMPIO — questo file non viene caricato dall'app.

   Copialo in `supabase-config.js` e riempi i campi. Quel file NON fa parte del
   pacchetto proprio per questo: è l'unico il cui contenuto giusto esiste solo
   sul tuo repository, e includerlo vuoto significherebbe cancellare le tue
   chiavi a ogni caricamento completo. È già successo.

   Con l'autenticazione obbligatoria, una configurazione mancante blocca tutta
   l'app: se dopo un rilascio vedi "Authentication is required", il primo posto
   da guardare è se `supabase-config.js` è ancora al suo posto e pieno.

   Istruzioni complete in SUPABASE-SETUP.md. */
window.WOT_CLOUD = {
  url: '',        // es. 'https://abcdefgh.supabase.co'

  // La chiave PUBBLICA del progetto. Supabase la chiama:
  //   'anon public'  sui progetti più vecchi  (inizia con eyJ...)
  //   'publishable'  sui progetti nuovi       (inizia con sb_publishable_...)
  // Vanno bene entrambe: incollala qui sotto, in uno dei due campi.
  anonKey: '',
  publishableKey: '',

  // MAI incollare qui 'service_role' o una chiave 'sb_secret_...':
  // darebbe a chiunque accesso completo al database. L'app se ne accorge,
  // si spegne e mostra un avviso, ma la chiave sarebbe comunque da revocare.

  siteUrl: '',    // opzionale: l'indirizzo pubblico del sito, per il link di condivisione
                  // se resta vuoto si usa il dominio da cui la pagina è aperta
};
