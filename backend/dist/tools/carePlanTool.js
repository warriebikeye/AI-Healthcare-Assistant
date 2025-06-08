import { Tool } from "@langchain/core/tools";
export class CarePlanTool extends Tool {
    constructor() {
        super(...arguments);
        this.name = "care_plan_tool";
        this.description = "Use this to generate a personalized care plan based on symptoms or diagnosis.";
    }
    async _call(input) {
        return `Here is a basic care plan based on: ${input}
- Rest and hydration
- Follow-up with doctor in 3 days
- Monitor symptoms and escalate if needed.`;
    }
}
