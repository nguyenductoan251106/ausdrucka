"use server";

import { analyzeExamSubmission } from "@/services/ai/feedback";

export interface FeedbackRequestPayload {
  text: string;
  examName?: string;
  teilTitle?: string;
  level: string;
  topic: string;
  instructions?: string;
  requiredPoints?: string[];
  materials?: string;
}

export async function processFeedback(payload: FeedbackRequestPayload | string, level?: string, topic?: string) {
  try {
    let text = "";
    let examName = "Prüfung";
    let teilTitle = "Schreiben";
    let targetLevel = "B1";
    let taskTopic = "Schreibaufgabe";
    let instructions = "Schreiben Sie einen passenden Text.";
    let requiredPoints: string[] = [];
    let materials: string | undefined = undefined;

    if (typeof payload === "string") {
      text = payload;
      targetLevel = level || "B1";
      taskTopic = topic || "Schreibaufgabe";
    } else {
      text = payload.text;
      examName = payload.examName || "Prüfung";
      teilTitle = payload.teilTitle || "Schreiben";
      targetLevel = payload.level || "B1";
      taskTopic = payload.topic || "Schreibaufgabe";
      instructions = payload.instructions || "";
      requiredPoints = payload.requiredPoints || [];
      materials = payload.materials;
    }

    const feedback = await analyzeExamSubmission(
      text,
      examName,
      teilTitle,
      targetLevel,
      taskTopic,
      instructions,
      requiredPoints,
      materials
    );

    return { 
      success: true, 
      feedback, 
      modelAnswer: feedback.model_answer 
    };
  } catch (error: any) {
    console.error("Feedback processing failed:", error);
    return { 
      success: false, 
      error: error.message || "Fehler bei der Analyse des Textes." 
    };
  }
}
