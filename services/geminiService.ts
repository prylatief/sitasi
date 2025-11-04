
import { GoogleGenAI } from "@google/genai";
import { ApiResponse, CitationStyle, CitationMode } from '../types';
import { SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set. Please add it to your environment.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateCitations = async (
  text: string,
  style: CitationStyle,
  mode: CitationMode
): Promise<ApiResponse> => {
  try {
    const userInput = JSON.stringify({ text, style, mode });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ text: userInput }]
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for more deterministic, factual output
      },
    });
    
    const responseText = response.text.trim();
    // The Gemini API can sometimes wrap the JSON in ```json ... ```, so we need to clean it.
    const cleanJsonText = responseText.replace(/^```json\s*|```\s*$/g, '');

    const result = JSON.parse(cleanJsonText);
    return result as ApiResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate citations: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating citations.");
  }
};
