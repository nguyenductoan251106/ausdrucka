import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-3 text-slate-900">
        Ausdrucka
      </h1>

      <p className="text-lg sm:text-xl font-medium text-slate-500 mb-6 tracking-wide">
        Richtig? Natürlich.
      </p>

      <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
        Gezieltes Schreibtraining für deine Deutschprüfung – mit sofortiger Fehleranalyse und Musterlösung.
      </p>
      
      <Link href="/level">
        <Button size="lg" className="font-semibold text-base sm:text-lg px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-sm transition-all hover:shadow-md">
          Übung beginnen
        </Button>
      </Link>
    </div>
  );
}
