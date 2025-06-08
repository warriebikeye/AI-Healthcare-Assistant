import { Router } from "express";
import { researchHandler } from "../services/researchService";
import { handleGeneralQuery } from "../services/healthcareAgentService";
const router = Router();
router.post("/agent", handleGeneralQuery);
router.post("/research", researchHandler); // 👈 Add this line
export default router;
