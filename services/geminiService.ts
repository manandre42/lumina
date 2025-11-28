
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Lesson } from "../types/index";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLessonContent = async (topic: string): Promise<Partial<Lesson> | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere uma lição de micro-aprendizado sobre "${topic}". 
      Deve ser concisa, educativa e envolvente, escrita em Português do Brasil.
      Retorne o resultado em formato JSON com 'title' (título), 'summary' (resumo máx 20 palavras), 'fullContent' (conteúdo completo máx 80 palavras) e 'category' (categoria).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            fullContent: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "summary", "fullContent", "category"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Lesson>;
    }
    return null;
  } catch (error) {
    console.error("Error generating lesson content:", error);
    return null;
  }
};

export const generateLessonAudio = async (text: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: `Leia este texto de forma clara, profissional e natural em Português: ${text}`,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return audioData || null;
  } catch (error) {
    console.error("Error generating audio:", error);
    return null;
  }
};
