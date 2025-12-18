import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async (pdfText: string) => {
  const ai = getClient();
  
  // Using gemini-2.5-flash for speed and high context window suitable for PDFs
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are an intelligent PDF assistant named "ChatPD". 
      Your goal is to answer questions specifically based on the provided PDF document content.
      
      Rules:
      1. Answer strictly based on the information in the document.
      2. If the answer is not in the document, politely state that you cannot find that information in the text.
      3. Be concise and clear. Format your answers nicely with Markdown (lists, bold text) where appropriate.
      4. If asked to summarize, provide a structured summary of the key points.
      
      DOCUMENT CONTENT START:
      ${pdfText}
      DOCUMENT CONTENT END
      `,
    }
  });

  return chatSession;
};

export const sendMessageStream = async (
  message: string,
  onChunk: (text: string) => void
): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  const result = await chatSession.sendMessageStream({ message });
  
  let fullResponse = "";
  for await (const chunk of result) {
    const text = chunk.text;
    if (text) {
        fullResponse += text;
        onChunk(fullResponse);
    }
  }
  return fullResponse;
};