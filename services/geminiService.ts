import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export type SearchResult = {
  text: string;
  sources: Array<{ uri: string; title: string }>;
};

export async function askAutomationExpert(query: string, language: string): Promise<SearchResult> {
  if (!ai) {
    console.warn("API Key not available");
    return { 
      text: "API Key missing. Please configure your environment.", 
      sources: [] 
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `You are an expert AI Automation Consultant for 'Automai' agency. 
        Answer the user's question about automation, Make, n8n, AI agents, or business efficiency concisely (max 3 sentences). 
        Use the Google Search tool to ensure your information is up-to-date.
        Respond in ${language === 'fr' ? 'French' : 'English'}.`,
      }
    });

    const text = response.text || (language === 'fr' ? "Je n'ai pas pu trouver de réponse." : "I couldn't generate a response.");
    
    // Extract grounding sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .map((c: any) => c.web ? { uri: c.web.uri, title: c.web.title } : null)
      .filter((s: any) => s !== null);

    return { text, sources };
  } catch (error) {
    console.error("Error querying Gemini:", error);
    return {
      text: language === 'fr' ? "Une erreur est survenue lors de la recherche." : "An error occurred during the search.",
      sources: []
    };
  }
}