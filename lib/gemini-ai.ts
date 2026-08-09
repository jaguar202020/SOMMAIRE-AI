import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

function getGenAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const genAI = getGenAI();
    const cleanedPdfText = pdfText.replace(/\s{2,}/g, " ").trim();

    const prompt = `${SUMMARY_SYSTEM_PROMPT}\n\nTransform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${cleanedPdfText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Empty response from Gemini API");
    }

    return result.candidates[0].content.parts[0].text;
  } catch (error: unknown) {
    console.error("Gemini API error:", error);
    throw error;
  }
};
