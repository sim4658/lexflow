import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODELLO = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `Sei un assistente legale esperto specializzato nel diritto italiano.
Analizza documenti legali con precisione, chiarezza e professionalità.
Rispondi sempre in italiano.
Fornisci analisi strutturate, concrete e azionabili per avvocati professionisti.`;

const buildUserPrompt = (testo: string) => `Analizza il seguente documento legale e fornisci un'analisi strutturata con esattamente queste quattro sezioni. Usa il formato indicato senza deviazioni:

## 1. RIASSUNTO ESECUTIVO
(3-5 frasi che sintetizzano il contenuto, la natura e lo scopo del documento)

## 2. CLAUSOLE CRITICHE O RISCHIOSE
(Elenca le clausole problematiche, una per riga, iniziando con "- ". Per ogni clausola spiega brevemente il rischio)

## 3. DOMANDE DA FARE AL CLIENTE
(Almeno 3 domande specifiche, una per riga, iniziando con "- ")

## 4. AZIONI LEGALI CONSIGLIATE
(I prossimi passi concreti, uno per riga, iniziando con "- ". Indica priorità e urgenza quando rilevante)

---
DOCUMENTO DA ANALIZZARE:
${testo}`;

export async function POST(request: NextRequest) {
  try {
    // Verifica che la chiave API sia configurata
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { errore: "Chiave API Anthropic non configurata. Controlla il file .env.local." },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let testoDocumento = "";
    let isPdf = false;
    let pdfBase64 = "";

    if (contentType.includes("multipart/form-data")) {
      // Gestione upload file o testo via FormData
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const testo = formData.get("testo") as string | null;

      if (file && file.type === "application/pdf") {
        // Documento PDF: lo inviamo direttamente ad Anthropic
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binaryString = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binaryString += String.fromCharCode(uint8Array[i]);
        }
        pdfBase64 = btoa(binaryString);
        isPdf = true;
      } else if (testo && testo.trim().length > 0) {
        testoDocumento = testo.trim();
      } else {
        return Response.json(
          { errore: "Nessun documento fornito. Carica un PDF o incolla del testo." },
          { status: 400 }
        );
      }
    } else {
      return Response.json(
        { errore: "Formato richiesta non valido." },
        { status: 400 }
      );
    }

    // Verifica lunghezza minima del testo
    if (!isPdf && testoDocumento.length < 50) {
      return Response.json(
        { errore: "Il documento è troppo breve per essere analizzato. Inserisci almeno 50 caratteri." },
        { status: 400 }
      );
    }

    // Chiamata all'API Anthropic
    let risposta: Awaited<ReturnType<typeof client.messages.create>>;

    if (isPdf) {
      // Analisi PDF nativa via Anthropic (supporto documenti)
      risposta = await client.messages.create({
        model: MODELLO,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: pdfBase64,
                },
              },
              {
                type: "text",
                text: buildUserPrompt("[vedi il documento PDF allegato]").replace(
                  "DOCUMENTO DA ANALIZZARE:\n[vedi il documento PDF allegato]",
                  "Analizza il documento PDF allegato seguendo le istruzioni sopra."
                ),
              },
            ],
          },
        ],
      });
    } else {
      // Analisi testo semplice
      risposta = await client.messages.create({
        model: MODELLO,
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildUserPrompt(testoDocumento),
          },
        ],
      });
    }

    const testoRisposta =
      risposta.content[0].type === "text" ? risposta.content[0].text : "";

    console.log("=== RISPOSTA GREZZA API ===\n", testoRisposta, "\n=== FINE RISPOSTA ===");

    // Parsing delle sezioni dalla risposta
    const sezioni = parseRisposta(testoRisposta);

    return Response.json({
      successo: true,
      analisi: sezioni,
      testoCompleto: testoRisposta,
    });
  } catch (err) {
    console.error("Errore analisi:", err);

    const messaggio =
      err instanceof Error ? err.message : "Errore sconosciuto durante l'analisi.";

    // Messaggi di errore user-friendly
    let erroreUtente = "Si è verificato un errore durante l'analisi del documento.";
    if (messaggio.includes("API key")) {
      erroreUtente = "Chiave API non valida. Controlla la configurazione.";
    } else if (messaggio.includes("rate_limit") || messaggio.includes("429")) {
      erroreUtente = "Troppe richieste. Attendi qualche secondo e riprova.";
    } else if (messaggio.includes("overloaded") || messaggio.includes("529")) {
      erroreUtente = "Il servizio AI è momentaneamente sovraccarico. Riprova tra poco.";
    } else if (messaggio.includes("too large") || messaggio.includes("too long")) {
      erroreUtente = "Il documento è troppo lungo. Prova con un documento più breve o incollane solo la parte rilevante.";
    }

    return Response.json({ errore: erroreUtente }, { status: 500 });
  }
}

function parseRisposta(testo: string): {
  riassunto: string;
  clausole: string[];
  domande: string[];
  azioni: string[];
} {
  const estraiSezione = (inizioPattern: RegExp, finePattern: RegExp): string => {
    const match = testo.match(inizioPattern);
    if (!match || match.index === undefined) return "";
    const inizio = match.index + match[0].length;
    const fineMatch = testo.slice(inizio).match(finePattern);
    const fine = fineMatch ? inizio + (fineMatch.index ?? 0) : testo.length;
    return testo.slice(inizio, fine).trim();
  };

  const estraiElenco = (testo: string): string[] => {
    if (!testo) return [];
    return testo
      .split("\n")
      .map((r) => r.replace(/^[-*•]\s*/, "").trim())
      .filter((r) => r.length > 0);
  };

  const riassuntoTesto = estraiSezione(
    /##\s*1\.\s*RIASSUNTO ESECUTIVO/i,
    /##\s*2\./i
  );

  const clausoleTesto = estraiSezione(
    /##\s*2\.\s*CLAUSOLE CRITICHE/i,
    /##\s*3\./i
  );

  const domandeTesto = estraiSezione(
    /##\s*3\.\s*DOMANDE DA FARE/i,
    /##\s*4\./i
  );

  const azioniTesto = estraiSezione(
    /##\s*4\.\s*AZIONI LEGALI/i,
    /---/
  );

  return {
    riassunto: riassuntoTesto,
    clausole: estraiElenco(clausoleTesto),
    domande: estraiElenco(domandeTesto),
    azioni: estraiElenco(azioniTesto),
  };
}
