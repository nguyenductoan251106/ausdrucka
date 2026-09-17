"use client";

import { useState, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { processImageUpload } from "../actions/ocrAction";
import { Task } from "@/types";
import { ChevronDown, ChevronUp, FileText, Upload, Sparkles } from "lucide-react";
import ExamChart from "@/components/ui/ExamChart";

export default function EditorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Try parsing taskData
  const taskDataParam = searchParams.get("taskData");
  const task: Task | null = useMemo(() => {
    if (!taskDataParam) return null;
    try {
      return JSON.parse(taskDataParam);
    } catch {
      return null;
    }
  }, [taskDataParam]);

  const level = task?.level || searchParams.get("level") || "B1";
  const topic = task?.topic || searchParams.get("topic") || "Schreibaufgabe";
  const examName = task?.exam_name || "Prüfung";
  const teilTitle = task?.teil_title || "Aufgabe";

  const [text, setText] = useState("");
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [text]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingOcr(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await processImageUpload(formData);
      if (result.success && result.text) {
        setText((prev) => (prev ? prev + "\n" + result.text : result.text));
      } else {
        alert("Fehler bei der Texterkennung: " + (result.error || "Unbekannter Fehler"));
      }
    } catch (error) {
      alert("Ein Fehler ist beim Hochladen aufgetreten.");
    } finally {
      setIsProcessingOcr(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Bitte gib einen Text ein oder lade ein Foto hoch.");
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      text,
      level,
      topic,
      examName,
      teilTitle,
      instructions: task?.instructions || "",
      requiredPoints: task?.required_points || [],
      materials: task?.materials,
      targetWordCount: task?.target_word_count || 100,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("current_submission", JSON.stringify(submissionData));
    router.push(`/feedback`);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-900 text-white">
              {examName}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {teilTitle} (Niveau {level})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {topic}
          </h1>
        </div>

        {task && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowTaskDetails(!showTaskDetails)}
            className="self-start sm:self-center text-xs font-medium"
          >
            {showTaskDetails ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Aufgabenstellung & Grafik ausblenden
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                Aufgabenstellung & Grafik einblenden
              </>
            )}
          </Button>
        )}
      </div>

      {/* Collapsible Task Overview */}
      {task && showTaskDetails && (
        <Card className="border-slate-200 bg-slate-50/70 space-y-4">
          <CardContent className="p-5 space-y-4 text-sm text-slate-800">
            {task.situation && (
              <div>
                <strong className="text-slate-900 block mb-1">Situation & Kontext:</strong>
                <p className="text-slate-700 leading-relaxed">{task.situation}</p>
              </div>
            )}

            {/* Interaktive Grafik */}
            {task.chart_data && (
              <div className="pt-1">
                <ExamChart chartData={task.chart_data} />
              </div>
            )}

            {task.materials && (
              <div className="p-3 bg-white rounded border border-blue-100 text-xs sm:text-sm whitespace-pre-wrap">
                <strong className="text-blue-900 block mb-1">Materialien / Lesetext & Hintergrund:</strong>
                <p className="text-slate-700">{task.materials}</p>
              </div>
            )}

            <div>
              <strong className="text-slate-900 block mb-1">Arbeitsanweisung:</strong>
              <p className="text-slate-700 leading-relaxed">{task.instructions}</p>
            </div>

            {task.required_points && task.required_points.length > 0 && (
              <div>
                <strong className="text-slate-900 block mb-1">Leitpunkte:</strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {task.required_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Editor & OCR upload */}
      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b">
            <Label htmlFor="editor" className="text-base font-semibold text-slate-900">
              Dein Text (im Browser schreiben oder Foto hochladen)
            </Label>
            
            <div className="flex items-center gap-3">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingOcr}
                className="text-xs font-medium"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {isProcessingOcr ? "Analysiere Handschrift..." : "Foto hochladen (OCR)"}
              </Button>
            </div>
          </div>

          <Textarea 
            id="editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Beginne hier mit deinem Text (z.B. Sehr geehrte Damen und Herren, / Hallo...). Achte auf Anrede, Textaufbau und Grußformel."
            className="min-h-[400px] text-base leading-relaxed resize-y p-4 font-sans focus-visible:ring-slate-400"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center">
                <FileText className="h-3.5 w-3.5 mr-1 text-slate-400" />
                Wortanzahl: <strong className={`ml-1 text-sm ${wordCount > 0 ? "text-slate-900" : "text-slate-500"}`}>{wordCount}</strong>
              </span>
              {task?.target_word_count && (
                <span>(Ziel: ~{task.target_word_count} Wörter)</span>
              )}
            </div>

            <span>
              Tipp: Überprüfe nach dem Foto-Upload kurz, ob die Erkennung alle Wörter erfasst hat.
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-2">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-600">
          Zurück
        </Button>
        <Button 
          size="lg" 
          onClick={handleSubmit} 
          disabled={isSubmitting || !text.trim()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center">
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Wird ausgewertet...
            </span>
          ) : (
            "Abgeben & Prüfen"
          )}
        </Button>
      </div>
    </div>
  );
}
