import { ExamConfig, ExamId } from "@/types";

export const EXAM_CONFIGS: Record<ExamId, ExamConfig> = {
  "goethe-a1": {
    id: "goethe-a1",
    name: "Goethe A1",
    cefrLevel: "A1",
    fullName: "Goethe-Zertifikat A1: Start Deutsch 1",
    badge: "Goethe A1",
    description: "Elementare Sprachverwendung: Formulare ausfüllen und kurze alltägliche Mitteilungen verfassen.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Formular ausfüllen",
        subtitle: "Informationen entnehmen & Formular ergänzen",
        description: "Lies einen kurzen Informationstext und trage 5 fehlende Angaben in ein Formular ein.",
        wordCount: "5 Angaben",
        targetWordCountNumber: 15,
        timeLimit: "ca. 10 Minuten",
        officialCriteria: ["Inhaltliche Richtigkeit (5 Punkte)", "Genauigkeit der Angaben"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Kurze Mitteilung / E-Mail",
        subtitle: "Persönliche Nachricht mit 3 Leitpunkten",
        description: "Schreibe eine kurze E-Mail oder Nachricht (z. B. Einladung, Entschuldigung, Termin) an eine Person und gehe auf alle 3 Leitpunkte ein.",
        wordCount: "ca. 30 Wörter",
        targetWordCountNumber: 35,
        timeLimit: "ca. 15 Minuten",
        officialCriteria: ["Berücksichtigung der 3 Leitpunkte", "Verständlichkeit & Wortschatz", "Elementare Grammatik"]
      }
    ]
  },
  "goethe-a2": {
    id: "goethe-a2",
    name: "Goethe A2",
    cefrLevel: "A2",
    fullName: "Goethe-Zertifikat A2",
    badge: "Goethe A2",
    description: "Grundlegende Kenntnisse: Persönliche Mitteilungen und einfache geschäftliche/halbformelle E-Mails schreiben.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Persönliche Kurznachricht",
        subtitle: "Nachricht an Freunde / Bekannte",
        description: "Schreibe eine kurze Nachricht (z. B. SMS oder Notiz) an eine befreundete Person und behandle dabei 3 vorgegebene Leitpunkte.",
        wordCount: "ca. 20–30 Wörter",
        targetWordCountNumber: 30,
        timeLimit: "ca. 15 Minuten",
        officialCriteria: ["Aufgabenbewältigung (3 Punkte)", "Verständlichkeit & Wortschatz", "Satzbau & Konnektoren (und, aber, weil)"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Halbformelle E-Mail",
        subtitle: "E-Mail an Kursleiter, Vermieter oder Behörde",
        description: "Verfasse eine höfliche kurze E-Mail (z. B. Termin absagen oder um Information bitten) unter Beachtung von Anrede, Grußformel und 3 Leitpunkten.",
        wordCount: "ca. 30–40 Wörter",
        targetWordCountNumber: 40,
        timeLimit: "ca. 15 Minuten",
        officialCriteria: ["Passende Anrede & Gruß", "Berücksichtigung aller 3 Leitpunkte", "Formale Korrektheit auf A2-Niveau"]
      }
    ]
  },
  "goethe-b1": {
    id: "goethe-b1",
    name: "Goethe B1",
    cefrLevel: "B1",
    fullName: "Goethe-Zertifikat B1",
    badge: "Goethe B1",
    description: "Selbstständige Sprachverwendung: Persönliche E-Mails, Forumsbeiträge und formelle Mitteilungen verfassen.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Persönliche E-Mail",
        subtitle: "Erlebnis schildern & Vorschlag machen",
        description: "Schreibe eine persönliche E-Mail an einen Freund/eine Freundin. Berichte von einem Erlebnis, begründe deine Gefühle und mache einen Vorschlag.",
        wordCount: "ca. 80 Wörter",
        targetWordCountNumber: 85,
        timeLimit: "ca. 20 Minuten",
        officialCriteria: ["Aufgabenbewältigung (alle 3 Leitpunkte)", "Kohärenz & Verknüpfungen (weil, da, obwohl)", "Wortschatz & grammatische Korrektheit"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Forumsbeitrag",
        subtitle: "Meinungsäußerung zu einem aktuellen Thema",
        description: "Verfasse einen Diskussionsbeitrag in einem Online-Forum zu einem kontroversen Alltagsthema. Begründe deine eigene Meinung klar und nachvollziehbar.",
        wordCount: "ca. 80 Wörter",
        targetWordCountNumber: 85,
        timeLimit: "ca. 25 Minuten",
        officialCriteria: ["Klare eigene Meinungsdarstellung", "Stichhaltige Argumente & Beispiele", "Angemessene Forumssprache"]
      },
      {
        id: "teil-3",
        title: "Teil 3: Formelle E-Mail",
        subtitle: "Höfliche Entschuldigung oder Anfrage",
        description: "Schreibe eine formelle E-Mail an eine Respektsperson (z. B. Kursleiter/in oder Arbeitgeber), entschuldige dein Fehlen höflich und begründe es.",
        wordCount: "ca. 40 Wörter",
        targetWordCountNumber: 45,
        timeLimit: "ca. 15 Minuten",
        officialCriteria: ["Höflicher, formeller Tonfall (Siezen)", "Passende Grußformeln", "Präzise Begründung"]
      }
    ]
  },
  "goethe-b2": {
    id: "goethe-b2",
    name: "Goethe B2",
    cefrLevel: "B2",
    fullName: "Goethe-Zertifikat B2",
    badge: "Goethe B2",
    description: "Fortgeschrittene Sprachkompetenz: Detaillierte Forumsbeiträge mit Argumentation und formelle geschäftliche Mitteilungen.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Diskussionsbeitrag im Forum",
        subtitle: "Umfassende Stellungnahme mit 4 Leitpunkten",
        description: "Schreibe einen differenzierten Beitrag für ein Online-Forum zu einem gesellschaftlichen Thema. Äußere deine Meinung, nenne Gründe, nenne Alternativen und bewerte Vor- und Nachteile.",
        wordCount: "ca. 150 Wörter",
        targetWordCountNumber: 155,
        timeLimit: "ca. 45 Minuten",
        officialCriteria: ["Vollständige Bearbeitung aller 4 Leitpunkte", "Textaufbau, Überleitungen & Kohärenz", "Differenzierter B2-Wortschatz & Satzstrukturen"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Formelle Nachricht / Beschwerde",
        subtitle: "Offizielle Mitteilung, Bitte oder Reklamation",
        description: "Verfasse eine formelle E-Mail oder einen formellen Brief im beruflichen/geschäftlichen Kontext (z. B. Bitte um Information, Beschwerde oder Stellungnahme).",
        wordCount: "ca. 100 Wörter",
        targetWordCountNumber: 105,
        timeLimit: "ca. 30 Minuten",
        officialCriteria: ["Angemessenes Register & Höflichkeitskonventionen", "Klare Gliederung & Begründungen", "Präziser formeller Wortschatz"]
      }
    ]
  },
  "testdaf": {
    id: "testdaf",
    name: "TestDaF",
    cefrLevel: "B2-C1",
    fullName: "Digitaler TestDaF: Prüfungsteil Schreiben",
    badge: "TestDaF",
    description: "Akademischer Hochschulzugang (TDN 3–5): Argumentative Texte im universitären Kontext verfassen und wissenschaftliche Daten zusammenfassen.",
    teile: [
      {
        id: "teil-1",
        title: "Aufgabentyp 1: Argumentativen Text schreiben",
        subtitle: "Diskussion auf einer universitären Lernplattform",
        description: "Diskutiere in einem universitären Forum mit Dozenten und Studierenden über ein wissenschaftliches oder gesellschaftliches Thema. Erläutere und begründe Pro- und Contra-Aspekte ausführlich.",
        wordCount: "mindestens 200 Wörter",
        targetWordCountNumber: 220,
        timeLimit: "30 Minuten",
        officialCriteria: ["Vollständige Erläuterung & Begründung von Vor- und Nachteilen", "Akademische Argumentationsstruktur & roter Faden", "Differenzierter wissenschaftssprachlicher Wortschatz"]
      },
      {
        id: "teil-2",
        title: "Aufgabentyp 2: Lesetext und Grafik zusammenfassen",
        subtitle: "Synthese wissenschaftlicher Daten und Fakten",
        description: "Fasse für eine wissenschaftliche Hausarbeit die Ursachen und Folgen eines Phänomens anhand des Lesetextes und der beigefügten Grafik in eigenen Worten zusammen (ohne abzuschreiben).",
        wordCount: "ca. 100–150 Wörter",
        targetWordCountNumber: 130,
        timeLimit: "30 Minuten",
        officialCriteria: ["Eigenständige Formulierung (kein Abschreiben)", "Korrekte Zusammenfassung von Textursachen & Grafikdaten", "Sachlicher, präziser Wissenschaftsstil"]
      }
    ]
  },
  "dsh": {
    id: "dsh",
    name: "DSH",
    cefrLevel: "C1",
    fullName: "Deutsche Sprachprüfung für den Hochschulzugang: Textproduktion",
    badge: "DSH",
    description: "Universitäre Hochschulprüfung (DSH 1–3): Strukturierte akademische Sachtexte mit Grafikbezug, Pro/Contra-Argumentation und fundierter Stellungnahme.",
    teile: [
      {
        id: "teil-1",
        title: "Textproduktion: Sachtext mit Grafik & Stellungnahme",
        subtitle: "Auswertung, wissenschaftliche Argumentation & Fazit",
        description: "Verfasse einen akademischen Sachtext: Einleitung zum Thema, präzise Beschreibung und Interpretation der statistischen Grafik, differenzierte Pro/Contra-Argumentation und begründete persönliche Stellungnahme.",
        wordCount: "ca. 250 Wörter (mind. 200)",
        targetWordCountNumber: 260,
        timeLimit: "ca. 70 Minuten",
        officialCriteria: [
          "Inhalt & Aufgabenstellung (22 Punkte)",
          "Textaufbau & Kohärenz (12 Punkte)",
          "Formale Richtigkeit: Morphologie, Syntax, Rektion (30 Punkte)",
          "Orthographie & Zeichensetzung (4 Punkte)",
          "Ausdrucksvermögen & Wissenschaftssprache (20 Punkte)",
          "Kohäsion & Konnektoren (12 Punkte)"
        ]
      },
      {
        id: "teil-2",
        title: "Textproduktion: Argumentation zu kontroversen Statements",
        subtitle: "Diskussion gesellschaftlicher Thesen & eigene Position",
        description: "Analysiere gegebene Statements und kontroverse Zitate zu einem Bildungsthema oder gesellschaftspolitischen Thema. Entwickle eine ausgewogene Argumentation und nimm fundiert Stellung.",
        wordCount: "ca. 250 Wörter (mind. 200)",
        targetWordCountNumber: 260,
        timeLimit: "ca. 70 Minuten",
        officialCriteria: [
          "Bezugnahme auf die vorgegebenen Zitate/Statements",
          "Logische Gedankenführung ('roter Faden')",
          "Komplexe Satzstrukturen (Passiv, Partizipien, Substantivierungen)",
          "DSH-Punktebewertung (max. 100 Punkte -> DSH 1, 2 oder 3)"
        ]
      }
    ]
  }
};

export const EXAM_LIST: ExamConfig[] = Object.values(EXAM_CONFIGS);
