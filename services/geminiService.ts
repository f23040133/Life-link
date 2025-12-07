import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

export const initializeChat = () => {
  try {
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are LifeLink AI, the intelligent virtual assistant for the LifeLink blood donation platform.
        
        ABOUT LIFELINK:
        - LifeLink is a premium digital platform connecting blood donors with hospitals and donation centers.
        - Features include: Real-time donor finding, Appointment scheduling, Health tracking, and Lives Saved rewards.
        - We operate globally (currently featuring Nanjing, China) with a focus on speed and saving lives.

        YOUR RESPONSIBILITIES:
        1. Blood Donation Info: Explain eligibility (age, weight, intervals), the process, and benefits.
        2. App Assistance: Guide users on how to register, find donors, or use the dashboard.
        3. Health Advice: Provide general health tips for donors (iron levels, hydration, post-donation care).
        4. Sexual Health & Sensitive Topics: You are a safe, non-judgmental space. Answer questions about sexual health, STIs, and how they relate to blood donation eligibility (e.g., waiting periods after high-risk behaviors). Be professional, empathetic, and scientifically accurate.

        TONE:
        - Professional, empathetic, warm, and encouraging.
        - For medical or sensitive issues, always include a disclaimer to consult a healthcare professional.
        - Keep answers concise but informative.`,
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat session", error);
  }
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
    // Attempt to re-initialize if session is stale/broken
    try {
        initializeChat();
        if (chatSession) {
            const response: GenerateContentResponse = await chatSession.sendMessage({
                message: message
            });
            return response.text || "I'm having trouble processing that right now.";
        }
    } catch (retryError) {
        console.error("Retry failed:", retryError);
    }
    return "I'm currently offline. Please check your connection or try again later.";
  }
};