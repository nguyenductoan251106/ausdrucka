import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

/**
 * Extracts text from a provided image using Gemini multimodal capabilities.
 * @param mimeType - The mime type of the image (e.g. 'image/jpeg')
 * @param base64Data - Base64 encoded image data
 * @returns The extracted text
 */
const candidateModels = ['gemini-3.6-flash', 'gemini-3.5-flash'];

export async function extractTextFromImage(mimeType: string, base64Data: string): Promise<string> {
  const prompt = `
Please extract all the handwritten or typed text from this image.
- Preserve the original spelling and grammar exactly as it is written.
- Do NOT correct any mistakes.
- Only return the text, no other commentary.
`;

  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        config: {
          temperature: 0.1,
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (error) {
      console.warn(`Model ${model} error during OCR:`, error);
      lastError = error;
      await new Promise((res) => setTimeout(res, 1000));
    }
  }

  throw lastError || new Error("Text extraction failed.");
}
