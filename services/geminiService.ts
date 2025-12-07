import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are LifeLink AI, a friendly and knowledgeable assistant for a blood donation application. 
      Your goal is to encourage blood donation, answer eligibility questions (e.g., age, weight, travel, tattoos), 
      and provide general health tips for donors (e.g., what to eat before donating). 
      Always advise users to consult with a doctor for specific medical conditions. 
      Keep answers concise, empathetic, and professional.`,
    },
  });
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  try {
    if (!chatSession) throw new Error("Chat session failed to initialize");
    
    const response: GenerateContentResponse = await chatSession.sendMessage({
      message: message
    });

    return response.text || "I'm having trouble processing that right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently offline. Please check your connection or try again later.";
  }
};