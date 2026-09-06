import { Router } from "express";
import {
  listConversations, getConversation, createConversation, updateConversation, closeConversation,
  listMessages, sendMessage,
} from "@/controllers/conversation.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listConversations);
router.post("/", createConversation);
router.get("/:id", getConversation);
router.patch("/:id", updateConversation);
router.patch("/:id/close", closeConversation);

router.get("/:conversationId/messages", listMessages);
router.post("/:conversationId/messages", sendMessage);

export default router;