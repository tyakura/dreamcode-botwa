import { Router } from "express";
import {
  listAgents, createAgent, updateAgent, deleteAgent,
  listKnowledge, createKnowledge, updateKnowledge, deleteKnowledge,
} from "@/controllers/aiAgent.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listAgents);
router.post("/", createAgent);
router.patch("/:id", updateAgent);
router.delete("/:id", deleteAgent);

router.get("/knowledge", listKnowledge);
router.post("/knowledge", createKnowledge);
router.patch("/knowledge/:id", updateKnowledge);
router.delete("/knowledge/:id", deleteKnowledge);

export default router;