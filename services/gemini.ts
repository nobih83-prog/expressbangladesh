
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNewsSummary = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `বিকাশ করুন এই সংবাদের সারসংক্ষেপ (সংক্ষেপে): ${content}`,
      config: {
        systemInstruction: "You are a professional Bengali journalist. Provide a concise summary of the news provided."
      }
    });
    return response.text || "সারসংক্ষেপ পাওয়া যায়নি।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "সারসংক্ষেপ লোড করা যাচ্ছে না।";
  }
};
