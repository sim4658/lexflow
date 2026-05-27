import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-navy border-b border-navy-light sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link
            href="/analisi"
            className="bg-gold text-navy-dark font-semibold px-5 py-2 rounded-lg text-sm hover:bg-gold-light transition-colors duration-200"
          >
            Inizia ora
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <ScalesIcon className="w-10 h-10 text-gold" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Il tuo assistente AI<br />
            <span className="text-gold">per lo studio legale</span>
          </h1>
          <p className="text-lg md:text-xl text-navy-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Carica un contratto, un atto o qualsiasi documento legale e ricevi in
            pochi secondi un&apos;analisi professionale: riassunto, clausole critiche,
            domande da fare al cliente e azioni consigliate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analisi"
              className="bg-gold text-navy-dark font-semibold px-8 py-4 rounded-lg text-base hover:bg-gold-light transition-colors duration-200 shadow-lg"
            >
              Analizza un documento
            </Link>
            <a
              href="#come-funziona"
              className="border border-white/30 text-white font-medium px-8 py-4 rounded-lg text-base hover:bg-white/10 transition-colors duration-200"
            >
              Scopri come funziona
            </a>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="bg-navy-dark text-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-sm text-navy-200">
          {[
            "Specializzato nel diritto italiano",
            "Analisi in pochi secondi",
            "PDF e testo libero",
            "Nessun dato salvato",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-gold flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Come funziona</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              In tre semplici passi ottieni un&apos;analisi completa del tuo documento legale.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              icon={<UploadIcon className="w-6 h-6" />}
              title="Carica il documento"
              description="Trascina un PDF o incolla direttamente il testo del documento che vuoi analizzare."
            />
            <StepCard
              step="2"
              icon={<BrainIcon className="w-6 h-6" />}
              title="L'AI analizza"
              description="Il nostro motore AI, specializzato nel diritto italiano, elabora il contenuto in pochi secondi."
            />
            <StepCard
              step="3"
              icon={<DocumentCheckIcon className="w-6 h-6" />}
              title="Ricevi i risultati"
              description="Ottieni riassunto, clausole critiche, domande per il cliente e azioni legali consigliate."
            />
          </div>
        </div>
      </section>

      {/* Cosa ottieni */}
      <section className="py-24 px-6 bg-navy-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Cosa ottieni da ogni analisi</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Ogni documento viene analizzato secondo quattro dimensioni essenziali per la tua pratica legale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<SummaryIcon className="w-6 h-6 text-navy" />}
              title="Riassunto esecutivo"
              description="Una sintesi chiara e concisa del documento in 3-5 punti chiave, per capire subito di cosa si tratta."
              colorClass="bg-navy-50 border-navy-100"
            />
            <FeatureCard
              icon={<AlertIcon className="w-6 h-6 text-red-700" />}
              title="Clausole critiche"
              description="Identificazione delle clausole rischiose, ambigue o sfavorevoli che richiedono la tua attenzione."
              colorClass="bg-red-50 border-red-100"
            />
            <FeatureCard
              icon={<QuestionIcon className="w-6 h-6 text-amber-700" />}
              title="Domande al cliente"
              description="Un elenco di domande specifiche da porre al cliente per chiarire aspetti importanti del documento."
              colorClass="bg-amber-50 border-amber-100"
            />
            <FeatureCard
              icon={<ActionIcon className="w-6 h-6 text-green-700" />}
              title="Azioni consigliate"
              description="I prossimi passi legali raccomandati in base all&apos;analisi del documento e al contesto normativo italiano."
              colorClass="bg-green-50 border-green-100"
            />
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="py-24 px-6 bg-navy text-white text-center">
        <div className="max-w-2xl mx-auto">
          <ScalesIcon className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Pronto a risparmiare tempo?</h2>
          <p className="text-navy-200 mb-8 text-lg">
            Analizza il tuo primo documento ora. Nessuna registrazione richiesta.
          </p>
          <Link
            href="/analisi"
            className="inline-block bg-gold text-navy-dark font-semibold px-10 py-4 rounded-lg text-base hover:bg-gold-light transition-colors duration-200 shadow-lg"
          >
            Analizza un documento →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-navy-200 py-8 px-6 text-center text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ScalesIcon className="w-4 h-4 text-gold" />
            <span className="text-white font-semibold">LexFlow</span>
            <span>— Assistente AI per Studi Legali</span>
          </div>
          <p>© {new Date().getFullYear()} LexFlow. I documenti non vengono salvati.</p>
        </div>
      </footer>
    </div>
  );
}

/* ── Componenti interni ── */

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ScalesIcon className="w-6 h-6 text-gold" />
      <span className="text-white text-xl font-bold tracking-tight">
        Lex<span className="text-gold">Flow</span>
      </span>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-navy-50 border border-navy-100">
      <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white mb-4 relative">
        {icon}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold text-navy-dark text-xs font-bold flex items-center justify-center">
          {step}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  colorClass,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
}) {
  return (
    <div className={`p-6 rounded-xl border ${colorClass} flex gap-4`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1M6.16 6.16l.7.7M3 12h1m16 0h1M16.44 6.86l.7-.7M17.66 17.66l-.7-.7M6.34 17.66l-.7-.7M12 21v-1m-3.5-9A3.5 3.5 0 0112 7.5 3.5 3.5 0 0115.5 11c0 1.5-.76 2.8-1.9 3.56M10.4 14.56C9.26 13.8 8.5 12.5 8.5 11" />
    </svg>
  );
}

function DocumentCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
