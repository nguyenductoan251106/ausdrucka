import { GoogleGenAI, Type, Schema } from '@google/genai';
import { FeedbackData } from '@/types';
import { EXAM_CONFIGS } from '@/lib/examConfig';

const ai = new GoogleGenAI({});

const feedbackSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overall_assessment: { type: Type.STRING },
    detected_level: { type: Type.STRING },
    exam_specific_feedback: { 
      type: Type.STRING, 
      description: "Prüfungsspezifische Rückmeldung bezüglich der offiziellen Bewertungskriterien (z.B. Goethe, TestDaF oder DSH)" 
    },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    errors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { 
            type: Type.STRING, 
            enum: ['Grammatik', 'Wortschatz', 'Satzbau', 'Rechtschreibung', 'Ausdruck', 'Textstruktur', 'Aufgabenbezug'] 
          },
          severity: { type: Type.STRING, enum: ['minor', 'major', 'critical'] },
          original: { type: Type.STRING },
          correction: { type: Type.STRING },
          explanation: { type: Type.STRING },
          natural_alternative: { type: Type.STRING }
        },
        required: ['category', 'severity', 'original', 'correction', 'explanation']
      }
    },
    task_fulfillment_score: { type: Type.INTEGER, description: "Allgemeine Bewertung der Aufgabenerfüllung von 1 bis 10" },
    model_answer: { 
      type: Type.STRING, 
      description: 'Eine vorbildliche Musterlösung, die exakt den Anforderungen und dem Niveau der gewählten Prüfung und des Prüfungsteils entspricht.' 
    },
    dsh_breakdown: {
      type: Type.OBJECT,
      description: "Wird für die DSH-Prüfung ausgefüllt (Bewertung nach offiziellem DSH-Kriterienkatalog mit 100 Punkten)",
      properties: {
        inhalt_aufgabenbewaeltigung: { type: Type.INTEGER, description: "max. 22 Punkte" },
        textaufbau_kohaerenz: { type: Type.INTEGER, description: "max. 12 Punkte" },
        formale_richtigkeit: { type: Type.INTEGER, description: "max. 30 Punkte" },
        orthographie: { type: Type.INTEGER, description: "max. 4 Punkte" },
        ausdrucksvermoegen: { type: Type.INTEGER, description: "max. 20 Punkte" },
        kohaesion: { type: Type.INTEGER, description: "max. 12 Punkte" },
        gesamt_punkte: { type: Type.INTEGER, description: "Gesamtpunktzahl von max. 100 Punkten" },
        dsh_stufe: { type: Type.STRING, description: "DSH 3 (82-100 P.), DSH 2 (67-81 P.), DSH 1 (57-66 P.) oder Nicht bestanden (<57 P.)" }
      }
    }
  },
  required: ['overall_assessment', 'detected_level', 'strengths', 'weaknesses', 'errors', 'task_fulfillment_score', 'model_answer']
};

const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash'];

export async function analyzeExamSubmission(
  text: string, 
  examName: string,
  teilTitle: string,
  targetLevel: string, 
  topic: string,
  taskInstructions: string,
  requiredPoints: string[],
  materials?: string
): Promise<FeedbackData> {
  const isDsh = examName.toLowerCase().includes("dsh");
  const isTestDaF = examName.toLowerCase().includes("testdaf");

  const prompt = `
Du bist ein hochqualifizierter Deutschprüfer und beurteilst eine Textproduktion für die offizielle Prüfung:
- Prüfung: ${examName}
- Prüfungsteil: ${teilTitle}
- Zielniveau: ${targetLevel}
- Thema: ${topic}
- Aufgabenstellung: ${taskInstructions}
- Leitpunkte / Kriterien: ${requiredPoints.join(" | ")}
${materials ? `- Vorgegebene Materialien (Lesetext, Grafik, Zitate): ${materials}` : ""}

Eingereichter Text des Teilnehmers:
"""
${text}
"""

Deine Aufgaben bei der Bewertung:
1. Gründliche Fehleranalyse mit Korrekturvorschlägen in folgenden Kategorien:
   - Grammatik
   - Wortschatz
   - Satzbau
   - Rechtschreibung & Zeichensetzung
   - Ausdruck (Register und Angemessenheit)
   - Textstruktur & Kohärenz
   - Aufgabenbezug (Sind alle Leitpunkte/Vorgaben erfüllt?)

2. Prüfungsspezifische Rückmeldung:
   ${isDsh ? `
   - WICHTIG: Erstelle eine genaue Punkteaufschlüsselung nach dem offiziellen DSH-Bewertungsraster (insgesamt 100 Punkte):
     * Inhalt & Aufgabenstellung: Nennung des Themas, Einleitung, vollständige Argumentation, fundierte Stellungnahme (max. 22 Punkte)
     * Textaufbau & Kohärenz: logische Gedankenführung, 'roter Faden', sinnvolle Überleitungen (max. 12 Punkte)
     * Formale Richtigkeit: Morphologie, Syntax, Rektion, Tempus, Kongruenz (max. 30 Punkte)
     * Orthographie & Interpunktion: korrekte Rechtschreibung und Kommasetzung (max. 4 Punkte)
     * Ausdrucksvermögen: treffender wissenschaftssprachlicher Wortschatz und Redemittel (max. 20 Punkte)
     * Kohäsion: logische Verknüpfungen, Konnektoren, Proformen (max. 12 Punkte)
     * Ermittle die DSH-Stufe: DSH 3 (82-100 P.), DSH 2 (67-81 P.), DSH 1 (57-66 P.), Nicht bestanden (<57 P.)
   ` : isTestDaF ? `
   - Bewerte nach TestDaF-Kriterien: Gesamterfüllung, argumentative Kohärenz, wissenschaftssprachliche Angemessenheit, eigenständige Formulierung (ohne wörtliches Abschreiben). Gib eine Schätzung des TestDaF-Niveaus (TDN 3, TDN 4 oder TDN 5).
   ` : `
   - Bewerte nach den offiziellen Goethe-Kriterien für ${examName} (Aufgabenbewältigung aller Leitpunkte, Kohärenz, Wortschatz und grammatische Strukturen).
   `}

3. Erstelle eine perfekte, vollständige Musterlösung (model_answer):
   - Sie muss EXAKT der Aufgabenstellung und dem Zielniveau (${targetLevel}) dieser Prüfung entsprechen.
   - Weder unterfordern noch mit unpassend schweren Strukturen überfordern.

Gib die Antwort ausschließlich im vorgegebenen JSON-Format aus.
`;

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: feedbackSchema,
          temperature: 0.3,
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as FeedbackData;
      }
    } catch (error) {
      console.warn(`Model ${model} error during exam analysis:`, error);
      lastError = error;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  throw lastError || new Error("Prüfungsanalyse konnte nicht durchgeführt werden.");
}
