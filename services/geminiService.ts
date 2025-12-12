import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Ensure API Key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const createSwarmChat = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are the Devil AI Overseer, a highly advanced AI agent responsible for managing a distributed multi-agent system. 
      Your tone is precise, technical, and objective. 
      You assist the user in planning tasks, debugging code, and analyzing system performance.
      Always adhere to the Devil AI protocol: Be concise, structured, and objective.`,
    },
  });
};

export const sendMessageStream = async (
  chat: Chat, 
  message: string, 
  onChunk: (text: string) => void
): Promise<void> => {
  try {
    const result = await chat.sendMessageStream({ message });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n\n[SYSTEM ERROR: Unable to communicate with the Devil Core. Please check API Key configuration.]");
  }
};