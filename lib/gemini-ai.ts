import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

const getSummaryLengthGuidance = (wordCount: number) => {
  if (wordCount < 1200) {
    return {
      maxOutputTokens: 2200,
      guidance:
        "This is a short document. Create 3-5 summary cards with 2-4 substantive bullets per card.",
    };
  }

  if (wordCount < 6000) {
    return {
      maxOutputTokens: 4200,
      guidance:
        "This is a medium-length document. Create 5-8 summary cards with 3-5 substantive bullets per card.",
    };
  }

  return {
    maxOutputTokens: 7000,
    guidance:
      "This is a long document. Create 8-12 summary cards with 4-6 substantive bullets per card, covering the major sections and important details.",
  };
};

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
    const { maxOutputTokens, guidance } = getSummaryLengthGuidance(
      countWords(cleanedPdfText)
    );

    const prompt = `${SUMMARY_SYSTEM_PROMPT}

Document-specific guidance:
${guidance}

Summarize the following PDF text using the required card-ready markdown format:

${cleanedPdfText}`;

    const result = await genAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.4,
        maxOutputTokens,
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
