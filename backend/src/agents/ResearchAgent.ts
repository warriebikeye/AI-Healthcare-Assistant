import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { gemini } from "../utils/llm.ts";
import { CarePlanTool } from "../tools/carePlanTool.ts";
import { ResearchTool } from "../tools/researchTool.ts";

export class ResearchAgent {
  async handleQuery(query: string): Promise<string> {
    try {
      const tools = [new ResearchTool(), new CarePlanTool()];
      const model = gemini;

      const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "structured-chat-zero-shot-react-description",
        verbose: true,
      });

      const result = await executor.call({ input: query });
      return result.output;
    } catch (error) {
      console.error("ResearchAgent handleQuery error:", error);
      // Optionally rethrow or return a fallback value
      throw new Error("Failed to process the query. Please try again later.");
    }
  }
}

