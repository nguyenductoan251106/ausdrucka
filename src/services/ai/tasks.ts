import { GoogleGenAI, Type, Schema } from '@google/genai';
import { ExamId, Task } from '@/types';
import { EXAM_CONFIGS } from '@/lib/examConfig';

const ai = new GoogleGenAI({});

const taskSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    exam_id: { type: Type.STRING },
    teil_id: { type: Type.STRING },
    exam_name: { type: Type.STRING },
    teil_title: { type: Type.STRING },
    level: { type: Type.STRING },
    type: { type: Type.STRING },
    topic: { type: Type.STRING, description: "Kurzer, prägnanter Titel des Themas auf Deutsch" },
    situation: { 
      type: Type.STRING, 
      description: "Ausgangssituation und Szenario im genauen Stil der offiziellen Prüfung" 
    },
    materials: { 
      type: Type.STRING, 
      description: "Für TestDaF oder DSH: Detaillierter Lesetext, genaue Fakten/Zahlen einer statistischen Grafik oder kontroverse Zitate/Statements." 
    },
    instructions: { 
      type: Type.STRING, 
      description: "Die offizielle Aufgabenstellung und Arbeitsanweisung auf Deutsch" 
    },
    required_points: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Die verbindlichen Leitpunkte, auf die der Prüfling eingehen muss"
    },
    target_word_count: { type: Type.INTEGER },
    time_limit: { type: Type.STRING }
  },
  required: [
    "exam_id", 
    "teil_id", 
    "exam_name", 
    "teil_title", 
    "level", 
    "type", 
    "topic", 
    "instructions", 
    "required_points", 
    "target_word_count"
  ]
};

const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash'];

export async function generateExamWritingTask(
  examId: ExamId, 
  teilId: string
): Promise<Task> {
  const examConfig = EXAM_CONFIGS[examId] || EXAM_CONFIGS["goethe-b1"];
  const teilConfig = examConfig.teile.find(t => t.id === teilId) || examConfig.teile[0];

  const prompt = `
Erstelle eine authentische Schreibaufgabe exakt nach den offiziellen Vorgaben der deutschen Prüfung:
Prüfung: ${examConfig.name} (${examConfig.fullName})
Prüfungsteil: ${teilConfig.title}
Unterabschnitt / Format: ${teilConfig.subtitle}
Zielniveau: ${examConfig.cefrLevel}
Empfohlene Wortanzahl: ${teilConfig.wordCount}
Vorgesehene Bearbeitungszeit: ${teilConfig.timeLimit}
Offizielle Bewertungskriterien: ${teilConfig.officialCriteria.join(", ")}

Format-Spezifikationen nach Prüfungsordnung:
- Goethe A1:
  - Teil 1: Ein kurzer Informationstext (z.B. Hotelbuchung, Kursanmeldung), aus dem 5 konkrete Daten für ein Anmeldeformular entnommen werden müssen.
  - Teil 2: Eine alltägliche Situation (z.B. Einladung, Zusage, Entschuldigung, Termin) mit 3 kurzen Leitpunkten, Umfang ca. 30 Wörter.
- Goethe A2:
  - Teil 1: SMS / persönliche Kurznachricht an Freunde mit 3 Leitpunkten (ca. 20–30 Wörter).
  - Teil 2: Halbformelle E-Mail (z.B. an Vermieter, Kursleiter, Amt) mit Anrede, Gruß und 3 Leitpunkten (ca. 30–40 Wörter).
- Goethe B1:
  - Teil 1: Persönliche E-Mail an eine/n Freund/in. Erlebnis schildern, Gefühle begründen, Vorschlag/Treffen vereinbaren. Genau 3 Leitpunkte (ca. 80 Wörter).
  - Teil 2: Diskussionsbeitrag / Forumsbeitrag im Internet zu einem alltagsrelevanten Thema (z.B. soziale Medien, Konsum, Umwelt). Eigene Meinung darlegen und begründen (ca. 80 Wörter).
  - Teil 3: Formelle E-Mail (z.B. an den/die Dozenten/in oder Chef/in), warum man nicht kommen kann, höfliche Entschuldigung und Bitte um Verständnis/Material (ca. 40 Wörter).
- Goethe B2:
  - Teil 1: Forumsbeitrag zu einem aktuellen gesellschaftlichen Thema. Genau 4 Leitpunkte: 1. Meinung äußern, 2. Gründe für die eigene Meinung nennen, 3. Alternativen nennen, 4. Vor- oder Nachteile einer Alternative bewerten (ca. 150 Wörter).
  - Teil 2: Formelle Nachricht / geschäftliche E-Mail (z.B. Bitte um Auskunft, Beschwerde oder Reklamation) mit genauer Einleitung, Darstellung der Situation und Bitte um Lösung (ca. 100 Wörter).
- TestDaF:
  - Aufgabentyp 1: Diskussionsbeitrag auf der universitären Lernplattform. Ein Seminar mit Dozent und Kommilitonen zu einem akademischen Thema (z.B. berufliche Mobilität, Fernstudium, künstliche Intelligenz). Aufgabe: Vor- und Nachteile ausführlich für zwei Seiten (z.B. Arbeitnehmer & Unternehmen, oder Studierende & Universitäten) erläutern und begründen, eigene Position beziehen (mindestens 200 Wörter).
  - Aufgabentyp 2: Zusammenfassung von wissenschaftlichem Lesetext und statistischer Grafik für eine Hausarbeit.
    WICHTIG: Gib im Feld "materials" sowohl einen fundierten wissenschaftlichen Lesetext (ca. 150–200 Wörter mit Ursachen) als auch eine detaillierte textuelle Beschreibung der Grafik mit konkreten Prozentzahlen und Entwicklungstrends an (z.B. Ursachen und Folgen zu einem Umwelt- oder Technologiethema wie Bienensterben, Plastikmüll, Energiewende). Die Aufgabe verlangt, Informationen in eigenen Worten zusammenzufassen, ohne Textpassagen abzuschreiben (ca. 100–150 Wörter).
- DSH (Deutsche Sprachprüfung für den Hochschulzugang):
  - Textproduktion auf akademischem C1-Niveau.
  - Teil 1: Sachtext mit Grafik & Stellungnahme. Gib im Feld "materials" eine genaue wissenschaftliche Grafikbeschreibung mit konkreten Zahlen/Jahreszahlen und Tendenzen (z.B. Entwicklung der Sprachen in der Wissenschaft, Anteil internationaler Studierender). Die Aufgabe verlangt: 1. Einleitung mit Thema & Grafikbeschreibung, 2. Argumentation (Pro/Contra mit schlüssigen Begründungen), 3. Eigene begründete Stellungnahme als Schlusspunkt (ca. 250 Wörter).
  - Teil 2: Argumentativer Sachtext zu kontroversen Statements. Gib im Feld "materials" 2 bis 3 gegensätzliche Experten-Statements/Zitate an (z.B. zu Bildung, Privatschulen, Lehrerbenotung). Aufgabe verlangt argumentative Diskussion und persönliche Stellungnahme (ca. 250 Wörter).

Gib alle Ausgaben auf Deutsch und halte dich strikt an das JSON-Schema.
`;

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: taskSchema,
          temperature: 0.7,
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as Task;
        return {
          ...parsed,
          exam_id: examId,
          teil_id: teilId,
          exam_name: examConfig.name,
          teil_title: teilConfig.title,
          level: examConfig.cefrLevel,
          time_limit: teilConfig.timeLimit
        };
      }
    } catch (error) {
      console.warn(`Model ${model} error during exam task generation:`, error);
      lastError = error;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  throw lastError || new Error("Prüfungsaufgabe konnte nicht generiert werden.");
}
