import { Tool } from "@langchain/core/tools"; // Or "langchain/tools" if you're using full package
import { ResearchAgent } from "../agents/ResearchAgent";
export class ResearchTool extends Tool {
    constructor() {
        super(...arguments);
        this.name = "medical_research_tool";
        this.description = "Use this to research medical questions or summarize conditions.";
    }
    async _call(input) {
        const agent = new ResearchAgent();
        return await agent.handleQuery(input);
    }
}
