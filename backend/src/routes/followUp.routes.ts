import { Router } from "express";
import {
  listFollowUps, createFollowUp, updateFollowUp, markSent, markReplied, deleteFollowUp,
  getFollowUpSettings, createFollowUpSetting, updateFollowUpSetting, deleteFollowUpSetting,
} from "@/controllers/followUp.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listFollowUps);
router.post("/", createFollowUp);
router.patch("/:id", updateFollowUp);
router.patch("/:id/sent", markSent);
router.patch("/:id/replied", markReplied);
router.delete("/:id", deleteFollowUp);

router.get("/settings", getFollowUpSettings);
router.post("/settings", createFollowUpSetting);
router.patch("/settings/:id", updateFollowUpSetting);
router.delete("/settings/:id", deleteFollowUpSetting);

export default router;