import { GoogleGenAI } from '@google/genai';

function fallbackResponse(prompt: string) {
  return `I can help with that. Here's a concise explanation to start: ${prompt.slice(0, 180)}`;
}

export async function generateStudyAssistantReply(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackResponse(prompt);
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const result = await client.models.generateContent({
      model,
      contents: `You are a helpful study assistant for students. Keep replies concise and educational.\n\nStudent question: ${prompt}`,
    });

    return result.text || fallbackResponse(prompt);
  } catch {
    return fallbackResponse(prompt);
  }
}
