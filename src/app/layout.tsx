import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LexFlow — Assistente AI per Studi Legali",
  description:
    "Analizza documenti legali con intelligenza artificiale. Riassunti, clausole critiche, domande al cliente e azioni consigliate in pochi secondi.",
  keywords: "avvocato, studio legale, analisi documenti, AI, intelligenza artificiale, diritto italiano",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} h-full`}>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ fontFamily: "var(--font-inter), Inter, system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
