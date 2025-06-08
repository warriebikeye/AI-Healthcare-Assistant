import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import * as dotenv from 'dotenv';
dotenv.config(); // Ensure environment variables are loaded
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}
export const gemini = new ChatGoogleGenerativeAI({
    model: 'models/gemini-2.0-flash', // <-- updated model name here
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.GEMINI_API_KEY,
});
