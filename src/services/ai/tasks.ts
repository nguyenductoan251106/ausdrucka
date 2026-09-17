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
    chart_data: {
      type: Type.OBJECT,
      description: "MUSS für TestDaF Aufgabentyp 2 und DSH Teil 1 (Sachtext mit Grafik) ausgefüllt werden! Enthält die Daten für das interaktive Balkendiagramm.",
      properties: {
        title: { type: Type.STRING, description: "Titel der Grafik, z.B. 'Erträge mit und ohne Bienenbestäubung (in %)' oder 'Anteil von Sprachen in der Wissenschaft (in %)'" },
        source: { type: Type.STRING, description: "Quelle der Daten, z.B. 'Quelle: Statistisches Bundesamt' oder 'Quelle: Wissenschaftsrat'" },
        unit: { type: Type.STRING, description: "Einheit der Werte, meist '%'" },
        categories: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }, 
          description: "4 bis 6 Balkenkategorien (z.B. ['Apfel', 'Birne', 'Kirsche', 'Bohne', 'Möhre'] oder ['1920', '1960', '1990', '2020'])" 
        },
        series: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name der Datenreihe (z.B. 'Mit Bestäubung', 'Ohne Bestäubung' oder 'Englisch', 'Deutsch')" },
              values: { 
                type: Type.ARRAY, 
                items: { type: Type.INTEGER },
                description: "Genaue Zahlenwerte für jede Kategorie" 
              }
            },
            required: ["name", "values"]
          }
        }
      },
      required: ["title", "unit", "categories", "series"]
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

  const hasGrafik = (examId === 'testdaf' && teilId === 'teil-2') || (examId === 'dsh' && teilId === 'teil-1');

  const prompt = `
Erstelle eine authentische Schreibaufgabe exakt nach den offiziellen Vorgaben der deutschen Prüfung:
Prüfung: ${examConfig.name} (${examConfig.fullName})
Prüfungsteil: ${teilConfig.title}
Unterabschnitt / Format: ${teilConfig.subtitle}
Zielniveau: ${examConfig.cefrLevel}
Empfohlene Wortanzahl: ${teilConfig.wordCount}
Vorgesehene Bearbeitungszeit: ${teilConfig.timeLimit}
Offizielle Bewertungskriterien: ${teilConfig.officialCriteria.join(", ")}

${hasGrafik ? `
ACHTUNG - DIESE AUFGABE BENÖTIGT EINE STATISTISCHE GRAFIK:
Du MUSST das Feld "chart_data" vollständig ausfüllen!
- Erstelle ein realistisches Balkendiagramm mit 4 bis 5 Kategorien.
- Enthält 1 bis 2 vergleichbare Datenreihen (z.B. 'Mit Bestäubung' vs. 'Ohne Bestäubung' oder 'Bachelor' vs. 'Master' oder '2010' vs. '2024').
- Gib im Feld "materials" den begleitenden wissenschaftlichen Lesetext an, der die Ursachen und Hintergründe des Themas erklärt.
` : ""}

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
  - Aufgabentyp 1: Diskussionsbeitrag auf der universitären Lernplattform. Ein Seminar mit Dozent und Kommilitonen zu einem akademischen Thema (z.B. berufliche Mobilität, Fernstudium, künstliche Intelligenz). Aufgabe: Vor- und Nachteile ausführlich für zwei Seiten (z.B. Arbeitnehmer & Unternehmen) erläutern und begründen, eigene Position beziehen (mindestens 200 Wörter).
  - Aufgabentyp 2: Lesetext und Grafik zusammenfassen (z.B. Thema Bienensterben, Plastikmüll, Erneuerbare Energien). 
    * Fülle "chart_data" mit konkreten Prozentwerten.
    * Gib im Feld "materials" den wissenschaftlichen Lesetext an (Ursachen).
    * Die Aufgabe verlangt, Ursachen aus dem Text und Folgen aus der Grafik in eigenen Worten zusammenzufassen, ohne Textpassagen abzuschreiben (ca. 100–150 Wörter).
- DSH (Deutsche Sprachprüfung für den Hochschulzugang):
  - Textproduktion auf akademischem C1-Niveau (ca. 250 Wörter).
  - Teil 1: Sachtext mit Grafik & Stellungnahme. 
    * Fülle "chart_data" mit konkreten statistischen Daten (z.B. Sprachen in wissenschaftlichen Publikationen, Entwicklung von Studiengebühren oder Online-Lehre).
    * Aufgabe verlangt: 1. Einleitung mit Thema & Grafikbeschreibung, 2. Differenzierte Pro/Contra-Argumentation, 3. Eigene begründete Stellungnahme als Schlusspunkt.
  - Teil 2: Argumentativer Sachtext zu kontroversen Statements. Gib im Feld "materials" 2 bis 3 gegensätzliche Experten-Statements/Zitate an (z.B. zu Privatschulen, Lehrerbenotung, Künstliche Intelligenz an Universitäten). Aufgabe verlangt argumentative Diskussion und persönliche Stellungnahme.

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
