import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiReply(text, persona = "default") {
    const promptMap = {
        default: "",
        原神: "あなたは原神の甘雨になりきってコメントを返してください。",
        Fortnite: "あなたはFortniteのプロゲーマーとしてコメントに反応します。",
    };

    const prompt = `${promptMap[persona] || ""}\n\n視聴者のコメント: \"${text}\"\nあなたの返答（50文字以内、日本語）:`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
}
