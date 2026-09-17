"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackData } from "@/types";
import { processFeedback } from "../actions/feedbackAction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Award, BookCheck, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface SubmissionStorageData {
  text: string;
  level: string;
  topic: string;
  examName?: string;
  teilTitle?: string;
  instructions?: string;
  requiredPoints?: string[];
  materials?: string;
  targetWordCount?: number;
}

export default function FeedbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [submissionInfo, setSubmissionInfo] = useState<SubmissionStorageData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [modelAnswer, setModelAnswer] = useState<string | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("current_submission");
    if (!data) {
      router.push("/level");
      return;
    }

    try {
      const parsed: SubmissionStorageData = JSON.parse(data);
      setSubmissionInfo(parsed);

      processFeedback(parsed)
        .then((res) => {
          if (res.success && res.feedback) {
            setFeedback(res.feedback);
            setModelAnswer(res.modelAnswer || null);
          } else {
            setError(res.error || "Ein unbekannter Fehler ist aufgetreten.");
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } catch (e: any) {
      setError("Fehler beim Lesen der Eingabedaten.");
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-slate-100 rounded-full text-slate-800">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Analysiere deinen Text...</h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Die KI überprüft deinen Text nach den offiziellen Prüfungskriterien und erstellt eine passgenaue Musterlösung.
          </p>
        </div>
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Fehler bei der Auswertung</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/level")} className="mt-6">
          Zurück zur Prüfungsübersicht
        </Button>
      </div>
    );
  }

  const dsh = feedback.dsh_breakdown;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-16 space-y-8">
      {/* Header */}
      <div className="border-b pb-5">
        <Link 
          href="/level" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Zur Prüfungsübersicht
        </Link>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
            {submissionInfo?.examName || "Offizielle Prüfung"}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {submissionInfo?.teilTitle || "Schreiben"} (GER {submissionInfo?.level})
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Prüfungsauswertung & Feedback
        </h1>
        <p className="text-slate-600">
          Thema: <strong>{submissionInfo?.topic}</strong>
        </p>
      </div>

      {/* DSH Specific Score Sheet if DSH Exam */}
      {dsh && (
        <Card className="border-blue-200 bg-blue-50/20 shadow-sm overflow-hidden">
          <CardHeader className="bg-blue-50/80 border-b border-blue-100 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Award className="h-6 w-6 text-blue-700" />
                <CardTitle className="text-xl font-bold text-blue-950">
                  Offizielle DSH-Bewertung (100 Punkte)
                </CardTitle>
              </div>
              <div className="px-3.5 py-1 rounded-full text-sm font-bold bg-blue-700 text-white self-start sm:self-auto">
                {dsh.dsh_stufe}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Inhalt und Textaufbau</div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Bearbeitung der Aufgabenstellung:</span>
                  <strong className="text-slate-950">{dsh.inhalt_aufgabenbewaeltigung} / 22 P.</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Textaufbau / Kohärenz:</span>
                  <strong className="text-slate-950">{dsh.textaufbau_kohaerenz} / 12 P.</strong>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Sprachliche Aspekte</div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Formale Richtigkeit:</span>
                  <strong className="text-slate-950">{dsh.formale_richtigkeit} / 30 P.</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Ausdrucksvermögen:</span>
                  <strong className="text-slate-950">{dsh.ausdrucksvermoegen} / 20 P.</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Kohäsion (Verknüpfungen):</span>
                  <strong className="text-slate-950">{dsh.kohaesion} / 12 P.</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700">Orthographie / Interpunktion:</span>
                  <strong className="text-slate-950">{dsh.orthographie} / 4 P.</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between font-semibold text-base">
              <span>Gesamtpunktzahl DSH:</span>
              <span className="text-xl font-bold">{dsh.gesamt_punkte} / 100 Punkte ({dsh.dsh_stufe})</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall assessment & level */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold text-slate-900">
            Gesamtbewertung
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="text-slate-800 text-base leading-relaxed">
            {feedback.overall_assessment}
          </p>

          {feedback.exam_specific_feedback && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Prüferhinweis:</strong>
              {feedback.exam_specific_feedback}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Erkanntes Sprachniveau</span>
              <strong className="text-lg text-slate-900">{feedback.detected_level}</strong>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Aufgabenerfüllung</span>
              <strong className="text-lg text-slate-900">{feedback.task_fulfillment_score} / 10 Punkte</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-emerald-200 bg-white shadow-sm">
          <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 py-3.5">
            <CardTitle className="text-emerald-900 text-base font-bold flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
              Stärken
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <ul className="space-y-2 text-sm text-slate-700">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 mr-2.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-white shadow-sm">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100 py-3.5">
            <CardTitle className="text-amber-900 text-base font-bold flex items-center">
              <BookCheck className="h-4 w-4 mr-2 text-amber-600" />
              Verbesserungsbereiche
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <ul className="space-y-2 text-sm text-slate-700">
              {feedback.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 mr-2.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Fehleranalyse */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Detaillierte Fehleranalyse ({feedback.errors.length})
          </h2>
          <span className="text-xs text-slate-500">
            Kategorisiert nach Grammatik, Wortschatz, Satzbau, etc.
          </span>
        </div>

        {feedback.errors.length === 0 ? (
          <Card className="border-slate-200 bg-white p-6 text-center text-slate-600">
            Keine gravierenden Fehler gefunden! Dein Text erfüllt die formalen Anforderungen vorbildlich.
          </Card>
        ) : (
          <div className="space-y-3.5">
            {feedback.errors.map((err, i) => (
              <Card key={i} className="border-slate-200 bg-white shadow-sm overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-200">
                      {err.category}
                    </span>
                    <span className={`text-xs uppercase font-bold tracking-wider ${
                      err.severity === 'critical' ? 'text-red-600' : 
                      err.severity === 'major' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {err.severity === 'critical' ? 'Schwerer Fehler' : err.severity === 'major' ? 'Wichtiger Fehler' : 'Leichter Fehler'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-red-50/80 border border-red-200 p-2.5 rounded text-red-800 text-sm font-medium line-through">
                      {err.original}
                    </div>
                    <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded text-emerald-900 font-semibold text-sm">
                      {err.correction}
                    </div>
                    <p className="text-sm text-slate-700 pt-1 leading-relaxed">
                      {err.explanation}
                    </p>
                    {err.natural_alternative && (
                      <div className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100 mt-1">
                        <strong>Natürlichere Alternative:</strong> {err.natural_alternative}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Model Answer (Musterlösung) */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Offizielle Musterlösung (Niveau {submissionInfo?.level})
          </h2>
          <span className="text-xs text-slate-500">
            Angepasst an die gewählte Prüfung
          </span>
        </div>

        <Card className="border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6 sm:p-8 whitespace-pre-wrap text-slate-800 text-base leading-relaxed bg-slate-50/50">
            {modelAnswer || "Keine Musterlösung generiert."}
          </CardContent>
        </Card>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Link href="/level">
          <Button size="lg" className="w-full sm:w-auto px-8 bg-slate-900 hover:bg-slate-800 text-white font-medium">
            Neue Prüfung / Teil wählen
          </Button>
        </Link>
      </div>
    </div>
  );
}
