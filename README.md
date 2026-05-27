# LexFlow — Assistente AI per Studi Legali

LexFlow è un'applicazione web che permette agli avvocati di caricare documenti legali (PDF o testo) e ricevere in pochi secondi un'analisi professionale basata su intelligenza artificiale.

## Funzionalità

- **Riassunto esecutivo** del documento
- **Clausole critiche e rischiose** evidenziate
- **Domande da fare al cliente** suggerite dall'AI
- **Azioni legali consigliate** come prossimi passi

## Stack tecnologico

- **Next.js 16** con App Router
- **Tailwind CSS v4**
- **Anthropic Claude** (claude-sonnet-4-6) per l'analisi AI
- **react-dropzone** per l'upload dei documenti

---

## Installazione locale

### Prerequisiti

- Node.js >= 18
- Una chiave API Anthropic (ottenibile su [console.anthropic.com](https://console.anthropic.com))

### Passaggi

```bash
# 1. Clona il repository
git clone <url-repository>
cd lexflow

# 2. Installa le dipendenze
npm install

# 3. Configura le variabili d'ambiente
cp .env.example .env.local
# Apri .env.local e inserisci la tua ANTHROPIC_API_KEY

# 4. Avvia il server di sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

---

## Deploy su Vercel

### Metodo 1: Deploy via CLI

```bash
# Installa Vercel CLI
npm install -g vercel

# Esegui il deploy (dalla cartella del progetto)
vercel

# Segui le istruzioni per configurare il progetto
# Quando richiesto, aggiungi la variabile d'ambiente:
# ANTHROPIC_API_KEY = sk-ant-xxxxx
```

### Metodo 2: Deploy via GitHub

1. Carica il progetto su un repository GitHub
2. Vai su [vercel.com](https://vercel.com) e clicca **"Add New Project"**
3. Importa il repository GitHub
4. Nella sezione **Environment Variables**, aggiungi:
   - **Nome:** `ANTHROPIC_API_KEY`
   - **Valore:** la tua chiave API Anthropic
5. Clicca **"Deploy"**

### Note per il deploy

- La variabile `ANTHROPIC_API_KEY` è obbligatoria — senza di essa l'analisi non funziona
- Non è necessario alcun database (MVP senza persistenza)
- I file PDF caricati non vengono salvati in nessun modo

---

## Struttura del progetto

```
lexflow/
├── src/
│   └── app/
│       ├── layout.tsx          # Layout principale con font Inter
│       ├── page.tsx            # Landing page (/)
│       ├── globals.css         # Stili globali e tema colori
│       ├── analisi/
│       │   └── page.tsx        # Pagina di analisi (/analisi)
│       └── api/
│           └── analizza/
│               └── route.ts    # API route per Anthropic
├── .env.example                # Template variabili d'ambiente
├── .env.local                  # Variabili locali (NON committare)
└── README.md
```

---

## Variabili d'ambiente

| Variabile | Descrizione | Richiesta |
|-----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | Chiave API per il servizio Claude di Anthropic | Sì |

---

## Note legali

L'analisi generata da LexFlow è prodotta da intelligenza artificiale e ha scopo puramente orientativo. Non sostituisce la consulenza legale professionale. I documenti caricati non vengono salvati né trasmessi a terzi diversi dall'API Anthropic per l'elaborazione.
