# Cicero — scoprire l'Italia con chi la vive

App mobile-first per studenti (14-19 anni): il **Visitatore** scopre un luogo guidato da un coetaneo, il **Cicerone** crea itinerari nella propria città e può far valere le guide come PCTO/FSL.

Nome proposto: **Cicero**. Slogan: *"Scopri l'Italia con chi la vive."* (facilmente cambiabile)

## Stile

- Palette contemporanea giovane: fondo quasi nero `#0E1116`, accento lime `#C6F24E`, bianco, grigio `#8A93A0`
- Tipografia: Space Grotesk (titoli) + DM Sans (testo), angoli morbidi, card piene, micro-animazioni sui tap
- Layout mobile-first con bottom navigation a 3 voci, tutto in italiano

## Backend (Lovable Cloud)

Attivo database + login reale: email/password e Google. Tabelle previste:

- `profiles` — utente, ruolo attivo (visitatore/cicerone), età, sesso, scuola, città, lingue, accessibilità, descrizione, flag FSL
- `interests` + `profile_interests` — catalogo interessi e collegamento all'utente
- `itineraries` + `itinerary_stops` — itinerari del cicerone: città, durata, punto d'incontro, tappe ordinate
- `availability` — fasce orarie di disponibilità del cicerone
- `bookings` — richieste dei visitatori: data, ora, stato (in attesa/accettata/rifiutata/completata)
- `reviews` — recensioni con voto e testo
- `stamps` — timbri per luogo visitato
- `visit_photos` — foto caricate a fine visita (storage)
- `fsl_hours` — ore FSL registrate per guida (2 ore, max 5/mese)

Tutte le tabelle con permessi e regole di accesso riga-per-riga: ognuno vede e modifica solo i propri dati; i profili dei ciceroni e le recensioni sono leggibili dagli utenti autenticati.

## Flusso schermate

```text
/            login (logo + slogan, email o Google)
/onboarding  scelta ruolo: Visitatore | Cicerone
  -> /onboarding/visitatore   età, sesso, scuola, interessi
  -> /onboarding/cicerone     + descrizione, luoghi preferiti,
                                accessibilità, orari, lingue
                              -> proposta FSL (Sì / Non adesso)
                              -> documento per la preside + download .docx
                              -> avviso: attiva modalità FSL nelle impostazioni

VISITATORE  [Mappa] [Timbri] [Account]
  /mappa                 mappa Italia + ricerca città con dropdown
  /mappa/:citta          ciceroni consigliati, ordinati per compatibilità
  /cicerone/:id          descrizione, caratteristiche, recensioni, orari,
                         itinerario con tappe e durata, bottone "Prenota"
  /prenota/:id           scelta data + orario, conferma richiesta
  /visita/:id/fine       upload foto + assegnazione timbro
  /timbri                collezione timbri per luogo visitato
  /account               profilo, cambia ruolo, impostazioni

CICERONE   [Itinerario] [Prenotazioni] [Account]
  /itinerari             lista + CTA "Crea itinerario"
  /itinerari/nuovo       scelta città, punto d'incontro, tappe
                         aggiungibili/rimovibili, durata, "Crea"
  /prenotazioni          card con dettagli, accetta/rifiuta
  /account               profilo, cambia ruolo, impostazioni
                         + sezione FSL (checkbox): ore del mese,
                           download PDF ore per il professore
```

## Matching ciceroni

Punteggio calcolato lato server: interessi in comune (peso maggiore), vicinanza d'età, corrispondenza di sesso preferita, lingue e disponibilità accessibilità. I ciceroni sono mostrati dal più compatibile con l'indicazione degli interessi condivisi.

## Timbri

Al completamento della visita (foto caricate) viene generato un timbro con nome città, data e un motivo grafico distintivo per città — visibile nella collezione come griglia stile passaporto.

## FSL / PCTO

- Documento di presentazione precompilato con dati dello studente e scuola, scaricabile in `.docx`
- Modalità FSL attivabile: 2 ore per guida completata, massimo 5 guide al mese
- Riepilogo ore del mese corrente + esportazione PDF firmabile dal coordinatore

## Note tecniche

- TanStack Start, rotte protette dietro il layout autenticato; il login vive su rotta pubblica
- Mappa Italia: SVG interattivo con città predefinite (nessuna dipendenza esterna) + ricerca con dropdown filtrata
- Foto delle visite su storage privato con URL firmati
- `.docx` generato lato server con la libreria `docx`; PDF ore con `pdf-lib`
- Validazione input con zod su client e server; limiti di lunghezza su testi liberi
- Dati seed: catalogo interessi, elenco città italiane e alcuni ciceroni/itinerari dimostrativi così la mappa non è vuota

## Ordine di lavoro

1. Attivazione Cloud, schema e permessi, dati seed
2. Login (email + Google) e scelta ruolo
3. Onboarding visitatore e cicerone
4. Sezione cicerone: creazione itinerari, prenotazioni
5. Sezione visitatore: mappa, matching, scheda cicerone, prenotazione
6. Fine visita, foto, timbri
7. Account, cambio ruolo, FSL: docx, tracking ore, PDF
