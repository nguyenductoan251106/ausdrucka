import { GoogleGenAI, Type, Schema } from '@google/genai';
import { FeedbackData } from '@/types';

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
    goethe_breakdown: {
      type: Type.OBJECT,
      description: "Wird für Goethe A1, A2, B1, B2 ausgefüllt nach dem offiziellen Goethe-Punkte- und Kriterienraster",
      properties: {
        teil_punkte_erreicht: { type: Type.INTEGER },
        teil_punkte_maximal: { type: Type.INTEGER },
        aufgabenbewaeltigung: { type: Type.INTEGER, description: "Punkte für Aufgabenbewältigung aller Leitpunkte" },
        kohaerenz: { type: Type.INTEGER, description: "Punkte für Kohärenz & Textverknüpfung" },
        wortschatz: { type: Type.INTEGER, description: "Punkte für Wortschatzspektrum & Angemessenheit" },
        strukturen: { type: Type.INTEGER, description: "Punkte für grammatische Strukturen & Korrektheit" },
        bestehen_status: { type: Type.STRING, description: "z.B. 'Bestanden (≥ 60%)' oder 'Nicht bestanden (< 60%)'" }
      }
    },
    testdaf_breakdown: {
      type: Type.OBJECT,
      description: "Wird für den Digitalen TestDaF ausgefüllt (Einstufung nach TDN 3, 4, 5)",
      properties: {
        tdn_stufe: { type: Type.STRING, description: "TDN 5 (Spitzenniveau), TDN 4 (Hochschulzugang), TDN 3 (Teilweise ausreichend) oder Unter TDN 3" },
        aufgabenbewaeltigung: { type: Type.STRING, description: "Bewertung der Vollständigkeit und Argumentation" },
        argumentation_synthese: { type: Type.STRING, description: "Bewertung der Text- und Grafiksynthese bzw. Pro/Contra-Argumentation" },
        wissenschaftssprache: { type: Type.STRING, description: "Bewertung des akademischen Stils und Sprachgebrauchs" }
      }
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
  const isGoethe = examName.toLowerCase().includes("goethe");

  const prompt = `
Du bist ein zertifizierter Prüfer für offizielle Deutschprüfungen (Goethe-Institut, TestDaF-Institut, DSH-Kommission).
Bewerte die folgende Textproduktion streng nach den offiziellen Prüfungsrichtlinien und Bewertungsrastern (Barem điểm):
- Prüfung: ${examName}
- Prüfungsteil: ${teilTitle}
- Zielniveau: ${targetLevel}
- Thema: ${topic}
- Aufgabenstellung: ${taskInstructions}
- Leitpunkte / Kriterien: ${requiredPoints.join(" | ")}
${materials ? `- Vorgegebene Materialien: ${materials}` : ""}

Eingereichter Teilnehmertext:
"""
${text}
"""

Offizielle Bewertungsmaßstäbe je nach Prüfung:
${isDsh ? `
1. DSH-Prüfungsraster (100 Punkte nach DSH-Rahmenordnung):
   - Inhalt & Aufgabenstellung: max. 22 Punkte (Einleitung 2 P., Argumentation 16 P., Stellungnahme 4 P.)
   - Textaufbau & Kohärenz: max. 12 Punkte (Gedankenführung, roter Faden; Abzug -3 P. falls unter 200 Wörtern)
   - Formale Richtigkeit: max. 30 Punkte (Morphologie, Syntax, Rektion, Tempus, Kongruenz)
   - Orthographie / Interpunktion: max. 4 Punkte
   - Ausdrucksvermögen: max. 20 Punkte (differenzierter Wortschatz, treffende Redemittel)
   - Kohäsion: max. 12 Punkte (Verknüpfungen, Konnektoren)
   - Gesamtpunktzahl (max. 100 P.) & DSH-Stufe ermitteln:
     * DSH 3: 82–100 Punkte (≥ 82%)
     * DSH 2: 67–81 Punkte (≥ 67%)
     * DSH 1: 57–66 Punkte (≥ 57%)
     * Nicht bestanden: < 57 Punkte
   Trage diese Werte vollständig in "dsh_breakdown" ein.
` : isTestDaF ? `
1. Digitaler TestDaF Bewertungsmaßstab (TDN 3, 4, 5):
   - TDN 5: Spitzenniveau, hervorragende Argumentation bzw. Text-/Grafiksynthese, hochkompetente Wissenschaftssprache.
   - TDN 4: Erfüllt alle Kriterien für den uneingeschränkten Hochschulzugang, klare Begründungen, gute wissenschaftssprachliche Strukturen.
   - TDN 3: Grundlegende Anforderungen erfüllt, jedoch sprachliche oder argumentative Lücken.
   - Unter TDN 3: Nicht ausreichend für das Hochschulstudium.
   Trage diese Einstufung und Bewertungen vollständig in "testdaf_breakdown" ein.
` : isGoethe ? `
1. Goethe-Zertifikat Bewertungsmaßstab:
   - Goethe A1: Teil 1 (max. 5 P. für 5 Lücken), Teil 2 (max. 10 P.: 3 Leitpunkte + Sprache).
   - Goethe A2: Teil 1 (max. 10 P.: Aufgabenbewältigung 5 P. + Angemessenheit 5 P.), Teil 2 (max. 10 P.).
   - Goethe B1: Teil 1 (max. 40 P.), Teil 2 (max. 40 P.), Teil 3 (max. 20 P.). Kriterien: Aufgabenbewältigung, Kohärenz, Wortschatz, Strukturen. Bestehensgrenze: 60%.
   - Goethe B2: Teil 1 (max. 60 P.: 4 Kriterien à 15 P.), Teil 2 (max. 40 P.: 4 Kriterien à 10 P.). Bestehensgrenze: 60%.
   Trage die erreichten und maximalen Punkte sowie die 4 Kriterien in "goethe_breakdown" ein.
` : ""}

2. Gründliche Fehleranalyse mit konkreter Korrektur und Erklärung für alle gefundenen Fehler (Grammatik, Wortschatz, Satzbau, Rechtschreibung, Ausdruck).

3. Eine vorbildliche Musterlösung (model_answer), die dem geforderten Niveau und Prüfungsformat exakt entspricht.

Gib die Antwort ausschließlich als valides JSON aus.
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
