import { v4 as uuidv4 } from "uuid";
import { handleHealthcareQuery } from "../agents/HealthCareAgent";
//const agent = new handleHealthcareQuery(); // singleton agent
export const handleGeneralQuery = async (req, res) => {
    try {
        const { query } = req.body;
        let { sessionId } = req.body;
        if (!query) {
            res.status(400).json({ error: "Missing 'query' in request body." });
            return;
        }
        // Auto-generate sessionId if not provided
        if (!sessionId) {
            sessionId = uuidv4();
        }
        const result = await handleHealthcareQuery(query, sessionId);
        res.json({ result, sessionId }); // Always return sessionId
    }
    catch (err) {
        console.error("Agent Error:", err);
        res.status(500).json({ error: "Healthcare agent failed." });
    }
};
