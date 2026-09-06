import { Router } from "express";
import {
  listNotifications, markRead, markAllRead, deleteNotification, listAuditLogs,
} from "@/controllers/notification.controller";
import { authenticate } from "@/middleware/auth";

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get("/", listNotifications);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);
router.delete("/:id", deleteNotification);

router.get("/audit-logs", listAuditLogs);

export default router;