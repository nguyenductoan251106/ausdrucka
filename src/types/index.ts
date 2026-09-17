export type ExamId = 'goethe-a1' | 'goethe-a2' | 'goethe-b1' | 'goethe-b2' | 'testdaf' | 'dsh';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'B2-C1';

export type TaskType = 'email' | 'essay' | 'forum' | 'article' | 'message' | 'formular' | 'sachtext';

export interface ExamTeilConfig {
  id: string; // z.B. 'teil-1', 'teil-2', 'teil-3'
  title: string; // z.B. 'Teil 1: Persönliche E-Mail'
  subtitle: string;
  description: string;
  wordCount: string; // z.B. 'ca. 80 Wörter'
  targetWordCountNumber: number;
  timeLimit: string; // z.B. '20 Minuten'
  officialCriteria: string[];
}

export interface ExamConfig {
  id: ExamId;
  name: string; // 'Goethe A1', 'Goethe A2', 'Goethe B1', 'Goethe B2', 'TestDaF', 'DSH'
  cefrLevel: CefrLevel;
  fullName: string;
  description: string;
  badge: string;
  teile: ExamTeilConfig[];
}

export interface Task {
  id?: string;
  exam_id: ExamId;
  teil_id: string;
  exam_name: string;
  teil_title: string;
  level: string;
  type: string;
  topic: string;
  situation?: string; // Ausgangssituation / Kontext
  materials?: string; // Für TestDaF & DSH: Lesetext, Daten der Grafik, Zitate / Statements
  instructions: string;
  required_points: string[];
  target_word_count: number;
  time_limit?: string;
  created_at?: string;
}

export type ErrorCategory = 
  | 'Grammatik' 
  | 'Wortschatz' 
  | 'Satzbau' 
  | 'Rechtschreibung' 
  | 'Ausdruck' 
  | 'Textstruktur' 
  | 'Aufgabenbezug';

export type ErrorSeverity = 'minor' | 'major' | 'critical';

export interface FeedbackError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  original: string;
  correction: string;
  explanation: string;
  natural_alternative?: string;
}

export interface DshScoreBreakdown {
  inhalt_aufgabenbewaeltigung: number; // max 22
  textaufbau_kohaerenz: number; // max 12
  formale_richtigkeit: number; // max 30
  orthographie: number; // max 4
  ausdrucksvermoegen: number; // max 20
  kohaesion: number; // max 12
  gesamt_punkte: number; // max 100
  dsh_stufe: string; // 'DSH 1 (57-66%)', 'DSH 2 (67-81%)', 'DSH 3 (82-100%)', 'Nicht bestanden (<57%)'
}

export interface FeedbackData {
  overall_assessment: string;
  detected_level: string;
  strengths: string[];
  weaknesses: string[];
  errors: FeedbackError[];
  task_fulfillment_score: number; // 1-10
  model_answer: string;
  dsh_breakdown?: DshScoreBreakdown;
  exam_specific_feedback?: string;
}

export type SubmissionStatus = 'pending' | 'analyzing' | 'completed' | 'error';

export interface Submission {
  id: string;
  task_id: string;
  user_text?: string;
  image_url?: string;
  status: SubmissionStatus;
  feedback_data?: FeedbackData;
  model_answer?: string;
  created_at: string;
}
