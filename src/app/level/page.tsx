import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EXAM_CONFIGS, EXAM_LIST } from "@/lib/examConfig";
import { ExamId } from "@/types";
import { ArrowRight, ArrowLeft, Clock, FileText, CheckCircle2 } from "lucide-react";

export default async function LevelSelection({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const { exam: selectedExamId } = await searchParams;

  const activeExam = selectedExamId && (selectedExamId in EXAM_CONFIGS)
    ? EXAM_CONFIGS[selectedExamId as ExamId]
    : null;

  if (activeExam) {
    // Show Teile selection for the chosen exam
    return (
      <div className="max-w-4xl mx-auto px-4 py-4 space-y-8">
        <div>
          <Link 
            href="/level" 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Zurück zur Prüfungsübersicht
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
              {activeExam.name}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Niveau {activeExam.cefrLevel}
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            {activeExam.fullName}
          </h1>
          <p className="text-slate-600 max-w-2xl">
            {activeExam.description} Wähle den gewünschten Prüfungsteil, um eine offizielle Aufgabenstellung zu generieren.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {activeExam.teile.map((teil) => (
            <Card 
              key={teil.id}
              className="border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 bg-white overflow-hidden"
            >
              <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-semibold text-slate-900 text-lg sm:text-xl">
                      {teil.title}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 border border-slate-200">
                      {teil.subtitle}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {teil.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 pt-1">
                    <span className="inline-flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      Umfang: <strong className="ml-1 text-slate-700">{teil.wordCount}</strong>
                    </span>
                    <span className="inline-flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      Zeit: <strong className="ml-1 text-slate-700">{teil.timeLimit}</strong>
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-700 mb-1">Offizielle Bewertungskriterien:</div>
                    <div className="flex flex-wrap gap-2">
                      {teil.officialCriteria.map((crit, idx) => (
                        <span key={idx} className="inline-flex items-center text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-slate-400" />
                          {crit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:self-center shrink-0">
                  <Link href={`/task?exam=${activeExam.id}&teil=${teil.id}`}>
                    <Button 
                      size="lg"
                      className="w-full md:w-auto font-medium text-sm px-6 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <span>Teil starten</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show all 6 exams: Goethe A1, Goethe A2, Goethe B1, Goethe B2, TestDaF, DSH
  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Wähle deine Prüfung
        </h1>
        <p className="text-slate-600 text-base">
          Trainiere gezielt nach den offiziellen Aufgabenformaten und Bewertungskriterien der anerkannten deutschen Sprachzertifikate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAM_LIST.map((exam) => (
          <Card 
            key={exam.id} 
            className="flex flex-col justify-between border-slate-200 hover:border-slate-400 hover:shadow-md transition-all duration-200 bg-white"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-slate-100 text-slate-800 border border-slate-200">
                  {exam.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {exam.teile.length} {exam.teile.length === 1 ? "Prüfungsteil" : "Prüfungsteile"}
                </span>
              </div>

              <CardTitle className="text-xl font-bold text-slate-900">
                {exam.name}
              </CardTitle>
              
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider min-h-[1.2rem]">
                GER {exam.cefrLevel}
              </div>

              <CardDescription className="text-sm text-slate-600 leading-relaxed pt-1 min-h-[3.5rem]">
                {exam.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2">
              <Link href={`/level?exam=${exam.id}`} className="block">
                <Button 
                  className="w-full justify-between font-medium group text-slate-900 bg-slate-50 border-slate-300 hover:bg-slate-900 hover:text-white transition-colors" 
                  variant="outline"
                >
                  <span>Teile wählen</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
