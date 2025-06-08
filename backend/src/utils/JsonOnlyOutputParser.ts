import { BaseOutputParser } from "@langchain/core/output_parsers";
import type { AgentAction, AgentFinish } from "@langchain/core/agents";

export class JsonOnlyOutputParser extends BaseOutputParser<AgentAction | AgentFinish> {
  get lc_namespace() {
    return ["healthcare", "output_parsers"];
  }

  getFormatInstructions(): string {
    return "Respond with ONLY valid JSON without any markdown or extra text.";
  }

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    const jsonText = this.extractJson(text);
    try {
      return JSON.parse(jsonText);
    } catch (e: any) {
      throw new Error(`Failed to parse JSON output: ${e.message}\nOutput was:\n${text}`);
    }
  }

  async parseWithPrompt(text: string, _prompt: any): Promise<AgentAction | AgentFinish> {
    return this.parse(text);
  }

  private extractJson(text: string): string {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) {
      return match[1].trim();
    }
    return text.trim();
  }
}
