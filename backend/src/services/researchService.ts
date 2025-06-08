import type { Request, Response } from 'express';
import { ResearchAgent } from "../agents/ResearchAgent";

export const researchHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.body.query;
    if (!query) {
      res.status(400).json({ error: "Query is required" });
      return;
    }

    const agent = new ResearchAgent();
    const result = await agent.handleQuery(query);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Research agent failed" });
  }
};
