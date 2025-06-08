import { Tool } from "@langchain/core/tools"; // Or "langchain/tools" if you're using full package
import { ResearchAgent } from "../agents/ResearchAgent.ts";

export class ResearchTool extends Tool {
  name = "medical_research_tool";
  description = "Use this to research medical questions or summarize conditions.";

  async _call(input: string): Promise<string> {
    const agent = new ResearchAgent();
    return await agent.handleQuery(input);
  }
}
