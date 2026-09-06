import { Router } from "express";
import {
  listForbiddenRules, createForbiddenRule, updateForbiddenRule, deleteForbiddenRule,
  listForbiddenEvents, detectForbiddenData, deleteForbiddenEvent,
} from "@/controllers/forbiddenData.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/rules", listForbiddenRules);
router.post("/rules", createForbiddenRule);
router.patch("/rules/:id", updateForbiddenRule);
router.delete("/rules/:id", deleteForbiddenRule);

router.get("/events", listForbiddenEvents);
router.post("/detect", detectForbiddenData);
router.delete("/events/:id", deleteForbiddenEvent);

export default router;