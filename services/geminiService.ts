import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || 'dummy-key'; 
// Note: In a real scenario, we would check if apiKey exists and warn otherwise.
// Since the environment might not have it set in this demo context, we handle potential errors gracefully in the UI.

const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Transform history to Gemini format if needed, though simpler is often better for single turns
    // For this demo, we'll maintain a simple chat session structure conceptually
    
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are the SBI Card GenAI Assistant. You are helpful, professional, and secure. You assist employees with enterprise knowledge, market trends, and internal documentation. Keep responses concise and business-oriented.",
      }
    });

    return response.text || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently unable to connect to the GenAI service. Please check your network connection or API configuration.";
  }
};
