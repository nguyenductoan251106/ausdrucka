import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ausdrucka – Richtig? Natürlich.",
  description: "KI-gestütztes Schreibtraining für offizielle Deutschprüfungen (Goethe, TestDaF, DSH)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900`}>
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex flex-col group">
              <span className="font-black text-2xl tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                Ausdrucka
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wider -mt-1">
                Richtig? Natürlich.
              </span>
            </Link>
          </div>
        </header>
        <main className="container mx-auto py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
