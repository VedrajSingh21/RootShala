import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

const apiKey1 = process.env.GEMINI_API_KEY_1 || "";
const ai = new GoogleGenAI({ apiKey: apiKey1 });

async function test() {
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Describe this image" },
            {
              inlineData: {
                data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
                mimeType: "image/png"
              }
            }
          ]
        }
      ]
    });
    console.log("Success:", res.text);
  } catch(e) {
    console.error("Error:", e);
  }
}

test();
