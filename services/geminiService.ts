import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisReport, PossibleCondition } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatInstance: Chat | null = null;

const getChat = (): Chat => {
    if (!chatInstance) {
        chatInstance = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'You are a helpful and empathetic AI assistant specializing in general skin health. Provide informative, safe, and general advice. Do not provide medical diagnoses or prescriptions. Always encourage users to consult a healthcare professional for any medical concerns.',
            },
        });
    }
    return chatInstance;
};


const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeSkinCondition = async (
  base64Image: string,
  mimeType: string
): Promise<Omit<AnalysisReport, 'id' | 'date' | 'image'>> => {
  const imagePart = fileToGenerativePart(base64Image, mimeType);
  const textPart = {
      text: "You are an expert dermatological AI assistant. Analyze the provided image of a skin condition. Your response must be a valid JSON object, without any markdown formatting. Identify up to 3 possible conditions with their respective details. Provide a confidence score between 0 and 100 for each. Include general, non-prescriptive treatment suggestions and common symptoms."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            possible_conditions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the potential skin condition." },
                  confidence_score: { type: Type.NUMBER, description: "A score from 0 to 100 representing confidence." },
                  description: { type: Type.STRING, description: "A detailed description of the condition." },
                  symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Common symptoms associated with the condition." },
                  treatment_suggestions: { type: Type.STRING, description: "General, non-prescriptive advice. Start with 'General advice:'" }
                },
                required: ["name", "confidence_score", "description"]
              }
            },
            disclaimer: { type: Type.STRING, description: "A mandatory disclaimer about consulting a healthcare professional." }
          },
          required: ["possible_conditions", "disclaimer"]
        }
      }
    });

    const reportData = JSON.parse(response.text);
    
    // Ensure confidence scores are within 0-100 range
    reportData.possible_conditions.forEach((condition: PossibleCondition) => {
        condition.confidence_score = Math.max(0, Math.min(100, condition.confidence_score));
    });

    return reportData as Omit<AnalysisReport, 'id' | 'date' | 'image'>;
  } catch (error) {
    console.error("Error analyzing skin condition:", error);
    throw new Error("Failed to analyze the image. The model may be unable to process this specific image or there might be a network issue.");
  }
};

export const getChatResponse = async (prompt: string) => {
    const chat = getChat();
    return chat.sendMessageStream({ message: prompt });
};
