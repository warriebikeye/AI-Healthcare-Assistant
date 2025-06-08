import axios from "axios";
import { ResearchTool } from "../tools/researchTool";
import { CarePlanTool } from "../tools/carePlanTool";
import { MongoDBChatMessageHistory } from "@langchain/community/stores/message/mongodb";
import { BufferMemory } from "langchain/memory";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { getChatHistoryCollection } from "../utils/mongo";

import dotenv from "dotenv";

dotenv.config();

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export async function handleHealthcareQuery(userMessage: string, sessionId: string): Promise<string> {
  // 🧠 Initialize memory with sessionId
  const collection = await getChatHistoryCollection();

  const messageHistory = new MongoDBChatMessageHistory({
    collection,
    sessionId,
  });

  const memory = new BufferMemory({
    chatHistory: messageHistory,
    returnMessages: true,
    memoryKey: "chat_history",
  });

  // 📚 Retrieve chat history from memory
  const previousMessages = await memory.loadMemoryVariables({});
  const chatHistory = previousMessages.chat_history as (AIMessage | HumanMessage)[];
  const formattedHistory = chatHistory.map(msg =>
    msg._getType() === "human" ? `User: ${msg.content}` : `Assistant: ${msg.content}`
  ).join("\n");

  // 🛠️ Use tools
  const researchTool = new ResearchTool();
  const carePlanTool = new CarePlanTool();

  let toolResponse = "";
  if (userMessage.toLowerCase().includes("research")) {
    toolResponse = await researchTool._call(userMessage);
  } else if (userMessage.toLowerCase().includes("care plan")) {
    toolResponse = await carePlanTool._call(userMessage);
  }

  // 💬 Prompt includes memory
  const prompt = `
You are a helpful healthcare support assistant.

${toolResponse ? `Here is some background info you may find helpful:\n${toolResponse}\n` : ""}
This is the previous conversation:
${formattedHistory}

Now answer the following user question clearly and professionally.

User: ${userMessage}

Assistant:
`.trim();

  // 🔌 Send to Gemini
  const url = `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`;
  const data = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await axios.post<GeminiResponse>(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const answer = response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't provide a response to your question.";

    // 🧠 Save messages to memory
    await memory.saveContext(
      { input: userMessage },
      { output: answer }
    );

    return answer;
  } catch (err: any) {
    console.error("HealthcareAgent error:", err);
    return "An error occurred while processing your request.";
  }
}
