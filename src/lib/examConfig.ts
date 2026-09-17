import { ExamConfig, ExamId } from "@/types";

export const EXAM_CONFIGS: Record<ExamId, ExamConfig> = {
  "goethe-a1": {
    id: "goethe-a1",
    name: "Goethe A1",
    cefrLevel: "A1",
    fullName: "Goethe-Zertifikat A1: Start Deutsch 1",
    badge: "Goethe A1",
    description: "Formulare ausfüllen und kurze Alltagsmitteilungen schreiben.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Formular ausfüllen",
        subtitle: "Formular ausfüllen",
        description: "Wichtige Daten aus einem Text in ein Formular eintragen.",
        wordCount: "5 Angaben",
        targetWordCountNumber: 15,
        timeLimit: "ca. 10 Min.",
        officialCriteria: ["Inhaltliche Richtigkeit (5 Punkte)", "Genauigkeit"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Kurze Mitteilung",
        subtitle: "Mitteilung / E-Mail (ca. 30 Wörter)",
        description: "Kurze Nachricht oder E-Mail zu 3 Leitpunkten schreiben.",
        wordCount: "ca. 30 Wörter",
        targetWordCountNumber: 35,
        timeLimit: "ca. 15 Min.",
        officialCriteria: ["3 Leitpunkte", "Verständlichkeit", "Grundgrammatik"]
      }
    ]
  },
  "goethe-a2": {
    id: "goethe-a2",
    name: "Goethe A2",
    cefrLevel: "A2",
    fullName: "Goethe-Zertifikat A2",
    badge: "Goethe A2",
    description: "Persönliche Mitteilungen und einfache E-Mails verfassen.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Persönliche Kurznachricht",
        subtitle: "SMS / Notiz (ca. 20–30 Wörter)",
        description: "Kurze Nachricht an Freunde mit 3 Leitpunkten.",
        wordCount: "ca. 20–30 Wörter",
        targetWordCountNumber: 30,
        timeLimit: "ca. 15 Min.",
        officialCriteria: ["3 Leitpunkte", "Wortschatz", "Satzverbindungen"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Halbformelle E-Mail",
        subtitle: "E-Mail (ca. 30–40 Wörter)",
        description: "Höfliche E-Mail für Alltag, Amt oder Beruf mit 3 Leitpunkten.",
        wordCount: "ca. 30–40 Wörter",
        targetWordCountNumber: 40,
        timeLimit: "ca. 15 Min.",
        officialCriteria: ["Anrede & Gruß", "3 Leitpunkte", "Formale Richtigkeit"]
      }
    ]
  },
  "goethe-b1": {
    id: "goethe-b1",
    name: "Goethe B1",
    cefrLevel: "B1",
    fullName: "Goethe-Zertifikat B1",
    badge: "Goethe B1",
    description: "E-Mails, Forumsbeiträge und formelle Schreiben verfassen.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Persönliche E-Mail",
        subtitle: "Persönliche E-Mail (ca. 80 Wörter)",
        description: "Über ein Erlebnis berichten und einen Vorschlag machen.",
        wordCount: "ca. 80 Wörter",
        targetWordCountNumber: 85,
        timeLimit: "ca. 20 Min.",
        officialCriteria: ["3 Leitpunkte", "Kohärenz (weil, obwohl)", "Wortschatz"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Forumsbeitrag",
        subtitle: "Meinungsäußerung (ca. 80 Wörter)",
        description: "Eigene Meinung zu einem aktuellen Thema im Forum begründen.",
        wordCount: "ca. 80 Wörter",
        targetWordCountNumber: 85,
        timeLimit: "ca. 25 Min.",
        officialCriteria: ["Meinungsdarstellung", "Argumente & Beispiele", "Forumssprache"]
      },
      {
        id: "teil-3",
        title: "Teil 3: Formelle E-Mail",
        subtitle: "Formelle Mitteilung (ca. 40 Wörter)",
        description: "Höfliche Entschuldigung oder Bitte an Kursleiter/Vorgesetzte.",
        wordCount: "ca. 40 Wörter",
        targetWordCountNumber: 45,
        timeLimit: "ca. 15 Min.",
        officialCriteria: ["Formeller Ton (Sie)", "Grußformeln", "Präzise Begründung"]
      }
    ]
  },
  "goethe-b2": {
    id: "goethe-b2",
    name: "Goethe B2",
    cefrLevel: "B2",
    fullName: "Goethe-Zertifikat B2",
    badge: "Goethe B2",
    description: "Ausführliche Forumsbeiträge und formelle Korrespondenz.",
    teile: [
      {
        id: "teil-1",
        title: "Teil 1: Diskussionsbeitrag",
        subtitle: "Forumsbeitrag (ca. 150 Wörter)",
        description: "Differenzierte Stellungnahme mit Argumenten, Alternativen und Wertung.",
        wordCount: "ca. 150 Wörter",
        targetWordCountNumber: 155,
        timeLimit: "ca. 45 Min.",
        officialCriteria: ["4 Leitpunkte", "Textaufbau & Kohärenz", "Differenzierter Wortschatz"]
      },
      {
        id: "teil-2",
        title: "Teil 2: Formelle Nachricht",
        subtitle: "Offizielles Schreiben (ca. 100 Wörter)",
        description: "Schriftliche Bitte, Beschwerde oder Auskunftsanfrage.",
        wordCount: "ca. 100 Wörter",
        targetWordCountNumber: 105,
        timeLimit: "ca. 30 Min.",
        officialCriteria: ["Höflichkeitsform", "Klare Gliederung", "Präziser Wortschatz"]
      }
    ]
  },
  "testdaf": {
    id: "testdaf",
    name: "TestDaF",
    cefrLevel: "B2-C1",
    fullName: "Digitaler TestDaF: Prüfungsteil Schreiben",
    badge: "TestDaF",
    description: "Wissenschaftliche Texte und Datenauswertungen für das Studium.",
    teile: [
      {
        id: "teil-1",
        title: "Aufgabentyp 1: Argumentativer Text",
        subtitle: "Diskussion im Seminar (mind. 200 Wörter)",
        description: "Vor- und Nachteile zu einem universitären Thema begründet abwägen.",
        wordCount: "mind. 200 Wörter",
        targetWordCountNumber: 220,
        timeLimit: "30 Min.",
        officialCriteria: ["Argumentation & Begründung", "Roter Faden", "Wissenschaftssprache"]
      },
      {
        id: "teil-2",
        title: "Aufgabentyp 2: Text & Grafik zusammenfassen",
        subtitle: "Datensynthese (ca. 100–150 Wörter)",
        description: "Wissenschaftlichen Lesetext und Grafik in eigenen Worten zusammenfassen.",
        wordCount: "ca. 100–150 Wörter",
        targetWordCountNumber: 130,
        timeLimit: "30 Min.",
        officialCriteria: ["Eigenständige Formulierungen", "Fakten & Daten", "Sachlicher Stil"]
      }
    ]
  },
  "dsh": {
    id: "dsh",
    name: "DSH",
    cefrLevel: "C1",
    fullName: "Deutsche Sprachprüfung für den Hochschulzugang",
    badge: "DSH",
    description: "Akademische Textproduktion mit Grafik und Stellungnahme.",
    teile: [
      {
        id: "teil-1",
        title: "Textproduktion: Sachtext mit Grafik",
        subtitle: "Grafik & Argumentation (ca. 250 Wörter)",
        description: "Grafikbeschreibung, Pro/Contra-Argumentation und eigenes Fazit.",
        wordCount: "ca. 250 Wörter",
        targetWordCountNumber: 260,
        timeLimit: "ca. 70 Min.",
        officialCriteria: [
          "Inhalt (22 P.)",
          "Textaufbau (12 P.)",
          "Grammatik (30 P.)",
          "Ausdruck (20 P.)",
          "Kohäsion (12 P.)",
          "Rechtschreibung (4 P.)"
        ]
      },
      {
        id: "teil-2",
        title: "Textproduktion: Thesen-Diskussion",
        subtitle: "Statements erörtern (ca. 250 Wörter)",
        description: "Kontroverse Zitate analysieren, argumentieren und Stellung nehmen.",
        wordCount: "ca. 250 Wörter",
        targetWordCountNumber: 260,
        timeLimit: "ca. 70 Min.",
        officialCriteria: [
          "Bezug zu Zitaten",
          "Gedankenführung",
          "Komplexe Syntax",
          "DSH 1 / 2 / 3 Bewertung"
        ]
      }
    ]
  }
};

export const EXAM_LIST: ExamConfig[] = Object.values(EXAM_CONFIGS);
