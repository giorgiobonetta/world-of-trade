/* Configurazione del salvataggio in cloud.
   Finché questi due valori restano vuoti, l'app funziona esattamente come prima:
   nessun login, progressi solo sul dispositivo. Istruzioni nel README. */
window.WOT_CLOUD = {
  url: '',        // es. 'https://abcdefgh.supabase.co'
  anonKey: '',    // la chiave "anon public": è pubblica per progetto, va bene nel codice
  siteUrl: '',    // opzionale: l'indirizzo pubblico del sito, per il link di condivisione
                  // se resta vuoto si usa il dominio da cui la pagina è aperta
};
