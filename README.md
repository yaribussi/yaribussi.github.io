# OpereInComputer — Prototipo di sito per GitHub Pages

Questo pacchetto contiene una pagina statica minima con due demo interattive:
- **Fluidodinamica**: particelle che fluiscono e reagiscono al mouse
- **Meccanica quantistica**: visualizzazione semplificata di un'onda 1D (|ψ|^2)

**Contenuto:**
- `index.html`
- `styles.css`
- `script.js`
- `README.md` (questo file)

## Come mettere online (passo rapido)
1. Crea un account su https://github.com se non l'hai già.
2. Crea un repository con nome `TUOUSERNAME.github.io`
3. Carica i file in root (tramite web: "Add file" → "Upload files") e fai commit.
4. Dopo qualche minuto apri `https://TUOUSERNAME.github.io` (sostituisci TUOUSERNAME).

## Opzioni avanzate
- Se preferisci usare `git` dal terminale, i comandi base sono:
  ```bash
  git init
  git add .
  git commit -m "Initial site"
  git branch -M main
  git remote add origin https://github.com/TUOUSERNAME/TUOUSERNAME.github.io.git
  git push -u origin main
  ```
- Per aggiungere un dominio personalizzato (es. `www.OpereInComputer.it`) registralo con un registrar, poi aggiungi un file `CNAME` contenente il dominio nella root del repo e configura il DNS del dominio verso GitHub (A records + CNAME) — posso guidarti passo passo quando vuoi.

## Prossimi passi proposti
- Aggiungere pagine "lezioni" con testo e formule (MathJax)
- Aggiungere piccoli esercizi interattivi e quiz
- Sostituire la grafica, aggiungere logo e favicon

Se vuoi, cambio subito il titolo del sito (`OpereInComputer`) con il nome che preferisci e rigenero il pacchetto.
