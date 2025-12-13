import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

// Initialize the chat session with specific system instructions for LifeLink
export const initializeChat = () => {
  try {
    // Access API Key safely. In a real build, process.env.API_KEY is replaced by the bundler.
    // We check if it exists to avoid runtime crashes if environment is not set up.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("Gemini API Key is missing. AI features will be limited.");
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are LifeLink AI, a compassionate and professional assistant for the 'LifeLink' blood donation platform.
        
        Your role is to:
        1. Assist users in finding donation centers and understanding the donation process.
        2. Verify eligibility (e.g., age 18-65, weight >50kg, good health).
        3. Answer health-related questions, including sensitive topics like sexual health, with privacy and professionalism. Always advise consulting a doctor for specific medical diagnoses.
        4. Explain app features (Admin Dashboard, Hospital Request system, Donor Profile).
        
        Tone: Empathetic, Encouraging, Professional, and Concise.
        Context: The user is currently using the LifeLink web app. Locations mentioned in the app are real (e.g., Nanjing).
        
        If asked about technical issues, suggest checking the user's connection or contacting support.`,
      },
    });
    
    console.log("LifeLink AI Initialized");
  } catch (error) {
    console.error("Failed to initialize LifeLink AI:", error);
  }
};

export const sendMessageToAI = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) {
      return "I'm currently offline (API Key missing). Please try again later or contact support.";
    }
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm having trouble processing that right now. Please check your internet connection and try again.";
  }
};