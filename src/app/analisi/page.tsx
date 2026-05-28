"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const mdComponents: Components = {
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
};

const mdInlineComponents: Components = {
  ...mdComponents,
  p: ({ children }) => <span className="leading-relaxed">{children}</span>,
};

/* ── Tipi ── */

interface RisultatoAnalisi {
  riassunto: string;
  clausole: string[];
  domande: string[];
  azioni: string[];
}

type StatoPagina = "input" | "caricamento" | "risultati" | "errore";

/* ── Componente principale ── */

export default function PaginaAnalisi() {
  const [stato, setStato] = useState<StatoPagina>("input");
  const [testo, setTesto] = useState("");
  const [fileCaricato, setFileCaricato] = useState<File | null>(null);
  const [risultato, setRisultato] = useState<RisultatoAnalisi | null>(null);
  const [errore, setErrore] = useState("");
  const [modalitaInput, setModalitaInput] = useState<"file" | "testo">("file");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFileCaricato(acceptedFiles[0]);
      setErrore("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    onDropRejected: (rejections) => {
      const motivo = rejections[0]?.errors[0]?.code;
      if (motivo === "file-too-large") {
        setErrore("Il file è troppo grande. Dimensione massima: 10 MB.");
      } else if (motivo === "file-invalid-type") {
        setErrore("Formato non supportato. Carica solo file PDF.");
      } else {
        setErrore("File non accettato. Riprova con un PDF.");
      }
    },
  });

  const analizzaDocumento = async () => {
    // Validazione input
    if (modalitaInput === "file" && !fileCaricato) {
      setErrore("Carica un file PDF prima di procedere.");
      return;
    }
    if (modalitaInput === "testo" && testo.trim().length < 50) {
      setErrore("Inserisci almeno 50 caratteri di testo da analizzare.");
      return;
    }

    setStato("caricamento");
    setErrore("");

    try {
      const formData = new FormData();
      if (modalitaInput === "file" && fileCaricato) {
        formData.append("file", fileCaricato);
      } else {
        formData.append("testo", testo.trim());
      }

      const risposta = await fetch("/api/analizza", {
        method: "POST",
        body: formData,
      });

      const dati = await risposta.json();

      if (!risposta.ok || dati.errore) {
        setErrore(dati.errore || "Errore durante l'analisi. Riprova.");
        setStato("errore");
        return;
      }

      setRisultato(dati.analisi);
      setStato("risultati");
    } catch {
      setErrore("Errore di connessione. Controlla la rete e riprova.");
      setStato("errore");
    }
  };

  const ricomincia = () => {
    setStato("input");
    setRisultato(null);
    setErrore("");
    setFileCaricato(null);
    setTesto("");
  };

  return (
    <div className="min-h-screen bg-navy-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-navy border-b border-navy-light sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ScalesIcon className="w-6 h-6 text-gold" />
            <span className="text-white text-xl font-bold tracking-tight">
              Lex<span className="text-gold">Flow</span>
            </span>
          </Link>
          {stato === "risultati" && (
            <button
              onClick={ricomincia}
              className="text-navy-200 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Nuova analisi
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {stato === "input" && (
          <SezioneInput
            modalitaInput={modalitaInput}
            setModalitaInput={setModalitaInput}
            fileCaricato={fileCaricato}
            setFileCaricato={setFileCaricato}
            testo={testo}
            setTesto={setTesto}
            errore={errore}
            setErrore={setErrore}
            onAnalizza={analizzaDocumento}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
          />
        )}

        {stato === "caricamento" && <SezioneCaricamento />}

        {stato === "risultati" && risultato && (
          <SezioneRisultati risultato={risultato} onRicomincia={ricomincia} />
        )}

        {stato === "errore" && (
          <SezioneErrore messaggio={errore} onRicomincia={ricomincia} />
        )}
      </main>

      <footer className="bg-navy-dark text-navy-200 py-4 px-6 text-center text-xs">
        <p>I documenti caricati non vengono salvati. L&apos;analisi è generata da AI e non sostituisce la consulenza legale professionale.</p>
      </footer>
    </div>
  );
}

/* ── Sezione Input ── */

function SezioneInput({
  modalitaInput,
  setModalitaInput,
  fileCaricato,
  setFileCaricato,
  testo,
  setTesto,
  errore,
  setErrore,
  onAnalizza,
  getRootProps,
  getInputProps,
  isDragActive,
}: {
  modalitaInput: "file" | "testo";
  setModalitaInput: (m: "file" | "testo") => void;
  fileCaricato: File | null;
  setFileCaricato: (f: File | null) => void;
  testo: string;
  setTesto: (t: string) => void;
  errore: string;
  setErrore: (e: string) => void;
  onAnalizza: () => void;
  getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
  getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
  isDragActive: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Analizza un documento</h1>
        <p className="text-gray-600">
          Carica un PDF o incolla il testo del documento da analizzare
        </p>
      </div>

      {/* Toggle modalità input */}
      <div className="flex rounded-lg overflow-hidden border border-navy-100 bg-white w-fit mx-auto">
        <button
          onClick={() => { setModalitaInput("file"); setErrore(""); }}
          className={`px-6 py-2.5 text-sm font-medium transition-colors ${
            modalitaInput === "file"
              ? "bg-navy text-white"
              : "text-gray-600 hover:bg-navy-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <PdfIcon className="w-4 h-4" />
            Carica PDF
          </span>
        </button>
        <button
          onClick={() => { setModalitaInput("testo"); setErrore(""); }}
          className={`px-6 py-2.5 text-sm font-medium transition-colors ${
            modalitaInput === "testo"
              ? "bg-navy text-white"
              : "text-gray-600 hover:bg-navy-50"
          }`}
        >
          <span className="flex items-center gap-2">
            <TextIcon className="w-4 h-4" />
            Incolla testo
          </span>
        </button>
      </div>

      {/* Area upload PDF */}
      {modalitaInput === "file" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 bg-white ${
            isDragActive
              ? "border-navy bg-navy-50 scale-[1.01]"
              : fileCaricato
              ? "border-green-400 bg-green-50"
              : "border-navy-200 hover:border-navy hover:bg-navy-50"
          }`}
        >
          <input {...getInputProps()} />
          {fileCaricato ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{fileCaricato.name}</p>
                <p className="text-sm text-gray-500">
                  {(fileCaricato.size / 1024).toFixed(0)} KB — PDF caricato
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFileCaricato(null); }}
                className="text-xs text-red-600 hover:text-red-800 underline"
              >
                Rimuovi file
              </button>
            </div>
          ) : isDragActive ? (
            <div className="flex flex-col items-center gap-3">
              <UploadCloudIcon className="w-12 h-12 text-navy" />
              <p className="text-navy font-semibold">Rilascia il PDF qui</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <UploadCloudIcon className="w-12 h-12 text-navy-200" />
              <div>
                <p className="font-semibold text-gray-700">
                  Trascina il PDF qui, oppure{" "}
                  <span className="text-navy underline">sfoglia</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Solo file PDF • Max 10 MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Area testo */}
      {modalitaInput === "testo" && (
        <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
          <div className="px-4 py-2 border-b border-navy-100 bg-navy-50 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Testo del documento</span>
            {testo.length > 0 && (
              <span className="text-xs text-gray-400">{testo.length.toLocaleString()} caratteri</span>
            )}
          </div>
          <textarea
            value={testo}
            onChange={(e) => { setTesto(e.target.value); setErrore(""); }}
            placeholder="Incolla qui il testo del contratto, dell'atto, della procura o di qualsiasi documento legale da analizzare..."
            className="w-full h-64 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-0"
          />
        </div>
      )}

      {/* Messaggio errore */}
      {errore && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{errore}</p>
        </div>
      )}

      {/* Pulsante analizza */}
      <button
        onClick={onAnalizza}
        disabled={
          (modalitaInput === "file" && !fileCaricato) ||
          (modalitaInput === "testo" && testo.trim().length < 50)
        }
        className="w-full py-4 px-6 bg-navy text-white font-semibold rounded-xl text-base hover:bg-navy-light transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        <ScalesIcon className="w-5 h-5" />
        Analizza documento
      </button>

      <p className="text-center text-xs text-gray-400">
        L&apos;analisi richiede 10–30 secondi. I documenti non vengono salvati.
      </p>
    </div>
  );
}

/* ── Sezione Caricamento ── */

function SezioneCaricamento() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-8">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-navy-100 border-t-navy animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <ScalesIcon className="w-8 h-8 text-navy" />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-navy mb-2">Analisi in corso...</h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Il nostro assistente AI sta esaminando il documento. Questo richiede solitamente 10–30 secondi.
        </p>
      </div>
      <div className="flex gap-2">
        {["Lettura documento", "Identificazione clausole", "Redazione analisi"].map(
          (fase, i) => (
            <div
              key={fase}
              className="px-3 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy animate-pulse-slow"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              {fase}
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* ── Sezione Risultati ── */

function SezioneRisultati({
  risultato,
  onRicomincia,
}: {
  risultato: RisultatoAnalisi;
  onRicomincia: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-navy">Analisi completata</h1>
          <p className="text-gray-500 text-sm mt-1">Ecco i risultati dell&apos;analisi del documento</p>
        </div>
        <button
          onClick={onRicomincia}
          className="hidden sm:flex items-center gap-2 px-4 py-2 border border-navy-200 text-navy rounded-lg text-sm font-medium hover:bg-navy-50 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Nuova analisi
        </button>
      </div>

      {/* Card 1: Riassunto */}
      <CardAnalisi
        titolo="Riassunto esecutivo"
        colore="blu"
        icona={<SummaryIcon className="w-5 h-5 text-navy" />}
      >
        <div className="text-gray-700 text-sm">
          <ReactMarkdown components={mdComponents}>{risultato.riassunto || "Nessun riassunto disponibile."}</ReactMarkdown>
        </div>
      </CardAnalisi>

      {/* Card 2: Clausole critiche */}
      <CardAnalisi
        titolo="Clausole critiche o rischiose"
        colore="rosso"
        icona={<AlertIcon className="w-5 h-5 text-red-600" />}
        badge={risultato.clausole.length > 0 ? `${risultato.clausole.length} trovate` : undefined}
        badgeColore="rosso"
      >
        {risultato.clausole.length > 0 ? (
          <ul className="space-y-3">
            {risultato.clausole.map((clausola, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  !
                </span>
                <span className="text-gray-700"><ReactMarkdown components={mdInlineComponents}>{clausola}</ReactMarkdown></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nessuna clausola critica identificata.</p>
        )}
      </CardAnalisi>

      {/* Card 3: Domande al cliente */}
      <CardAnalisi
        titolo="Domande da fare al cliente"
        colore="ambra"
        icona={<QuestionIcon className="w-5 h-5 text-amber-600" />}
        badge={risultato.domande.length > 0 ? `${risultato.domande.length} domande` : undefined}
        badgeColore="ambra"
      >
        {risultato.domande.length > 0 ? (
          <ul className="space-y-3">
            {risultato.domande.map((domanda, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700"><ReactMarkdown components={mdInlineComponents}>{domanda}</ReactMarkdown></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nessuna domanda specifica identificata.</p>
        )}
      </CardAnalisi>

      {/* Card 4: Azioni legali */}
      <CardAnalisi
        titolo="Azioni legali consigliate"
        colore="verde"
        icona={<ActionIcon className="w-5 h-5 text-green-600" />}
      >
        {risultato.azioni.length > 0 ? (
          <ul className="space-y-3">
            {risultato.azioni.map((azione, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-0.5">
                  →
                </span>
                <span className="text-gray-700"><ReactMarkdown components={mdInlineComponents}>{azione}</ReactMarkdown></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Nessuna azione specifica consigliata.</p>
        )}
      </CardAnalisi>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-700">Nota:</strong> Questa analisi è generata da intelligenza artificiale e ha scopo
        puramente orientativo. Non sostituisce la consulenza legale professionale. Verifica sempre i contenuti prima di
        agire.
      </div>

      {/* CTA ricomincia (mobile) */}
      <button
        onClick={onRicomincia}
        className="sm:hidden w-full py-3 px-6 border border-navy text-navy font-semibold rounded-xl hover:bg-navy-50 transition-colors"
      >
        Analizza un altro documento
      </button>
    </div>
  );
}

/* ── Sezione Errore ── */

function SezioneErrore({
  messaggio,
  onRicomincia,
}: {
  messaggio: string;
  onRicomincia: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircleIcon className="w-10 h-10 text-red-500" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analisi non riuscita</h2>
        <p className="text-gray-600 max-w-sm">{messaggio}</p>
      </div>
      <button
        onClick={onRicomincia}
        className="px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
      >
        Riprova
      </button>
    </div>
  );
}

/* ── Componente Card Analisi ── */

function CardAnalisi({
  titolo,
  colore,
  icona,
  badge,
  badgeColore,
  children,
}: {
  titolo: string;
  colore: "blu" | "rosso" | "ambra" | "verde";
  icona: React.ReactNode;
  badge?: string;
  badgeColore?: "rosso" | "ambra" | "verde";
  children: React.ReactNode;
}) {
  const coloriHeader: Record<string, string> = {
    blu: "bg-navy-50 border-navy-100",
    rosso: "bg-red-50 border-red-100",
    ambra: "bg-amber-50 border-amber-100",
    verde: "bg-green-50 border-green-100",
  };

  const coloriBadge: Record<string, string> = {
    rosso: "bg-red-100 text-red-700",
    ambra: "bg-amber-100 text-amber-700",
    verde: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className={`px-5 py-4 border-b flex items-center gap-3 ${coloriHeader[colore]}`}>
        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
          {icona}
        </div>
        <h2 className="font-semibold text-gray-900 flex-1">{titolo}</h2>
        {badge && badgeColore && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${coloriBadge[badgeColore]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── Icone SVG ── */

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 0l-3 9m3-9l3 9M6 12l-3 6h6l-3-6zM18 12l-3 6h6l-3-6zM12 4H4m8 0h8M12 21v-3m0 0H8m4 0h4" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function TextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  );
}

function UploadCloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.045 11.095" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function QuestionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}

function ActionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function SummaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
