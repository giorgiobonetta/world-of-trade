/* Configurazione del salvataggio in cloud.
   Finché url e chiave restano vuoti, l'app funziona esattamente come prima:
   nessun login, progressi solo sul dispositivo. Istruzioni in SUPABASE-SETUP.md. */
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
