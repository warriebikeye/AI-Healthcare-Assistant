import { BaseOutputParser } from "@langchain/core/output_parsers";
export class JsonOnlyOutputParser extends BaseOutputParser {
    get lc_namespace() {
        return ["healthcare", "output_parsers"];
    }
    getFormatInstructions() {
        return "Respond with ONLY valid JSON without any markdown or extra text.";
    }
    async parse(text) {
        const jsonText = this.extractJson(text);
        try {
            return JSON.parse(jsonText);
        }
        catch (e) {
            throw new Error(`Failed to parse JSON output: ${e.message}\nOutput was:\n${text}`);
        }
    }
    async parseWithPrompt(text, _prompt) {
        return this.parse(text);
    }
    extractJson(text) {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (match) {
            return match[1].trim();
        }
        return text.trim();
    }
}
