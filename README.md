# Cicerone Connect

Voglio creare un'applicazione dove:





# GENERALITA':





Target audience:

1. Studenti (terza fino a quinta superiore) che vuole scoprire un patrimonio 

2. Studenti (terza fino a quinta superiore) che quel patrimonio lo vive ogni giorno e vuole presentarlo ad altri coetanei.





Il ragazzo può avere due ruoli:

VISITATORE

→ voglio scoprire un nuovo luogo attraverso qualcuno che ci vive.

CICERONE

→ vivo in quel luogo e voglio farlo conoscere a un altro giovane.





# SCHEDA TECNICA:





L'utente apre l'applicazione e compare una schermata di login, con sopra il logo e lo slogan dell'applicazione. Concedi possibilità di fare login con mail o anche con google.





## Selezione principale (onboarding 1)





Dopo esser entrati, compaiono 2 possibilità di uso (schermata con questionario scelta che indirizza a diverse schermate successive)

1. Visitatore

2. Cicerone





## Schermata Visitatore





Queste schermate compaiono dopo aver completato [Selezione principale]:





### Onboarding 1.1

1. Questionario per identificare il profilo:

- età

- sesso

- scuola

- interessi personali





[End of Onboarding 1.1]





metti come barra di navigazione sotto le opzioni [mappa, timbri, account]





2. L’applicazione si apre di default nella sezione mappa: si apre la mappa dell'Italia in cui c'è una barra di ricerca sopra; cercando, esce una dropdown che mostra il luogo desiderato (e.g. Venezia), l’utente può poi cliccarci sopra.





3. Dopo aver selezionato il luogo desiderato, l’ia ti mostra i ciceroni del luogo adatti a te in base agli interessi, età e sesso scelti prima durante il questionario. 





4. Scelto il cicerone preferito, viene mostrato la loro descrizione, le loro caratteristiche, le loro recensioni, orari disponibili, il loro itinerario con tappe e durata, e un bottone per prenotarlo.

5. Viene mostrata schermata per scegliere data e orario e bottone per confermare e inviare la richiesta.





6. alla fine della visita dell’itinerario si puo caricare alcune foto fatte durante il tragitto con il cicerone e ti viene assegnato un timbro





sezione [TIMBRI]:

luogo in cui vengono tenuti i timbri di ogni luogo visitato




### ACCOUNT SECTION visitatori (standard)

1. profile

2. switch to cicerone and viceversa

3. settings




## Schermata Cicerone





Queste schermate compaiono dopo aver completato [Selezione principale]: 




### Onboarding 1.2

1. Questionario per identificare il profilo:

- età

- sesso

- scuola

- interessi personali

- descrizione personale

- luoghi preferiti

- disponibilità per fare tour a persone disabili

- disponibilità orari

- lingue disponibili





2. dopo gli si propone in una schermata (si/non adesso) questa domanda: “Vuoi far valere le tue guide come FSL (Formazione Scuola Lavoro)?”

se si clicca si, viene mostrato un’ulteriore pagina dove viene mostrato un documento precompilato da mostrare alla preside del proprio istituto con una presentazione del funzionamento dell’applicazione e la validità dell’attività per FSL (2 ore a guida, max 5 volte al mese).

da quello si puo scaricare il documento in formato file docx.

Compare schermata in cui dice di abilitare modalità FSL (total hour tracking) dopo nelle impostazioni





metti come barra di navigazione sotto le opzioni [ITINERARIO, PRENOTAZIONI, ACCOUNT]





3. l’applicazione si apre di default nella sezione [ITINERARIO]:

- bottone call-to action per creare itinerario.

- si chiede in una schermata simile alla [MAPPA] della sezione visitatore, dove al cicerone, selezionata la città, compare:

- schermata dove:
-- si selezionano le tappe che il cicerone vuole includere nell’itinerario (punto d’incontro, tappa 1 con textbox, tappa 2 con textbox cancellabile, etc, e sezione per aggiungere altre tappe), scrivere la durata dell’itinerario e per ultimo bottone crea.




[Sezione PRENOTAZIONI]

vengono visualizzate le prenotazioni effettuate da visitatori con informazioni dettagliate, visuale cards.




[Sezione ACCOUNT]

Opzioni standard detti in [# ACCOUNT SECTION], + sezione fsl specifico da attivare con un checkbox (come detto prima nella selezione FSL):

- hour tracking: visualizzazione delle ore accumulate nel mese corrente

- sezione per scaricare pdf con ore accumulate al mese, adatto alla consegna al professore cordinatore dello studente.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/52ac878d-4da1-4520-a9d7-84ca550d98ca).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
