import { Suspense } from "react";
import { generateExamWritingTask } from "@/services/ai/tasks";
import { ExamId } from "@/types";
import { EXAM_CONFIGS } from "@/lib/examConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, FileText, Sparkles, BookOpen } from "lucide-react";
import ExamChart from "@/components/ui/ExamChart";

export default async function TaskPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; teil?: string; level?: string }>;
}) {
  const { exam: queryExam, teil: queryTeil, level: queryLevel } = await searchParams;

  const examId = (queryExam && queryExam in EXAM_CONFIGS 
    ? queryExam 
    : queryLevel === "A1" ? "goethe-a1"
    : queryLevel === "A2" ? "goethe-a2"
    : queryLevel === "B2" ? "goethe-b2"
    : queryLevel === "C1" ? "dsh"
    : "goethe-b1") as ExamId;

  const examConfig = EXAM_CONFIGS[examId];
  const teilId = queryTeil || examConfig.teile[0].id;
  const teilConfig = examConfig.teile.find(t => t.id === teilId) || examConfig.teile[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <Link 
            href={`/level?exam=${examId}`} 
            className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Zurück zu allen Teilen ({examConfig.name})
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-900 text-white">
              {examConfig.name}
            </span>
            <span className="text-sm font-semibold text-slate-700">
              {teilConfig.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <FileText className="h-4 w-4 mr-1.5 text-slate-400" />
            {teilConfig.wordCount}
          </span>
          <span className="inline-flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
            <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
            {teilConfig.timeLimit}
          </span>
        </div>
      </div>

      <Suspense fallback={<TaskSkeleton />}>
        <TaskContent examId={examId} teilId={teilId} />
      </Suspense>
    </div>
  );
}

async function TaskContent({ examId, teilId }: { examId: ExamId; teilId: string }) {
  const task = await generateExamWritingTask(examId, teilId);

  // Encode full task data to pass to editor
  const taskJsonString = JSON.stringify(task);

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b pb-5">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Thema der Aufgabe
            </span>
            <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              <Sparkles className="h-3 w-3 mr-1" />
              Offizielles Prüfungsformat
            </span>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            {task.topic}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6 text-slate-800">
          {/* Situation / Ausgangssituation */}
          {task.situation && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Situation & Kontext
              </h3>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-base leading-relaxed">
                {task.situation}
              </div>
            </div>
          )}

          {/* Interaktive Grafik wenn chart_data vorhanden ist */}
          {task.chart_data && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Statistische Grafik zum Thema
              </h3>
              <ExamChart chartData={task.chart_data} />
            </div>
          )}

          {/* Begleitende Materialien (Lesetext, Zitate etc.) */}
          {task.materials && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center">
                <BookOpen className="h-4 w-4 mr-1.5 text-blue-600" />
                Vorgegebene Materialien (Lesetext / Hintergrund)
              </h3>
              <div className="p-5 rounded-lg bg-blue-50/40 border border-blue-200 text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {task.materials}
              </div>
            </div>
          )}

          {/* Arbeitsanweisung */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Arbeitsanweisung
            </h3>
            <p className="text-base sm:text-lg leading-relaxed text-slate-900 font-medium">
              {task.instructions}
            </p>
          </div>

          {/* Leitpunkte */}
          {task.required_points && task.required_points.length > 0 && (
            <div className="p-5 rounded-lg bg-amber-50/40 border border-amber-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Gehe auf die folgenden Punkte ein:
              </h3>
              <ul className="space-y-2 text-slate-800">
                {task.required_points.map((point, i) => (
                  <li key={i} className="flex items-start text-sm sm:text-base">
                    <span className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2">
        <Link 
          href={`/write?taskData=${encodeURIComponent(taskJsonString)}`}
          className="w-full sm:w-auto"
        >
          <Button size="lg" className="w-full sm:w-auto px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold">
            Antwort schreiben
          </Button>
        </Link>
      </div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Skeleton className="h-11 w-44 rounded-md" />
      </div>
    </div>
  );
}
