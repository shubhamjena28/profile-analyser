import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { message, profileContext } = await request.json();

    if (!message || !profileContext) {
      return NextResponse.json({ error: "Missing message or profile context." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ reply: "API Key missing. Cannot provide live AI assistance." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are an AI Profile Assistant integrated into a career readiness platform.
You have the following analyzed profile context for the user:
${JSON.stringify(profileContext)}

The user asks: "${message}"

Answer the user directly, concisely, and professionally. Base your advice EXCLUSIVELY on their specific profile context provided above. Be encouraging but honest. Do not use markdown headers, just plain text or bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 500,
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: `Chat System Timeout: ${error.message || 'Unknown network error'}` },
      { status: 500 }
    );
  }
}
