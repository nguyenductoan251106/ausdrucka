"use server";

import { extractTextFromImage } from "@/services/ai/ocr";

export async function processImageUpload(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file uploaded");
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    const mimeType = file.type;

    const extractedText = await extractTextFromImage(mimeType, base64Data);

    return { success: true, text: extractedText };
  } catch (error: any) {
    console.error("OCR Action Error:", error);
    return { success: false, error: error.message || "Failed to extract text." };
  }
}
